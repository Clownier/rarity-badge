## Why

StatsTab 当前仅有纯文本数字，缺乏直观的视觉反馈。玩家无法一眼看出稀有度分布、掷出历史趋势。图表可视化能显著提升"收集反馈"和"进度感知"的游戏体验。

## What Changes

- 安装 recharts 图表库
- StatsTab 新增稀有度分布饼图（基于 `totalRarities` 累计数据）
- 新增重生稀有度分布柱状图（基于 `totalRegenRarities`）
- 新增最近10次掷出序列色带（直观显示近期结果趋势）
- 新增对应的中英文本地化 key
- StatsTab 布局调整，图表区域包裹滚动容器

## Capabilities

### New Capabilities
- `rarity-charts`: 稀有度分布可视化（普通掷出饼图 + 重生掷出柱状图）
- `roll-history`: 最近掷出序列色带可视化

### Modified Capabilities
<!-- No existing specs need requirement changes -->

## Impact

- 新增依赖：recharts
- 修改文件：`src/components/StatsTab.tsx`、`src/styles/StatsTab.css`、`src/locales/{zh,en}.ts`
- 只读数据：`player.totalRarities`、`player.totalRegenRarities`、`player.last10Rolls`、`player.last10RegenRolls`
