# 稀有度徽章 (Rarity Badge) 项目分析报告

## 一、项目概述

基于概率和数值膨胀的放置类（Idle/Incremental）网页游戏。玩家通过"掷出"获取不同稀有度的徽章，收集资源升级属性，追求更稀有的徽章。

- **技术栈**: React 18 + TypeScript + Vite 6 + Tailwind CSS
- **部署**: GitHub Pages (https://clownier.github.io/rarity-badge/)
- **版本**: 1.2.3
- **状态**: 核心功能完整，28 种稀有度全部实现

---

## 二、架构设计

### 2.1 整体架构

```
index.html → main.tsx → App.tsx → Game.tsx (主状态容器，251 行)
                                        ├── MainTab (游戏主界面，独立组件)
                                        ├── IndexTab (稀有度索引，独立组件)
                                        ├── AchievementTab (成就面板，独立组件)
                                        ├── StatsTab (统计面板，独立组件)
                                        └── OptionsTab (设置面板，独立组件)
```

**数据流**: 单向数据流。`Game.tsx` 持有 `PlayerState`，通过 props 下发给各 Tab 组件，Tab 组件通过回调 `onUpdatePlayer` 提交状态变更。

### 2.2 状态模型 (`PlayerState`)

`src/types/index.ts` 定义了核心状态，包含：

| 字段 | 说明 |
|------|------|
| `shimmer` / `achievementPoints` | 两种货币（微光/成就点AP） |
| `luck` / `rollInterval` / `shimmerMulti` | 周期内升级属性 |
| `regenLuck` / `regenShimmerMulti` / `regenRLuck` / `regenGlistenMulti` | 重生继承属性 |
| `upgrades` / `regenUpgrades` | 升级等级及价格 |
| `totalRarities[]` / `totalRegenRarities[]` | 每种稀有度获得次数 |
| `last10Rolls[]` / `last10RegenRolls[]` | 最近10次记录 |
| `bestRoll` / `bestRegenRoll` | 最佳掷出 |
| `unlocked` | 功能解锁状态 |
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

**掷出概率**（源自 Rarity Toy v0.1 原版手调分数）:
```
raw = Math.random()
x = raw / luck  (原版 ÷ regenLuck 也在分母)
从最稀有向最普通遍历 RARITIES[]:
  如果 x ≤ rarity.chance → 选中该稀有度
```
等价于: `random ≤ chance[i] × luck`，luck 直接放大阈值。

**28 级稀有度分数及初始分布 (luck=1)**:

| id | 稀有度 | chance | P(=i) | 每级衰减 |
|----|--------|--------|-------|---------|
| 1 | common | 1/1 | **80%** | — |
| 2 | uncommon | 1/5 | 15% | ×5 |
| 3 | very uncommon | 1/20 | 3.8% | ×4 |
| 4 | rare | 1/75 | 1% | ×3.75 |
| 5 | very rare | 1/200 | 0.3% | ×2.67 |
| 6 | super rare | 1/650 | 0.1% | ×3.25 |
| 7 | epic | 1/2000 | 0.05% | ×3.08 |
| 8 | very epic | 1/8500 | 0.01% | ×4.25 |
| 9 | super epic | 1/30000 | 0.003% | ×3.53 |
| 10 | ultra epic | 1/450000 | 0.0002% | **×15 跳跃** |
| 11 | legendary | 1/1e6 | 1e-4% | ×2.22 |
| ... | ... | ... | ... | ... |
| 28 | and i'll never forgive you. | 1/1.3e51 | ~0% | ~1e6×/级(尾段) |

Luck 升级效果（luck ×= 2.5 每次提升一级的突破）:
- luck=1: 80% common
- luck=5 (≈2 级): common=0%, 15% uncommon+
- luck=400 (≈7 级): epic 从 0.05% → ~20%
- luck=450000 (≈15 级): 突破 ultra epic ×15 墙

**重生稀有度** 7 级（Rarity Toy 原版）:
| id | 稀有度 | chance |
|----|--------|--------|
| 1 | expected | 1/1 |
| 2 | abnormal | 1/10 |
| 3 | anomalous | 1/65 |
| 4 | divergent | 1/875 |
| 5 | distorted | 1/5150 |
| 6 | aberrant | 1/264785 |
| 7 | paradoxical | 1/777777777 |

重生掷出: `x = random / regenRLuck / 1.3^(bestRoll.id - 7)`，递减回报。

**微光获取**:
```
shimmerGain = rarityId × shimmerMulti
```

**重生 (原重生替代)**:
```
条件: bestRoll.id ≥ 8 (超级史诗+)
触发: 重生掷出 → 结算 AP → 继承 regenLuck/regenShimmerMulti
      → 重置周期（rollInterval=3s, luck=regenLuck, shimmerMulti=regenShimmerMulti）

重生掷出: x = Math.random() / regenRLuck / 1.3^(bestRoll.id - 7)
          遍历 REGENRARITIES[] 取中
APGain = regenRarityId × regenGlistenMulti
```

---

## 三、功能模块分析

### 3.1 已实现功能 ✅

| 模块 | 文件 | 状态 |
|------|------|------|
| 28 种稀有度（普通~我永远不会原谅你） | `constants/index.ts` | ✅ 2026-06-12 补齐 13~28 |
| 掷出机制 + 自动掷出 | `gameLogic.ts` + `Game.tsx` | ✅ |
| 3 种周期升级（幸运/间隔/微光） | `gameLogic.ts` | ✅ |
| 4 种重生升级（幸运/微光/重置运/AP倍率） | `gameLogic.ts` | ✅ 2026-06-15 |
| 重生系统（双货币: 微光+AP，递减回报 1.3^(id-7)） | `gameLogic.ts` | ✅ 2026-06-15 重写 |
| 7 级重生稀有度（期望~悖论） | `constants/index.ts` | ✅ 2026-06-15 |
| 成就系统（动态生成，随 RARITIES 扩展） | `achievementSystem.ts` | ✅ |
| 存档系统 (localStorage) | `saveSystem.ts` | ✅ |
| 存档迁移（totalRarities 自动补零） | `saveSystem.ts` | ✅ 2026-06-12 |
| AES 加密导入/导出 | `saveSystem.ts` | ✅ |
| 中英文双语切换（独立 locale 文件） | `locales/{zh,en,index}.ts` | ✅ 2026-06-12 从内联提取 |
| 离线进度计算 | `saveSystem.ts` | ✅ |
| 最近10次/最佳掷出记录 | `MainTab.tsx` | ✅ |
| 28 个 SVG 徽章图案 | `assets/badges/badge_1.svg ~ badge_28.svg` | ✅ 2026-06-12 补齐 13~28 |
| 版本信息显示 + `/version` 端点 | `version.ts` + `public/version` | ✅ 2026-06-12 |
| formatNumber 支持 K/M/B/T | `gameLogic.ts` | ✅ |
| 响应式 CSS | `styles/*.css` | ✅ |
| 未使用依赖清理 | `package.json` | ✅ 2026-06-12 精简 40+ 包 |
| 死代码清理 | 多文件 | ✅ 2026-06-12 删除 use-toast、utils、App.css、use-mobile 等 |

### 3.2 未实现 / 不完整功能 🔶

| 功能 | 设计文档要求 | 现状 |
|------|------------|------|
| 排行榜系统 | 后端 + API + 前100名显示 | 完全未实现，代码中仅有 `leaderboardParticipation` 字段 |
| 图表可视化 | 稀有度分布饼图、掷出历史折线图 | 未实现 |
| 音效系统 | 音效开关、音量调节 | 设置在 UI 中存在，无实际音效 |
| 统计分析 | 游戏总时长、资源获取趋势图 | 基础统计有，图表未实现 |
| 自动保存过时 | `setupAutoSave` 闭包捕获旧状态 | 已识别的 bug，尚未修复 |

### 3.3 代码质量现状 ✅

| 问题 | 位置 | 状态 |
|------|------|------|
| 未使用的 `use-toast.ts`（200 行） | `src/hooks/use-toast.ts` | ✅ 已删除 2026-06-12 |
| 未使用的 `cn()` | `src/lib/utils.ts` | ✅ 已删除 2026-06-12 |
| 未使用的依赖（40+ 包） | `package.json` | ✅ 已卸载 2026-06-12 |
| 未使用的 CSS 变量 | `index.css` | ✅ 已清理 2026-06-12 |
| 空 `App.css` | `src/App.css` | ✅ 已删除 2026-06-12 |
| 多语言内联硬编码 | `Game.tsx` | ✅ 已提取至独立 locale 文件 |
| `IndexTab` 内联在 `Game.tsx` | `Game.tsx` | ✅ 已拆分为独立组件 |
| `Game.tsx` 体积过大（458 行） | `Game.tsx` | ✅ 已降至 251 行 |
| 重复升级逻辑（7 处内联） | `Game.tsx` | ✅ 已统一为 gameLogic 纯函数 |
| `formatNumber` 上限 T 级后 | `gameLogic.ts` | ✅ 已支持 T 级别 |

---

## 四、依赖分析

### 4.1 实际使用的依赖

```
react, react-dom           → UI 框架
crypto-js                  → 存档加密
typescript                 → 类型
vite                       → 构建
tailwindcss, autoprefixer, postcss → 样式
eslint                     → 代码检查
```

### 4.2 已安装但未使用的依赖（可安全移除，节省 ~5MB）

```
clsx                       → 样式工具（实际未使用）
tailwind-merge             → 样式工具（实际未使用）
class-variance-authority   → 组件变体（已卸载）
tailwindcss-animate        → 动画（已卸载）
vite-plugin-svgr           → SVG 作为组件（已卸载）
```

---

## 五、设计文档与实际实现的差距

`rarity_badge_final_design_document.md` 是设计蓝图，以下是当前代码的差距（部分为有意偏离原设计）：

| 设计文档 | 代码实现 |
|---------|---------|
| 28 种稀有度（概率 2^(n-1)） | ✅ 已实现，但概率改为原版 Rarity Toy 手调分数 |
| 微光公式 2^(n-1) × 倍率 | ✅ 已实现，改为线性 id × shimmerMulti |
| 成就点作为货币（用于全局升级） | ❌ 成就改为纯展示，AP 通过重生掷出获得 |
| 全局升级（加法 +0.1/+0.05/+0.2） | ❌ 已删除，替换为 4 项重生升级（乘法 ×2/×1.5/×2.5/×1.5） |
| 重生奖励固定 AP 公式 | ❌ 改为概率性重生掷出 + 递减回报 |
| 完整 i18n locale 目录结构 | ✅ `src/locales/{zh,en,index}.ts` |
| 排行榜系统 | ❌ 未实现 |
| 图表可视化 | ❌ 未实现 |
| 音效系统 | ❌ 未实现 |

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
9. ~~清理 `use-toast.ts` 死代码~~ ✅ 已完成
10. ~~清理其他死代码（App.css、use-mobile、CSS 变量）~~ ✅ 已完成
11. ~~将 `IndexTab` 拆分为独立组件~~ ✅ 已完成

### 低优先级
10. **GitHub Actions 修复** — 排查 runner 无法分配的问题
