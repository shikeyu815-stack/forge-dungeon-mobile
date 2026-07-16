# 炉痕地牢 · 资产清单

快照日期：2026-07-16

## 1. 当前运行资产

离线游戏的最小运行集共 9 个文件：

| 文件 | 用途 |
|---|---|
| `index.html` | 九个视图、卡牌详情层、底部抽屉和全部页面结构 |
| `complete.js` | 权威内容数据、战斗、远征、存档和交互逻辑 |
| `complete.css` | 基础手机布局；当前为单行压缩 CSS |
| `polish.css` | 统一卡牌模板、图鉴、动效、详情、铸卡与视觉覆盖 |
| `flow.css` | 英雄选择、初始牌组预览、自铸牌槽和新版开局流程 |
| `assets/card-art-atlas-v1.png` | 英雄肖像和默认图 |
| `assets/card-art-player-v2.png` | 英雄单位卡图 |
| `assets/card-art-neutral-enemy-v2.png` | 逐影高阶、中立、普通敌军和自定义卡图 |
| `assets/card-art-boss-v2.png` | 菌群、精英、Boss 和三张法术卡图 |

根目录运行集约 11.61 MB，不依赖任何运行时网络请求。

## 2. 图集规格

四张卡图图集均为：

- 文件格式：PNG
- 分辨率：1254 × 1254
- 网格：4 × 4
- 图格数量：16
- CSS：`background-size: 400% 400%`
- 索引规则：`x = index % 4`，`y = floor(index / 4)`

唯一映射定义位于 `complete.js`：

- `ART_ATLASES`
- `CARD_ART`
- `PORTRAIT_ART`
- `cardArtRef()`
- `artStyle()`

### `card-art-atlas-v1.png`

- 0：铸炉者肖像
- 1：孢子之母肖像
- 2：逐影者肖像
- 3：默认备用人物图
- 其余图格当前未通过固定卡映射使用

### `card-art-player-v2.png`

- 0–5：F1–F6，铸炉者单位
- 6–11：S1–S6，孢子之母单位
- 12–15：H1–H4，逐影者前四张单位
- 16 格全部使用

### `card-art-neutral-enemy-v2.png`

- 0–1：H5–H6，逐影者高阶单位
- 2–7：N1–N6，中立单位
- 8–10：灰烬鼠群
- 11–14：炉渣教团
- 15：CUSTOM，自定义卡固定图
- 16 格全部使用

### `card-art-boss-v2.png`

- 0–3：腐化菌群
- 4–7：失控铸甲
- 8–12：深炉看守者
- 13：SS1 腐孢云
- 14：FS1 回火结界
- 15：HS1 影隙突袭
- 16 格全部使用

47 张图鉴固定卡均有独立图格；自定义卡另占一个固定图格。

## 3. 分享封面

`public/og.png` 是本轮为手机链接生成的分享封面：

- 用途：Open Graph / X 大图预览
- 内容：炉火地牢、三条战线、铸炉/孢子/逐影三种卡牌视觉
- 主标题：`炉痕地牢`
- 副标题：`三线卡牌远征`
- 风格：暗金旧金属、熔火橙、孢子绿和暗影青
- 生成方式：OpenAI 内置图像生成

最终生成提示：

```text
Use case: ads-marketing
Asset type: landscape social link preview for a mobile browser game
Primary request: Create a complete polished social card for a dark-fantasy Chinese mobile card roguelike named 炉痕地牢.
Scene/backdrop: a shadowy underground forge dungeon with an ember-lit three-lane battlefield receding into darkness.
Subject: three ornate fantasy cards in the foreground, one iron-and-fire guardian, one fungal poison creature, and one teal-shadow rogue, with a bright collision spark at the center lane.
Style/medium: premium painterly dark fantasy game key art, tactile aged metal card frames, not a UI screenshot.
Composition/framing: 3:2 landscape, strong centered composition, readable at small thumbnail size; title in the upper left and visual action to the right.
Lighting/mood: deep charcoal shadows, molten amber highlights, restrained teal and fungal green accents, dramatic but legible.
Text (verbatim): "炉痕地牢"
Secondary text (verbatim): "三线卡牌远征"
Constraints: render both Chinese text lines exactly once and clearly; no other words, no logos, no watermark, no browser chrome, no phone frame, no tiny interface text.
```

## 4. 构建复制关系

`scripts/build-static-site.mjs` 在 `npm run build` 时执行：

```text
根目录权威源
  index.html
  complete.js
  complete.css
  polish.css
  flow.css
  assets/*
      ↓ 自动复制
dist/client/*
```

同时生成 `dist/server/index.js`，将站点根路径交给静态资源服务。`dist/` 和旧的 `public/game/` 都不是编辑入口。

## 5. 当前缺失的源资产

以下内容目前不存在，接手者不要假设可以找到：

- 图集分层文件
- 单张卡牌切图
- 原始 Logo 工程文件
- 四张卡图图集的完整生成提示词历史
- 卡图逐张授权或来源记录
- 音效、音乐、字体包
- 真机截图、商店截图
- PWA 图标与启动图

若要商业发布，应先补齐美术来源与授权记录。

## 6. 完整性校验

交接包根目录包含 `CHECKSUMS.sha256`。解压后可通过 SHA-256 对照文件是否在传输中损坏。
