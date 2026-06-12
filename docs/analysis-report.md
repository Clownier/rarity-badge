# 稀有度徽章 (Rarity Badge) 项目分析报告

## 一、项目概述

基于概率和数值膨胀的放置类（Idle/Incremental）网页游戏。玩家通过"掷出"获取不同稀有度的徽章，收集资源升级属性，追求更稀有的徽章。

- **技术栈**: React 18 + TypeScript + Vite 6 + Tailwind CSS
- **部署**: GitHub Pages (https://clownier.github.io/rarity-badge/)
- **状态**: 核心功能已实现，部分特性未完工

---

## 二、架构设计

### 2.1 整体架构

```
index.html → main.tsx → App.tsx → Game.tsx (主状态容器)
                                       ├── MainTab (游戏主界面)
                                       ├── IndexTab (稀有度索引)
                                       ├── AchievementTab (成就面板)
                                       ├── StatsTab (统计面板)
                                       └── OptionsTab (设置面板)
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
| 12 种稀有度（普通~非常传说） | `constants/index.ts` | ✅ |
| 掷出机制 + 自动掷出 | `gameLogic.ts` + `Game.tsx` | ✅ |
| 3 种周期升级（幸运/间隔/微光） | `gameLogic.ts` | ✅ |
| 3 种全局升级 | `gameLogic.ts` | ✅ |
| 重生系统 | `gameLogic.ts` + `Game.tsx` | ✅ |
| 成就系统（40项） | `achievementSystem.ts` | ✅ |
| 存档系统 (localStorage) | `saveSystem.ts` | ✅ |
| AES 加密导入/导出 | `saveSystem.ts` | ✅ |
| 中英文双语切换 | `Game.tsx` 内 `getText()` | ✅ |
| 离线进度计算 | `saveSystem.ts` | ✅ |
| 最近10次/最佳掷出记录 | `Game.tsx` | ✅ |
| 12 个 SVG 徽章图案 | `assets/badges/` | ✅ |
| 响应式 CSS | `styles/*.css` | ✅ |

### 3.2 未实现 / 不完整功能 🔶

| 功能 | 设计文档要求 | 现状 |
|------|------------|------|
| 28 种稀有度 | 编号 13~28（传说 beyond ~ 我永远不会原谅你） | 仅实现了 12 种（缺少 13~28 的 SVG 和常量） |
| 排行榜系统 | 后端 + API + 前100名显示 | 完全未实现，代码中仅有 `leaderboardParticipation` 字段 |
| 图表可视化 | 稀有度分布饼图、掷出历史折线图 | Recharts 已安装但未使用 |
| 音效系统 | 音效开关、音量调节 | 设置在 UI 中存在，无实际音效 |
| 自动保存 | 可配置频率的设置 | 设置中有 `autoSaveInterval` 但 `setupAutoSave` 未被调用 |
| 统计分析 | 游戏总时长、资源获取趋势图 | 基础统计有，图表未实现 |

### 3.3 代码质量问题 ⚠️

| 问题 | 位置 | 说明 |
|------|------|------|
| 重复的 Toast 类型 | `use-toast.ts` 第 8~13 行 | 类型从缺失的 `ui/toast.tsx` 移入，但原类型定义更完整，这个文件实际上未被使用 |
| 未使用的 `useMobile` | `hooks/use-mobile.tsx` | 定义了但未被任何组件使用 |
| 未使用的依赖 | `package.json` | recharts, cmdk, embla-carousel-react, vaul, sonner, next-themes, react-day-picker, react-resizable-panels, lucide-react 等约 10 个包已安装但未在源码中引用 |
| CSS 变量冗余 | `index.css` | sidebar 颜色变量（亮/暗两套）占大量空间但未被使用 |
| `AchievementTab.css` 样式未导入 | `main.tsx` | 未导入 `AchievementTab.css`（但 Game.css 中包含了成就相关样式，实际未发现问题） |
| 空 `App.css` | `src/App.css` | 空文件仅占位 |
| 多语言内嵌而非独立文件 | `Game.tsx` | `getText()` 函数直接在组件内硬编码中英文字符串，无独立 locale 文件，维护性差 |
| `formatNumber` 作用范围有限 | `gameLogic.ts` | 仅支持 K/M/B 三级，超过 B 会显示长小数 |
| 离线进度不完整 | `Game.tsx` | 离线弹窗可关闭，但微光增加并未实际应用到游戏状态 |

---

## 四、依赖分析

### 4.1 实际使用的依赖

```
react, react-dom           → UI 框架
crypto-js                  → 存档加密
clsx, tailwind-merge       → 样式工具
class-variance-authority   → 组件变体
tailwindcss-animate        → 动画
typescript                 → 类型
vite, vite-plugin-svgr     → 构建
tailwindcss, autoprefixer, postcss → 样式
eslint                     → 代码检查
```

### 4.2 已安装但未使用的依赖（可安全移除，节省 ~5MB）

```
lucide-react               → 图标库
recharts                   → 图表
cmdk                       → 命令面板
embla-carousel-react       → 轮播
input-otp                  → OTP 输入
next-themes                → 主题切换
react-day-picker           → 日期选择
react-resizable-panels     → 可调整面板
sonner                     → 通知
vaul                       → 抽屉
@radix-ui/* (大部分)       → 无障碍 UI
```

---

## 五、设计文档与实际实现的差距

`rarity_badge_final_design_document.md` 是完整设计蓝图，但实际代码有大量缩减：

| 设计文档 | 代码实现 |
|---------|---------|
| 28 种稀有度（概率至 1/134M） | 12 种（概率至 1/2048） |
| 完整 i18n locale 目录结构 | 内嵌 `getText()` 字符串 |
| `services/leaderboardService.ts` | 未实现 |
| `utils/crypto.ts` | 加密逻辑在 `saveSystem.ts` 中 |
| `locales/zh/` + `locales/en/` | 未创建 |
| `components/Game.tsx` + `MainTab.tsx` + `StatsTab.tsx` | 主界面和统计内嵌在 `Game.tsx` 中 |
| 图表可视化 | 未实现 |
| 音效系统 | 未实现 |
| 排行榜后端 | 未实现 |

---

## 六、推荐改进方向

### 高优先级
1. **补齐 13~28 号稀有度** — 设计文档已定义完整，缺 SVG 和常量
2. **清理无用依赖** — 移除 ~10 个未使用的包以减小体积
3. **修复自动保存** — `setupAutoSave` 功能未接入

### 中优先级
4. **提取 locale 文件** — 将内嵌的中英文字符串移入独立文件
5. **实现排行榜基础版** — 至少支持本地排行榜或接入简单后端
6. **图表可视化** — 利用已安装的 recharts 实现分布图/趋势图

### 低优先级
7. **音效系统** — 接入 Web Audio API
8. **离线进度完整实现** — 将微光增加真正应用到状态
9. **GitHub Actions 修复** — 排查 runner 无法分配的问题
