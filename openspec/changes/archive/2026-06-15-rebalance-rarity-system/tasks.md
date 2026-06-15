## Phase 1: 概率曲线 + 闪亮公式

- [x] 1.1 重算 RARITIES[] 概率为 `10^(-i*(i-1)/16)`，保留名称/SVG/颜色不变
- [x] 1.2 改闪亮公式 `2^id → id`（线性）
- [x] 1.3 运行 `npm run build` 验证编译通过

## Phase 2: 双货币转生系统 — 核心逻辑

- [x] 2.1 修改 PlayerState 类型：删 global* 和 achievementPoints 字段，增 glisten/regen* 等字段
- [x] 2.2 新增 REGENRARITIES 常量表和转生升级初始价格
- [x] 2.3 新增 gameLogic 函数：rollRegen()、upgradeRegenLuck/Shimmer/RLuck/Glisten()
- [x] 2.4 重写 rebirth() 为 regenerate()：转生掷出 → glisten 结算 → 周期重置
- [x] 2.5 删除全局升级函数和相关积分计算
- [x] 2.6 更新 saveSystem 存档迁移，兼容旧格式
- [x] 2.7 更新 gameIntegration 适配新函数签名
- [x] 2.8 运行 `npm run build` 验证编译通过

## Phase 2: 双货币转生系统 — 核心逻辑

- [x] 2.1 修改 PlayerState 类型：删 global* 和 achievementPoints 字段，增 glisten/regen* 等字段
- [x] 2.2 新增 REGENRARITIES 常量表和转生升级初始价格
- [x] 2.3 新增 gameLogic 函数：rollRegen()、upgradeRegenLuck/Shimmer/RLuck/Glisten()
- [x] 2.4 重写 rebirth() 为 regenerate()：转生掷出 → glisten 结算 → 周期重置
- [x] 2.5 删除全局升级函数和相关积分计算
- [x] 2.6 更新 saveSystem 存档迁移，兼容旧格式
- [x] 2.7 更新 gameIntegration 适配新函数签名
- [x] 2.8 运行 `npm run build` 验证编译通过

## Phase 2: 双货币转生系统 — UI

- [x] 2.9 更新 OptionsTab：转生升级面板（4 个按钮），条件渲染（bestRoll ≥ 8 才显示）
- [x] 2.10 更新 MainTab：转生按钮 + 转生掷出历史
- [x] 2.11 更新 IndexTab：转生稀有度索引子页面
- [x] 2.12 更新 locales/{zh,en}.ts：新增转生文案
- [x] 2.13 更新 styles/*.css：转生 UI 样式（紫色主题）
- [x] 2.14 运行 `npm run build` 验证编译通过

## 收尾

- [x] 3.1 更新 `docs/analysis-report.md` 记录数值变更
- [x] 3.2 版本升至 1.2.0，构建部署
