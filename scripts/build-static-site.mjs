import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const client = join(dist, "client");
const server = join(dist, "server");

const runtimeFiles = [
  "index.html",
  "complete.js",
  "complete.css",
  "polish.css",
  "flow.css",
  "commercial.css",
];

const workerSource = `const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/") url.pathname = "/index.html";

    const response = await env.ASSETS.fetch(new Request(url, request));
    const headers = new Headers(response.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    if (url.pathname === "/index.html") {
      headers.set("Cache-Control", "no-cache");
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

export default worker;
`;

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

for (const file of runtimeFiles) {
  await cp(join(root, file), join(client, file));
}

await cp(join(root, "assets"), join(client, "assets"), { recursive: true });
await cp(join(root, "public", "og.png"), join(client, "og.png"));
await mkdir(join(dist, ".openai"), { recursive: true });
await cp(
  join(root, ".openai", "hosting.json"),
  join(dist, ".openai", "hosting.json"),
);
await writeFile(join(server, "index.js"), workerSource, "utf8");
await writeFile(
  join(dist, "build-manifest.json"),
  JSON.stringify(
    {
      format: "cloudflare-workers-static-assets",
      entry: "server/index.js",
      assets: "client",
      source: runtimeFiles,
      generatedAt: new Date().toISOString(),
    },
    null,
    2,
  ) + "\n",
  "utf8",
);

console.log(`Built mobile game into ${dist}`);
