## ADDED Requirements

### Requirement: 玩家可以进行转生

当玩家当前周期最佳掷出 ≥ 第 8 级（Super Epic）时，系统解锁转生功能。

#### Scenario: 解锁转生
- **WHEN** 玩家掷出的稀有度 id ≥ 8
- **THEN** bestRoll.id 更新，转生 Tab 显示，glisten 面板显示

#### Scenario: 转生条件不满足
- **WHEN** 玩家最佳掷出 < 第 8 级
- **THEN** 转生按钮显示"需要 Super Epic"，不可点击

### Requirement: 转生流程

玩家点击转生时系统执行：转生掷出 → 结算 glisten → 重置周期。

#### Scenario: 执行转生
- **WHEN** 玩家点击转生按钮
- **THEN** 执行转生掷出，glisten 增加（= (转生稀有度索引+1) × regenGlistenMulti），重置 shimmer=0/rollInterval=3/rollTimer=0/upgrades/最佳掷出，保留 luck=regenLuck/shimmerMulti=regenShimmerMulti

### Requirement: 转生掷出使用独立稀有度表

系统使用 REGENRARITIES 7 级稀有度表进行转生掷出。

#### Scenario: 转生掷出逻辑
- **WHEN** 执行转生掷出
- **THEN** 生成随机数 `x = Math.random() / regenRLuck / (1.3 ^ (转生前 bestRoll.id - 7))`，遍历 REGENRARITIES 确定结果

#### Scenario: 递减回报
- **WHEN** 转生时 bestRoll.id 更高
- **THEN** 分母 `1.3^(id-7)` 增大，更难出高等级转生稀有度

### Requirement: 转生升级树

系统提供 4 项转生升级，消耗 glisten。

#### Scenario: regenerableLuck 升级
- **WHEN** 玩家拥有 ≥ 2 glisten 且点击 upgradeRegenLuck
- **THEN** 扣除 2 glisten，regenLuck ×= 2，lucK ×= 2，下次价格 ×= 4

#### Scenario: regenerableShimmer 升级
- **WHEN** 玩家拥有 ≥ 2 glisten 且点击 upgradeRegenShimmer
- **THEN** 扣除 2 glisten，regenShimmerMulti ×= 1.5，shimmerMulti ×= 1.5，下次价格 ×= 5

#### Scenario: regenLuck 升级
- **WHEN** 玩家拥有 ≥ 5 glisten 且点击 upgradeRegenRLuck
- **THEN** 扣除 5 glisten，regenRLuck ×= 2.5，下次价格 ×= 4

#### Scenario: glistenMulti 升级
- **WHEN** 玩家拥有 ≥ 8 glisten 且点击 upgradeRegenGlisten
- **THEN** 扣除 8 glisten，regenGlistenMulti ×= 1.5，下次价格 ×= 4

### Requirement: 存档迁移

旧存档字段（globalLuck/globalShimmerMulti/globalIntervalReduction/achievementPoints 等）需要自动迁移到新格式。

#### Scenario: 加载旧存档
- **WHEN** 加载无新字段的存档
- **THEN** 系统自动填充默认值：glisten=0/regenLuck=1/regenShimmerMulti=1/regenRLuck=1/regenGlistenMulti=1，并回复存档
