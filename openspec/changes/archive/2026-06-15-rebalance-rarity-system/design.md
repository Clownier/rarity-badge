## Context

当前 rarity-badge 使用指数闪亮公式和等比概率曲线（1/2^i），28 级稀有度仅跨 8 个 OOM。对比原始 Rarity Toy 的 51 OOM 跨度和线性闪亮产出，我们的数值过早饱和。

## Goals / Non-Goals

**Goals:**
- 概率曲线改用三角数指数公式，跨 47 OOM，确保月/年级别挂机深度
- 闪亮产出改线性，消除指数通胀
- 重生系统改为双货币转生，增加策略选择和长期成长感
- 保留现有 UI 结构（Tab 式布局），不改整体风格

**Non-Goals:**
- 不新增稀有度（保持 28 级）
- 不改 SVG 徽章
- 不改存档加密机制
- 不改自动掷出/离线进度现有逻辑

## Decisions

### 1. 概率公式：三角数指数
- `chance[i] = 10^(-i*(i-1)/16)`，i 从 1 开始
- 选择 `÷16` 而非 `÷14.8`：16 是 2^4，数学上干净，且产出平滑曲线
- 稀有度 1 恒为 1（因为 i=1 时指数为 0）

### 2. 闪亮公式：线性
- `shimmerGain = selectedRarity.id × shimmerMulti × regenShimmerMulti`
- 代替当前的 `Math.pow(2, id) × shimmerMulti × globalShimmerMulti`
- 升级价格体系不变，因线性产出自然让升级节奏变慢

### 3. 转生系统：对齐原版
- 触发条件：bestRoll.id ≥ 8（Super Epic）
- 转生掷出公式：`Math.random() / regenRLuck / (1.3^(转生前的 bestRoll.id - 7))`
- 转生稀有度表 7 级，概率递进
- glisten 公式：`(转生稀有度索引 + 1) × regenGlistenMulti`
- 转生升级 4 项，价格倍率 ×4 或 ×5
- 删除现有全局升级（globalLuck/globalShimmerMulti/globalIntervalReduction）
- 删除成就点系统，权能改为纯展示

### 4. 实施分两阶段
- Phase 1：概率 + 闪亮公式（独立可发）
- Phase 2：转生系统

## Risks / Trade-offs

- [存档兼容] 现有存档字段大改 → saveSystem 需加 migration 逻辑，检测旧格式并填充新字段
- [UI 复杂度] OptionsTab 和 IndexTab 增加转生子页面 → 保持与现有 Tab 切换模式一致
- [玩法变化] 现有玩家重生习惯被打破 → 转生升级有"即时生效"效果，手感变化不大
