## 1. 死代码清理

- [x] 1.1 删除 `src/hooks/use-toast.ts`
- [x] 1.2 删除 `src/lib/utils.ts`（仅包含未使用的 `cn()`）

## 2. 拆分 IndexTab

- [x] 2.1 创建 `src/components/IndexTab.tsx`（将 Game.tsx 的 renderIndexTab 移入）
- [x] 2.2 更新 `Game.tsx`：删除 renderIndexTab，改用 `<IndexTab />`

## 3. 清理未使用依赖

- [x] 3.1 卸载 `class-variance-authority`、`tailwindcss-animate`、`vite-plugin-svgr`、`clsx`、`tailwind-merge`
- [x] 3.2 从 `vite.config.ts` 移除 `vite-plugin-svgr` 引用

## 4. 代码审查

- [x] 4.1 审查所有变更的代码正确性 — 通过
- [x] 4.2 执行 `npm run build` 验证编译通过 — 通过
