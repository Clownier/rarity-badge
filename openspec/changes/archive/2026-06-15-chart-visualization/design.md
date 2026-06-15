## Context

StatsTab 当前仅用 `<div>` 展示数字统计。`player.totalRarities`（28 个累计计数）和 `player.totalRegenRarities`（7 个累计计数）已存储完整分布数据，可直接用于图表。`player.last10Rolls` / `player.last10RegenRolls` 包含最近 10 次掷出结果。

项目使用 React 18 + TypeScript + Vite 6，无现有图表库，无全局状态管理（单 `useState` 在 Game.tsx）。

## Goals / Non-Goals

**Goals:**
- 稀有度分布饼图：基于 `totalRarities` 显示各稀有度占比
- 重生稀有度分布柱状图：基于 `totalRegenRarities` 显示 7 级重生稀有度计数
- 最近掷出色带：用颜色块序列直观显示最近 10 次普通掷出和重生掷出
- 所有图表在 StatsTab 内渲染，跟随语言切换
- 图表区域可滚动（防止溢出小屏）

**Non-Goals:**
- 不添加时间序列历史记录（无趋势折线图）
- 不修改 PlayerState 类型或存档结构（仅读取现有字段）
- 不添加后端服务或数据上传
- 不创建独立的图表标签页

## Decisions

1. **图表库：recharts 而非 Chart.js 或手写 SVG**
   - 理由：recharts 是 React 原生声明式 API，与当前 React 18 生态一致，无 DOM 操作；Tree-shakable，仅引入 PieChart/BarChart 组件体积可控
   - 替代方案 Chart.js 需要 react-chartjs-2 桥接层 + 命令式 API，与 React 范式不匹配
   - 手写 SVG 灵活但开发成本高，不适合迭代

2. **饼图聚合策略：Top-N + "其他"**
   - `totalRarities` 包含 28 级，但尾部稀有度计数极低（甚至为 0）。为了可读性，饼图取计数前 5 的稀有度，其余合并为"其他"
   - 重生柱状图仅 7 项，无需聚合，全部显示

3. **色带组件：纯 CSS + `<div>` 而非图表库**
   - 最近 10 次掷出本质是颜色序列，用 flexbox 色块渲染即可，无需引入额外图表组件
   - 每个色块显示稀有度颜色，悬停 tooltip 显示名称

4. **CSS 模块而非 Tailwind**
   - 现有 StatsTab.css 使用 CSS 模块模式（`StatsTab stats-section` 等类），图表区域沿用同一样式风格

## Risks / Trade-offs

- **[性能] 图表每次渲染遍历 28 项做聚合** → 数据量极小（一次遍历 O(28)），无性能风险
- **[体积] recharts 增加 bundle 大小** → 仅引入所需组件，recharts ≈ 30KB gzipped，可接受
- **[数据] 饼图在早期游戏只有 1-2 种稀有度** → Top-N 聚合自动处理，无需特殊逻辑
- **[布局] 图表在小屏手机可能溢出** → 外层 `overflow-x: auto` 处理
