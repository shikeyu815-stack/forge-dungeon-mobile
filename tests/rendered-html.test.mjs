import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const client = new URL("../dist/client/", import.meta.url);

function contentType(pathname) {
  if (pathname.endsWith(".html")) return "text/html; charset=utf-8";
  if (pathname.endsWith(".css")) return "text/css; charset=utf-8";
  if (pathname.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (pathname.endsWith(".png")) return "image/png";
  return "application/octet-stream";
}

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`),
    {
      ASSETS: {
        async fetch(request) {
          const url = new URL(request.url);
          const relative = url.pathname.replace(/^\//, "");
          try {
            const body = await readFile(new URL(relative, client));
            return new Response(body, {
              headers: { "content-type": contentType(url.pathname) },
            });
          } catch {
            return new Response("Not found", { status: 404 });
          }
        },
      },
    },
  );
}

test("serves the complete mobile game at the site root", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");

  const html = await response.text();
  assert.match(html, /<title>炉痕地牢 · 三层远征<\/title>/i);
  assert.match(html, /id="home-view"/);
  assert.match(html, /id="hero-view"/);
  assert.match(html, /viewport-fit=cover/);
  assert.match(html, /og:image/);
  assert.match(html, /complete\.js/);
});

test("ships the PVE loop, branching dungeon, relics and all art", async () => {
  const gameJs = await readFile(new URL("../dist/client/complete.js", import.meta.url), "utf8");
  const polishCss = await readFile(new URL("../dist/client/polish.css", import.meta.url), "utf8");
  const commercialCss = await readFile(new URL("../dist/client/commercial.css", import.meta.url), "utf8");
  const battleStageCss = await readFile(new URL("../dist/client/battle-stage.css", import.meta.url), "utf8");
  assert.match(gameJs, /const HERO_SPELLS=/);
  assert.match(gameJs, /function showStartingDeck/);
  assert.match(gameJs, /localStorage/);
  assert.match(gameJs, /const TOTAL_FLOORS=15/);
  assert.match(gameJs, /function createRoute/);
  assert.match(gameJs, /function offerRelic/);
  assert.match(gameJs, /function reshuffleDiscard/);
  assert.match(gameJs, /function drawCards/);
  assert.match(gameJs, /function endCheck\(\)\{if\(battle\.enemyHp>0&&battle\.playerHp>0\)return false/);
  assert.doesNotMatch(gameJs, /maxRound|boardScore|forgeUpdate|includeCustomCard/);
  assert.match(gameJs, /--fan-angle/);
  assert.match(gameJs, /function startBattle[\s\S]*?\$\('#lock-btn'\)\.disabled=false/);
  assert.match(gameJs, /function startBattle[\s\S]*?\$\('#phase'\)\.textContent='规划行动'/);
  assert.match(gameJs, /\$\('#lock-btn'\)\.disabled=battle\.resolving/);
  assert.match(gameJs, /el\.style\.outline=battle\.target===i/);
  assert.match(polishCss, /width:min\(100cqw,calc\(100cqh \* \.7142857\)\)/);
  assert.match(commercialCss, /battle-arena-bg-v2\.webp/);
  assert.match(commercialCss, /#battle-view \.hand/);
  assert.match(battleStageCss, /\.arena-geometry/);
  assert.match(battleStageCss, /\.battle-stage/);

  for (const path of [
    "dist/.openai/hosting.json",
    "dist/client/complete.css",
    "dist/client/polish.css",
    "dist/client/flow.css",
    "dist/client/commercial.css",
    "dist/client/battle-stage.css",
    "dist/client/og.png",
    "dist/client/assets/card-art-atlas-v1.png",
    "dist/client/assets/card-art-player-v2.png",
    "dist/client/assets/card-art-neutral-enemy-v2.png",
    "dist/client/assets/card-art-boss-v2.png",
    "dist/client/assets/battle-arena-bg-v1.png",
    "dist/client/assets/battle-arena-bg-v2.webp",
    "dist/client/assets/title-forge-bg-v1.webp",
    "dist/client/assets/dungeon-map-bg-v1.png",
  ]) {
    await access(new URL(path, root));
  }
});
