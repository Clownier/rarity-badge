## Why

当前仅实现 12 种稀有度，设计文档规划了 28 种。缺少后 16 种导致游戏终局内容空洞，玩家达到"非常传说"后没有更高目标可追求，重生收益也因稀有度上限而偏低。

## What Changes

- 在 `RARITIES` 常量中添加 id 13~28 的定义（名称、概率、颜色、描述）
- 为 id 13~28 创建 16 个 SVG 徽章图案
- 更新 `Badge` 组件上限从 12 扩展至 28
- 扩展 `ACHIEVEMENTS` 数组，为新增稀有度生成发现和数量成就
- 更新 `totalRarities` 数组长度为 28
- 新增 `formatNumber` 的 T（万亿）级别支持
- 更新 `calculateRebirthPoints` 公式以适配 28 级稀有度

## Capabilities

### New Capabilities
- `rarities-13-28`: 新增 16 种稀有度的完整数据定义和视觉资源

### Modified Capabilities
- `project`: `RARITIES` 数组从 12 项扩展至 28 项，影响所有依赖该常量的模块（掷出概率、成就、重生、索引页等）

## Impact

- `src/constants/index.ts` — RARITIES 数组增加 16 项，ACHIEVEMENTS 自动扩展（基于 RARITIES 动态生成）
- `src/assets/badges/` — 新增 16 个 SVG 文件（badge_13.svg ~ badge_28.svg）
- `src/components/Badge.tsx` — 导入新增 SVG，扩展 badgeImages 映射，移除 `Math.min(Math.max(1, rarityId), 12)` 的 12 上限
- `src/types/index.ts` — 可能需确认 `totalRarities` 类型是否固定长度
- `src/lib/gameLogic.ts` — `formatNumber` 增加 T 级支持；`calculateRebirthPoints` 检查上限变更是否合理
