# 手机发布信息

- 公开试玩：https://shikeyu815-stack.github.io/forge-dungeon-mobile/
- GitHub 源码：https://github.com/shikeyu815-stack/forge-dungeon-mobile
- 发布日期：2026-07-16
- 发布来源：公开仓库 `main` 分支的根目录
- GitHub Pages 首次发布提交：`864bcb3d70df81da0b2f4c5aff489401fe9b8c1b`
- 卡图显示修复提交：`1da8982`（完整提交可在仓库历史中查看）
- 手机战线卡牌尺寸修复提交：`77397be`
- 当前战线尺寸修复已验证工作流：`pages-build-deployment #4`，运行 55 秒并成功完成

2026-07-16 已在独立浏览器中验证公开地址，页面标题为“炉痕地牢 · 完整试玩版”。使用 390×844 手机视口打开英雄初始牌组，卡框与不同卡牌的图集切片均正常显示。该地址无需登录 GitHub，手机浏览器可直接打开。

卡图故障记录：首次 Pages 发布时，图集 PNG 已经上传且可单独访问，但卡牌通过 CSS 自定义变量引用的背景没有触发对应图集资源加载，导致牌面美术区域呈黑色。修复后 `artStyle()` 同时写入明确的 `background-image`，`index.html` 预加载四张图集；不要退回仅依赖 `--art-image` 的实现。

战线尺寸故障记录：旧的 `.unit .standard-card` 强制使用槽位 100% 高度，同时又受窄战线的最大宽度限制，部分手机浏览器会将卡牌挤出或裁掉。修复后使用槽位容器单位同时计算可用宽高，卡牌按 5:7 比例取两者较小值。375×667 矮屏实测锁定后友方卡为 96×134、敌方卡为 106×148，均正常可见。

第三关卡死记录：战斗结算期间锁定按钮会被禁用；若上一战在结算路径中直接结束，按钮来不及恢复。新战斗虽然创建了新的 `battle` 对象，但复用的 DOM 按钮仍保持 `disabled`，造成地图第三关第一回合无法继续。修复后 `startBattle()` 明确恢复按钮、阶段文字和战线轮廓，`renderBattle()` 每次按当前 `battle.resolving` 同步按钮状态。线上已连续跑完第一战、第二关事件并进入第三关：第一回合锁定按钮为启用状态，铁屑侍从可选择左翼且轮廓正常高亮。页面资源版本已提升到 `20260716e`，避免手机继续使用旧脚本。

游戏进度写入当前浏览器的 `localStorage`，不会自动同步到另一台设备或另一个浏览器。当前不是 PWA，没有 Service Worker，也不能保证离线运行。

旧地址 `https://forge-dungeon-mobile.shikeyu815.chatgpt.site` 属于 OpenAI Sites 私有部署，普通浏览器可能看到 Cloudflare 拦截页，不再作为对外试玩入口。

后续更新方式：修改权威源文件并提交、推送到仓库的 `main` 分支，GitHub Pages 会自动重新发布。不要把令牌、Cookie 或 GitHub 凭证写入项目。
