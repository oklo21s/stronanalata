import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { performance } from "node:perf_hooks";

const root = resolve(import.meta.dirname, "..");
const host = "127.0.0.1";
const port = 4176;
const baseUrl = `http://${host}:${port}/`;
const viteBin = resolve(root, "node_modules/vite/bin/vite.js");
const errors = [];

const pages = ["index.html", "wystawy.html", "wydarzenia.html", "kolekcje.html", "zwiedzanie.html", "kontakt.html"];

const server = spawn(
  process.execPath,
  [viteBin, "preview", "--host", host, "--port", String(port), "--strictPort"],
  { cwd: root, stdio: ["ignore", "pipe", "pipe"] },
);

let serverLog = "";
server.stdout.on("data", (chunk) => { serverLog += chunk; });
server.stderr.on("data", (chunk) => { serverLog += chunk; });

const sleep = (milliseconds) => new Promise((resolvePromise) => {
  setTimeout(resolvePromise, milliseconds);
});

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Serwer zakończył pracę.\n${serverLog}`);
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // Preview może potrzebować kilku prób na uruchomienie.
    }
    await sleep(50);
  }
  throw new Error(`Serwer nie uruchomił się w limicie czasu.\n${serverLog}`);
}

function percentile(values, fraction) {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1);
  return sorted[index];
}

async function benchmark(url, requests = 40) {
  const samples = [];
  let bytes = 0;

  for (let index = 0; index < requests; index += 1) {
    const started = performance.now();
    const response = await fetch(url, { cache: "no-store" });
    const body = await response.arrayBuffer();
    const elapsed = performance.now() - started;

    if (!response.ok) errors.push(`${url}: HTTP ${response.status}`);
    samples.push(elapsed);
    bytes = body.byteLength;
  }

  return {
    url,
    requests,
    bytes,
    median: percentile(samples, 0.5),
    p95: percentile(samples, 0.95),
    maximum: Math.max(...samples),
  };
}

try {
  await waitForServer();

  // Każda podstrona musi odpowiadać HTTP 200, wraz ze wszystkimi zasobami,
  // do których się odwołuje.
  const internalAssets = new Set();
  for (const page of pages) {
    const pageUrl = new URL(page, baseUrl).href;
    const response = await fetch(pageUrl);
    if (!response.ok) errors.push(`${pageUrl}: HTTP ${response.status}`);

    const html = readFileSync(join(root, "dist", page), "utf8");
    for (const match of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)) {
      internalAssets.add(new URL(match[1], baseUrl).href);
    }
  }

  for (const url of internalAssets) {
    const response = await fetch(url);
    if (!response.ok) errors.push(`${url}: brak zasobu, HTTP ${response.status}`);
  }

  const heroUrl = new URL("./assets/hero-muzeum-koncept.svg", baseUrl).href;
  const results = [
    await benchmark(baseUrl),
    await benchmark(new URL("wystawy.html", baseUrl).href),
    await benchmark(heroUrl),
  ];

  for (const result of results) {
    if (!Number.isFinite(result.median) || !Number.isFinite(result.p95)) {
      errors.push(`${result.url}: pomiar zwrócił NaN lub Infinity`);
    }
    if (result.p95 > 100) {
      errors.push(`${result.url}: lokalne p95 ${result.p95.toFixed(2)} ms przekracza 100 ms`);
    }
  }

  console.table(results.map((result) => ({
    URL: result.url,
    żądania: result.requests,
    bajty: result.bytes,
    mediana_ms: result.median.toFixed(2),
    p95_ms: result.p95.toFixed(2),
    max_ms: result.maximum.toFixed(2),
  })));

  if (errors.length) {
    console.error("Test serwera nieudany:\n- " + errors.join("\n- "));
    process.exitCode = 1;
  } else {
    console.log(`Test serwera OK: ${pages.length} podstron i ${internalAssets.size} zasobów odpowiada HTTP 200.`);
  }
} finally {
  server.kill();
  await Promise.race([
    new Promise((resolvePromise) => server.once("exit", resolvePromise)),
    sleep(2000),
  ]);
}
