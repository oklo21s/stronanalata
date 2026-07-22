import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const viteBin = resolve(root, "node_modules/vite/bin/vite.js");

function build() {
  const result = spawnSync(process.execPath, [viteBin, "build"], {
    cwd: root,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    console.error(result.stdout);
    console.error(result.stderr);
    process.exit(result.status ?? 1);
  }
}

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = resolve(directory, entry.name);
    return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
  });
}

function snapshot() {
  const dist = resolve(root, "dist");
  return Object.fromEntries(listFiles(dist).sort().map((file) => [
    relative(dist, file).replaceAll("\\", "/"),
    createHash("sha256").update(readFileSync(file)).digest("hex"),
  ]));
}

build();
const first = snapshot();
build();
const second = snapshot();

if (JSON.stringify(first) !== JSON.stringify(second)) {
  console.error("Dwa kolejne buildy nie są identyczne.");
  console.error({ first, second });
  process.exit(1);
}

console.log(`Build deterministyczny: ${Object.keys(first).length} plików ma identyczne SHA-256 po dwóch kompilacjach.`);
