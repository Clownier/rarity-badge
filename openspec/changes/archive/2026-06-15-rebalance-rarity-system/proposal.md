## Why

当前游戏数值体系存在三个问题：(1) 28 级稀有度压缩在 8 个数量级内，通关时间仅 15-60 分钟；(2) 闪亮产出指数增长导致经济过早饱和；(3) 重生系统缺乏深度，无策略选择。需要对齐原始 Rarity Toy 的数值设计，使游戏节奏从"分钟级通关"变为"月/年级别挂机"。

## What Changes

- **BREAKING**: 稀有度概率改为三角数指数公式 `chance[i] = 10^(-i*(i-1)/16)`，跨度从 8 OOM 扩展至 47 OOM
- **BREAKING**: 闪亮产出公式从 `2^id × multi` 改为 `id × multi`（线性），消除指数通胀
- **BREAKING**: 重生系统改为双货币转生系统——删除全局升级（globalLuck/globalIntervalReduction/globalShimmerMulti）和成就点；新增 glisten 货币、转生升级树（4 项）、转生稀有度表（7 级）、递减回报机制
- 版本升至 1.2.0

## Capabilities

### New Capabilities
- `regen-system`: 双货币转生系统，包含 glisten 经济、转生掷出、转生升级树

### Modified Capabilities
- (无需修改现有 spec，因为概率和闪亮公式属于实现细节，非 capabilty 级行为变更)

## Impact

- `src/types/index.ts` — PlayerState 类型大改：增删字段
- `src/constants/index.ts` — RARITIES 概率重算，新增 REGENRARITIES 和转生升级价格
- `src/lib/gameLogic.ts` — 重写 roll() shimmer 公式，重写 rebirth() 为 regenerate()，删全局升级函数
- `src/lib/gameIntegration.ts` — 适配新函数签名
- `src/lib/saveSystem.ts` — 存档迁移（如果已有存档）
- 所有 Tab 组件 — OptionsTab 新增转生升级面板，IndexTab 新增转生稀有度索引
- `src/locales/` — 新增转生相关文案
