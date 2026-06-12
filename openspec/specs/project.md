# Rarity Badge

Incremental game — 掷出徽章，收集稀有度，升级，重生。

## Tech Stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS
- ESLint (flat config)
- GitHub Pages (gh-pages branch)

## Current Architecture

```
src/
├── assets/badges/    # SVG 徽章图案 (badge_1.svg ~ badge_12.svg)
├── components/       # React 组件
│   ├── Game.tsx          # 主状态容器 + tab 路由
│   ├── MainTab.tsx       # 掷出、升级、重生
│   ├── StatsTab.tsx      # 统计面板
│   ├── AchievementTab.tsx# 成就面板
│   ├── OptionsTab.tsx    # 设置、存档管理
│   └── Badge.tsx         # SVG 徽章渲染
├── lib/
│   ├── gameLogic.ts      # 纯函数：掷出、升级、重生、格式化
│   ├── gameIntegration.ts# 带成就的 gameLogic 包装
│   ├── saveSystem.ts     # 本地存储 + 加密 + 离线进度
│   └── format.ts         # 工具函数：formatGameTime, getRarityName
├── locales/
│   ├── index.ts          # i18n 入口
│   ├── zh.ts
│   └── en.ts
├── styles/               # CSS 模块
├── hooks/                # (仅 use-toast.ts 未使用)
├── constants/index.ts    # 稀有度、升级参数、成就定义
├── types/index.ts        # TypeScript 类型
└── version.ts            # 版本号
```

## State Management

`Game.tsx` 持有唯一 `PlayerState`，通过 `useState` + `useCallback` handler 下发到各 tab 组件。无全局状态库。

## Missing Features (Backlog)

### 核心玩法
~~1. **稀有度 13~28** — 常量、SVG、成就、Badge 组件上限均缺失~~ ✅ 已实现
2. **自动保存过时** — `setupAutoSave` 闭包捕获的是旧状态快照
3. **离线进度不完整** — 不会发现新稀有度、不解锁成就

### 功能缺失
4. **排行榜** — 完全未实现
5. **图表** — 完全未实现（StatsTab 仅有纯文本）
6. **音效** — 设置存在但无 UI 控件和音频代码

### 代码清理
7. `use-toast.ts` — 200 行未使用死代码
8. `utils.ts` 中 `cn()` — 未使用
9. `class-variance-authority` + `tailwindcss-animate` — 未使用依赖
10. `vite-plugin-svgr` — 已安装但当前代码未利用
11. `formatNumber` 仅支持到 B 级
