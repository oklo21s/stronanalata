import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { performance } from "node:perf_hooks";

const root = resolve(import.meta.dirname, "..");
const host = "127.0.0.1";
const port = 4177;
const baseUrl = `http://${host}:${port}/`;
const viteBin = resolve(root, "node_modules/vite/bin/vite.js");
const errors = [];
const timings = [];
const requestCount = 1_200;
const concurrency = 32;

const pages = ["index.html", "wystawy.html", "wydarzenia.html", "kolekcje.html", "zwiedzanie.html", "kontakt.html"];

const server = spawn(
  process.execPath,
  [viteBin, "preview", "--host", host, "--port", String(port), "--strictPort"],
  { cwd: root, stdio: ["ignore", "pipe", "pipe"] },
);

let stdout = "";
let stderr = "";
server.stdout.on("data", (chunk) => { stdout += chunk; });
server.stderr.on("data", (chunk) => { stderr += chunk; });

const sleep = (milliseconds) => new Promise((resolvePromise) => {
  setTimeout(resolvePromise, milliseconds);
});

function hash(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function percentile(values, fraction) {
  if (!values.length) return Number.NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1);
  return sorted[index];
}

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Serwer zakończył pracę podczas startu.\n${stdout}\n${stderr}`);
    }
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // Serwer może jeszcze otwierać port.
    }
    await sleep(50);
  }
  throw new Error(`Serwer nie uruchomił się w limicie czasu.\n${stdout}\n${stderr}`);
}

async function fetchBuffer(url, options) {
  const started = performance.now();
  const response = await fetch(url, options);
  const buffer = Buffer.from(await response.arrayBuffer());
  const elapsed = performance.now() - started;
  return { response, buffer, elapsed };
}

try {
  await waitForServer();

  const referenced = new Set();
  for (const page of pages) {
    referenced.add(new URL(page, baseUrl).href);
    const html = readFileSync(join(root, "dist", page), "utf8");
    for (const match of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)) {
      referenced.add(new URL(match[1], baseUrl).href);
    }
  }
  const urls = [...new Set([baseUrl, ...referenced, new URL("robots.txt", baseUrl).href])];
  const baselines = new Map();

  for (const url of urls) {
    const { response, buffer } = await fetchBuffer(url);
    if (!response.ok) errors.push(`Bazowy zasób ${url}: HTTP ${response.status}`);
    baselines.set(url, {
      bytes: buffer.length,
      digest: hash(buffer),
      contentType: response.headers.get("content-type"),
    });

    const head = await fetch(url, { method: "HEAD" });
    if (!head.ok) errors.push(`HEAD ${url}: HTTP ${head.status}`);
  }

  let nextRequest = 0;
  let successful = 0;
  let transferredBytes = 0;
  const stressStarted = performance.now();

  async function worker() {
    while (true) {
      const requestId = nextRequest;
      nextRequest += 1;
      if (requestId >= requestCount) return;

      const originalUrl = urls[requestId % urls.length];
      const requestUrl = `${originalUrl}${originalUrl.includes("?") ? "&" : "?"}stress=${requestId}`;

      try {
        const { response, buffer, elapsed } = await fetchBuffer(requestUrl, { cache: "no-store" });
        const baseline = baselines.get(originalUrl);
        timings.push(elapsed);

        if (!response.ok) {
          errors.push(`Stress ${requestUrl}: HTTP ${response.status}`);
          continue;
        }
        if (buffer.length !== baseline.bytes) {
          errors.push(`Stress ${requestUrl}: ${buffer.length} B zamiast ${baseline.bytes} B`);
          continue;
        }
        if (hash(buffer) !== baseline.digest) {
          errors.push(`Stress ${requestUrl}: niezgodna suma SHA-256`);
          continue;
        }

        successful += 1;
        transferredBytes += buffer.length;
      } catch (error) {
        errors.push(`Stress ${requestUrl}: ${error.message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  const stressDuration = performance.now() - stressStarted;

  const cancelled = await Promise.allSettled(Array.from({ length: 100 }, async (_, index) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), index % 3);
    try {
      await fetch(`${baseUrl}?cancel=${index}`, { signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }));
  const rejectedCancellations = cancelled.filter((result) => result.status === "rejected").length;

  const healthChecks = 50;
  for (let check = 0; check < healthChecks; check += 1) {
    if (server.exitCode !== null) {
      errors.push(`Serwer zakończył pracę podczas soak testu, kod ${server.exitCode}`);
      break;
    }

    const { response, buffer } = await fetchBuffer(`${baseUrl}?health=${check}`, { cache: "no-store" });
    const baseline = baselines.get(baseUrl);
    if (!response.ok || buffer.length !== baseline.bytes || hash(buffer) !== baseline.digest) {
      errors.push(`Kontrola zdrowia ${check}: odpowiedź jest niepełna lub zmieniona`);
      break;
    }
    await sleep(100);
  }

  const p50 = percentile(timings, 0.5);
  const p95 = percentile(timings, 0.95);
  const p99 = percentile(timings, 0.99);
  const maximum = Math.max(...timings);
  const requestsPerSecond = successful / (stressDuration / 1_000);

  if (successful !== requestCount) {
    errors.push(`Udane odpowiedzi: ${successful}/${requestCount}`);
  }
  if (![p50, p95, p99, maximum, requestsPerSecond].every(Number.isFinite)) {
    errors.push("Metryki stress testu zawierają NaN lub Infinity");
  }
  if (p99 > 1_000) errors.push(`p99 ${p99.toFixed(2)} ms przekracza limit 1000 ms`);
  if (server.exitCode !== null) errors.push(`Serwer zakończył się kodem ${server.exitCode}`);
  if (/\b(?:error|exception|unhandled)\b/i.test(stderr)) {
    errors.push(`Serwer zapisał błąd na stderr: ${stderr.trim()}`);
  }

  console.table([{
    zasoby: urls.length,
    żądania: requestCount,
    równoległość: concurrency,
    udane: successful,
    przesłane_MB: (transferredBytes / 1024 / 1024).toFixed(2),
    req_s: requestsPerSecond.toFixed(2),
    p50_ms: p50.toFixed(2),
    p95_ms: p95.toFixed(2),
    p99_ms: p99.toFixed(2),
    max_ms: maximum.toFixed(2),
  }]);
  console.log(`Anulowane przez klienta: ${rejectedCancellations}/100; serwer po nich przeszedł ${healthChecks} kontroli zdrowia.`);

  if (errors.length) {
    console.error("Stress test nieudany:\n- " + errors.slice(0, 30).join("\n- "));
    if (errors.length > 30) console.error(`...oraz ${errors.length - 30} kolejnych błędów.`);
    process.exitCode = 1;
  } else {
    console.log("Stress test serwera OK: brak błędów HTTP, uszkodzeń odpowiedzi i przerwania procesu.");
  }
} finally {
  server.kill();
  await Promise.race([
    new Promise((resolvePromise) => server.once("exit", resolvePromise)),
    sleep(2_000),
  ]);
}
