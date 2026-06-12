## Why

分析报告指出多项代码质量问题：未使用的死代码、未使用的依赖、组件尚未完全拆分。清理后减小包体积、提高可维护性。

## What Changes

- 删除 `src/hooks/use-toast.ts`（200 行未使用的 toast 死代码）
- 删除 `src/lib/utils.ts` 中对 `cn()` 的导出（未使用）
- 卸载 `class-variance-authority` + `tailwindcss-animate` 两个未使用依赖
- 将 `renderIndexTab` 从 `Game.tsx` 拆分为独立 `IndexTab.tsx` 组件
- 卸载 `vite-plugin-svgr`（未使用，SVG 通过 `?url` 导入）

## Capabilities

### Modified Capabilities
- `project`: 清理死代码、未使用依赖；IndexTab 组件化

## Impact

- `src/hooks/use-toast.ts` — 删除
- `src/lib/utils.ts` — 删除 `cn` 导出
- `src/components/Game.tsx` — 移除 renderIndexTab，改为 `<IndexTab />`
- `src/components/IndexTab.tsx` — 新文件
- `package.json` — 移除 3 个未使用依赖
- `vite.config.ts` — 移除 vite-plugin-svgr 引用
