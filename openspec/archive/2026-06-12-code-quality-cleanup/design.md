## Context

`Game.tsx` 从初始 458 行已减至 274 行（MainTab、StatsTab 已拆分），但 `renderIndexTab` 仍内联。`use-toast.ts` 是早期 shadcn/ui 遗留产物，全项目无引用。`utils.ts` 中 `cn()` 是 tailwind-merge + clsx 包装函数，但未被任何组件使用。

## Goals / Non-Goals

**Goals:**
- 消除死代码，减小包体积
- 所有 Tab 组件统一为独立文件（IndexTab 最后一块）
- 清理未使用依赖

**Non-Goals:**
- 不改动任何功能逻辑
- 不改动任何 CSS

## Decisions

1. **IndexTab 拆分**：将 `Game.tsx` 的 `renderIndexTab` 函数原样移入新文件，props 传递 `language`、`player`。与 MainTab/StatsTab 模式一致。
2. **依赖移除**：`class-variance-authority` 和 `tailwindcss-animate` 直接 `npm uninstall`，`vite-plugin-svgr` 同时从 `vite.config.ts` 的 plugins 中移除。
3. **utils.ts 处理**：删除 `cn()` 函数和 `clsx`/`tailwind-merge` 导入，保留文件为空可删除。

## Risks / Trade-offs

- `vite-plugin-svgr` 移除后，未来若要使用 SVG 作为 React 组件需重新安装，但当前代码无此需求，按 YAGNI 原则移除。
