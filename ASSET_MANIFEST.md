# 资产清单

## 运行文件

| 文件 | 用途 |
|---|---|
| `index.html` | 移动端游戏界面 |
| `complete.js` | PVE、路线、卡牌、弃牌循环、遗物与存档 |
| `complete.css` | 基础布局 |
| `polish.css` | 统一 5:7 卡牌、图鉴、详情与战斗特效 |
| `flow.css` | 英雄选择、三层地图、背景、扇形手牌与遗物 UI |

## 美术资产

| 文件 | 尺寸/内容 |
|---|---|
| `assets/card-art-atlas-v1.png` | 4×4 英雄肖像与早期卡图图集 |
| `assets/card-art-player-v2.png` | 4×4 玩家卡图图集 |
| `assets/card-art-neutral-enemy-v2.png` | 4×4 中立/敌方卡图图集 |
| `assets/card-art-boss-v2.png` | 4×4 敌方/首领/法术卡图图集 |
| `assets/battle-arena-bg-v1.png` | 1024×1536，竖屏黑铁熔炉战场，三线构图 |
| `assets/dungeon-map-bg-v1.png` | 1024×1536，竖屏多层地牢路线背景 |
| `public/og.png` | 社交分享预览图 |

所有运行时美术均存放在仓库内，GitHub Pages 不依赖外部图片链接。

## 交接与构建

- `README.md`：项目入口与玩法概览
- `AI_HANDOFF.md`：后续 AI 必读的完整状态
- `PROJECT_MANIFEST.json`：机器可读能力清单
- `scripts/build-static-site.mjs`：生成 `dist/client` 与 `dist/server`
- `tests/rendered-html.test.mjs`：静态站点和关键 PVE 逻辑验证
