import { spawnSync } from "node:child_process";

function normalizeBaseUrl(url) {
  const trimmed = String(url ?? "").trim();
  if (!trimmed) return "";
  return trimmed.replace(/\/+$/, "");
}

const baseUrl =
  normalizeBaseUrl(process.env.BENCH_URL) ||
  normalizeBaseUrl(process.env.npm_package_config_prodUrl);

if (!baseUrl) {
  console.error(
    "Missing base URL. Set BENCH_URL or package.json config.prodUrl."
  );
  process.exit(1);
}

const url = `${baseUrl}/api/health`;

const connections = process.env.BENCH_C ? Number(process.env.BENCH_C) : 20;
const durationSec = process.env.BENCH_D ? Number(process.env.BENCH_D) : 15;

console.log(`Running autocannon @ ${url}`);
console.log(`Connections: ${connections}, Duration: ${durationSec}s`);

const result = spawnSync(
  "npx",
  ["autocannon", "-c", String(connections), "-d", String(durationSec), url],
  { stdio: "inherit", shell: true }
);

process.exit(result.status ?? 1);
