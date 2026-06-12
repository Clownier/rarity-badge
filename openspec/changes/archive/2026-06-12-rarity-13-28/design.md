## Context

当前 `RARITIES` 数组仅定义 12 项（id 1~12），设计文档规划 28 种。`Badge` 组件有硬编码上限 `Math.min(Math.max(1, rarityId), 12)`。`ACHIEVEMENTS` 基于 `RARITIES` 动态生成，但遍历的数组本身只有 12 项。`totalRarities` 数组初始化长度为 `RARITIES.length`，添加新稀有度后自动扩展。

## Goals / Non-Goals

**Goals:**
- 新增 id 13~28 的稀有度数据定义（名称、概率、颜色、描述）
- 为每个新稀有度创建对应 SVG 徽章图案
- 更新所有依赖 RARITIES 的模块以支持 28 种稀有度
- 自动扩展成就系统以覆盖新增稀有度

**Non-Goals:**
- 不改动现有 12 种稀有度的定义和行为
- 不修改游戏核心逻辑（掷出、升级、重生公式）
- 不涉及排行榜、图表、音效等其他未实现功能

## Decisions

1. **SVG 设计方式**：参考现有 badge_1~12 的 SVG 风格（同目录下），新 SVG 按设计文档描述自行绘制。每个 SVG 使用 100x100 viewBox，颜色主题和形状按设计文档对应。

2. **Badge 组件改造**：移除 `Math.min(Math.max(1, rarityId), 12)` 的 12 硬编码，改用 `Math.min(Math.max(1, rarityId), RARITIES.length)` 动态上限，或直接移除上限检查（RARITIES 数组本身就是天然边界）。

3. **成就自动扩展**：`ACHIEVEMENTS` 已通过 `RARITIES.filter(r => r.id > 6)` 和 `RARITIES.flatMap` 动态生成，无需修改代码逻辑，`RARITIES` 扩展后成就自动扩展。

4. **formatNumber 扩展**：在 B 级后添加 T（万亿 = 1e12）支持。更高级别（Qa 等）暂不添加，待实际需要时按相同模式扩展。

5. **重生点计算**：`calculateRebirthPoints` 公式为 `Math.max(1, Math.floor((bestRollId - 6) / 2))`，对于 id=28 的稀有度可产生 11 点重生收益，无需修改。

## Risks / Trade-offs

- [R1] SVG 图案亲手绘制可能质量不一致 → 保持与现有 12 个 SVG 相同的简洁几何风格，避免过于复杂的图形
- [R2] 新增稀有度概率极低（id=28 为 1/134217728），玩家几乎不可能见到 → 这是设计文档的意图，与现有概率递进规律一致
- [R3] badgeImages 对象新增 16 个 import 语句，代码重复 → 可考虑用 `import.meta.glob` 批量导入简化，但本次先保持与现有模式一致以减少风险
