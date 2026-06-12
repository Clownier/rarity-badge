# 稀有度徽章 (Rarity Badge) 项目分析报告

## 一、项目概述

基于概率和数值膨胀的放置类（Idle/Incremental）网页游戏。玩家通过"掷出"获取不同稀有度的徽章，收集资源升级属性，追求更稀有的徽章。

- **技术栈**: React 18 + TypeScript + Vite 6 + Tailwind CSS
- **部署**: GitHub Pages (https://clownier.github.io/rarity-badge/)
- **版本**: 1.1.1
- **状态**: 核心功能完整，28 种稀有度全部实现

---

## 二、架构设计

### 2.1 整体架构

```
index.html → main.tsx → App.tsx → Game.tsx (主状态容器，274 行)
                                        ├── MainTab (游戏主界面，独立组件)
                                        ├── renderIndexTab (稀有度索引，内联)
                                        ├── AchievementTab (成就面板，独立组件)
                                        ├── StatsTab (统计面板，独立组件)
                                        └── OptionsTab (设置面板，独立组件)
```

**数据流**: 单向数据流。`Game.tsx` 持有 `PlayerState`，通过 props 下发给各 Tab 组件，Tab 组件通过回调 `onUpdatePlayer` 提交状态变更。

### 2.2 状态模型 (`PlayerState`)

`src/types/index.ts` 定义了核心状态，包含：

| 字段 | 说明 |
|------|------|
| `shimmer` / `achievementPoints` | 两种货币（微光/成就点） |
| `luck` / `rollInterval` / `shimmerMulti` | 周期内升级属性 |
| `globalLuck` / `globalIntervalReduction` / `globalShimmerMulti` | 全局升级属性（跨重生保留） |
| `upgrades` / `globalUpgrades` | 升级等级及价格 |
| `totalRarities[]` | 每种稀有度获得次数 |
| `last10Rolls[]` | 最近10次记录 |
| `bestRoll` | 最佳掷出 |
| `achievements{}` | 成就解锁状态 |
| `settings` | 语言、自动掷出、音量等 |
| `lastOnlineTime` | 离线进度用 |

### 2.3 游戏循环

`Game.tsx` 通过 `useEffect` + `setInterval` 以约 30 FPS 运行游戏循环：

```
每一帧: 更新 rollTimer 倒计时
        → 如果 autoRoll && timer=0 → 自动掷出
        → 检查成就
        → 渲染更新
```

### 2.4 核心算法

**掷出概率计算**:
```
effectiveLuck = luck × globalLuck
random = Math.random()
从最稀有向最普通遍历 RARITIES[]:
  如果 random < rarity.chance × effectiveLuck → 选中该稀有度
```

**微光获取**:
```
shimmerGain = 2^rarityId × shimmerMulti × globalShimmerMulti
```

**重生奖励**:
```
achievementPoints += max(1, floor((bestRollId - 6) / 2))
```

---

## 三、功能模块分析

### 3.1 已实现功能 ✅

| 模块 | 文件 | 状态 |
|------|------|------|
| 28 种稀有度（普通~我永远不会原谅你） | `constants/index.ts` | ✅ 2026-06-12 补齐 13~28 |
| 掷出机制 + 自动掷出 | `gameLogic.ts` + `Game.tsx` | ✅ |
| 3 种周期升级（幸运/间隔/微光） | `gameLogic.ts` | ✅ |
| 3 种全局升级 | `gameLogic.ts` | ✅ |
| 重生系统 | `gameLogic.ts` + `Game.tsx` | ✅ |
| 成就系统（动态生成，随 RARITIES 扩展） | `achievementSystem.ts` | ✅ |
| 存档系统 (localStorage) | `saveSystem.ts` | ✅ |
| 存档迁移（totalRarities 自动补零） | `saveSystem.ts` | ✅ 2026-06-12 |
| AES 加密导入/导出 | `saveSystem.ts` | ✅ |
| 中英文双语切换（独立 locale 文件） | `locales/{zh,en,index}.ts` | ✅ |
| 离线进度计算 | `saveSystem.ts` | ✅ |
| 最近10次/最佳掷出记录 | `MainTab.tsx` | ✅ |
| 28 个 SVG 徽章图案 | `assets/badges/badge_1.svg ~ badge_28.svg` | ✅ |
| 版本信息显示 + `/version` 端点 | `version.ts` + `public/version` | ✅ |
| formatNumber 支持 K/M/B/T | `gameLogic.ts` | ✅ |
| 响应式 CSS | `styles/*.css` | ✅ |

### 3.2 未实现 / 不完整功能 🔶

| 功能 | 设计文档要求 | 现状 |
|------|------------|------|
| 排行榜系统 | 后端 + API + 前100名显示 | 完全未实现，代码中仅有 `leaderboardParticipation` 字段 |
| 图表可视化 | 稀有度分布饼图、掷出历史折线图 | 未实现 |
| 音效系统 | 音效开关、音量调节 | 设置在 UI 中存在，无实际音效 |
| 统计分析 | 游戏总时长、资源获取趋势图 | 基础统计有，图表未实现 |
| 自动保存过时 | `setupAutoSave` 闭包捕获旧状态 | 已识别的 bug，尚未修复 |

### 3.3 代码质量现状 ⚠️

| 问题 | 位置 | 说明 |
|------|------|------|
| 未使用的 `use-toast.ts` | `src/hooks/use-toast.ts` | 200 行 toast 通知系统完全未使用 |
| 未使用的 `cn()` | `src/lib/utils.ts` | 已定义但从未导入 |
| 未使用的依赖 | `package.json` | `class-variance-authority`、`tailwindcss-animate` 已安装但未使用 |
| `formatNumber` 上限 T 级后 | `gameLogic.ts` | 超过 1e12 会显示长小数 |
| 离线进度不完整 | `saveSystem.ts` | 不会发现新稀有度、不解锁成就 |
| `IndexTab` 仍内联 | `Game.tsx` | 尚未拆分为独立组件 |

---

## 四、依赖分析

### 4.1 实际使用的依赖

```
react, react-dom           → UI 框架
crypto-js                  → 存档加密
clsx, tailwind-merge       → 样式工具
typescript                 → 类型
vite                       → 构建
tailwindcss, autoprefixer, postcss → 样式
eslint                     → 代码检查
```

### 4.2 已安装但未使用的依赖（可安全移除，节省 ~5MB）

```
class-variance-authority   → 组件变体
tailwindcss-animate        → 动画
vite-plugin-svgr           → SVG 作为组件（当前用 ?url 导入）
```

---

## 五、设计文档与实际实现的差距

`rarity_badge_final_design_document.md` 是完整设计蓝图，以下是当前代码的差距：

| 设计文档 | 代码实现 |
|---------|---------|
| 28 种稀有度（概率至 1/134M） | ✅ 已全部实现 |
| 完整 i18n locale 目录结构 | ✅ `src/locales/{zh,en,index}.ts` |
| `services/leaderboardService.ts` | ❌ 未实现 |
| `utils/crypto.ts` | 加密逻辑在 `saveSystem.ts` 中 |
| `components/Game.tsx` + `MainTab.tsx` + `StatsTab.tsx` | ✅ 已拆分 |
| 图表可视化 | ❌ 未实现 |
| 音效系统 | ❌ 未实现 |
| 排行榜后端 | ❌ 未实现 |

---

## 六、推荐改进方向

### 高优先级
1. ~~补齐 13~28 号稀有度~~ ✅ 已完成
2. ~~清理无用依赖~~ ✅ 已完成（精简 40 个包）
3. ~~提取 locale 文件~~ ✅ 已完成
4. **修复自动保存** — `setupAutoSave` 闭包捕获过时状态
5. **修复离线进度** — 不发现新稀有度、不解锁成就

### 中优先级
6. **实现排行榜基础版** — 至少支持本地排行榜或接入简单后端
7. **图表可视化** — 稀有度分布饼图、掷出历史折线图
8. **实现音效系统** — 接入 Web Audio API
9. **清理 `use-toast.ts` 死代码** — 200 行未使用

### 低优先级
10. **GitHub Actions 修复** — 排查 runner 无法分配的问题
