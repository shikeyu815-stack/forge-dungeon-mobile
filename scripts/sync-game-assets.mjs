import { copyFile, cp, mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = resolve(root, "public");
const target = resolve(publicRoot, "game");

if (
  !(
    target === publicRoot ||
    target.startsWith(`${publicRoot}\\`) ||
    target.startsWith(`${publicRoot}/`)
  )
) {
  throw new Error("Refusing to sync outside public/");
}

await mkdir(join(target, "assets"), { recursive: true });

for (const file of [
  "index.html",
  "complete.js",
  "complete.css",
  "polish.css",
  "flow.css",
]) {
  await copyFile(join(root, file), join(target, file));
}

await cp(join(root, "assets"), join(target, "assets"), {
  recursive: true,
  force: true,
});

console.log("Synced playable game to public/game");
