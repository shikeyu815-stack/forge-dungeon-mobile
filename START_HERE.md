# 炉痕地牢 · AI 接手入口

这是一份截至 2026-07-17 的完整可交接快照。接手者请按以下顺序阅读：

1. `AI_HANDOFF.md`：项目现状、完整玩法、所有迭代、数据结构、已知问题和建议优先级。
2. `PROJECT_MANIFEST.json`：给 AI 或脚本读取的结构化项目清单。
3. `ASSET_MANIFEST.md`：四张卡图图集、两张竖屏背景和宣传图。
4. `DEPLOYMENT.md`：GitHub Pages 公开地址、源码仓库和后续发布方式。

当前游戏入口是根目录 `index.html`。权威逻辑是 `complete.js`；权威样式是 `complete.css`、`polish.css`、`flow.css`；全部运行时美术均在 `assets/`。

公开试玩：<https://shikeyu815-stack.github.io/forge-dungeon-mobile/>  
源码仓库：<https://github.com/shikeyu815-stack/forge-dungeon-mobile>

本项目是无第三方依赖的纯静态网页。直接打开 `index.html` 可本地试玩；使用 Node.js 22+ 运行 `pnpm test` 可重新构建并校验。不要编辑 `dist/` 或旧的 `public/game/` 镜像。

交接压缩包不含 `node_modules`、包缓存、Git 历史、临时构建产物或任何发布凭证。`CHECKSUMS.sha256` 用于核对包内文件完整性。
