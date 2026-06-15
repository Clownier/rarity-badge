## 1. Setup

- [x] 1.1 Install recharts as project dependency
      Verify: `npm ls recharts` shows the package

- [x] 1.2 Add locale keys for chart section headers, labels, and "unlocked after rebirth" message
      Verify: `src/locales/zh.ts` and `src/locales/en.ts` both contain the new keys

## 2. Color Strip Component

- [x] 2.1 Create `RollStrip` component: horizontal flex container, each roll = colored square, renders from array of `RollResult`, oldest-left newest-right
      Verify: component renders N colored squares matching input array length

- [x] 2.2 Add hover tooltip to each square showing rarity name + chance + position
      Verify: hovering a square shows correct name in current language

- [x] 2.3 Add "most recent" indicator (small arrow/triangle on the rightmost square)
      Verify: visual indicator appears on the last element

## 3. Rarity Distribution Pie Chart

- [x] 3.1 Create `RarityPieChart` component: reads `totalRarities` array, aggregates top-5 + other, renders recharts `PieChart` with `Pie` + `Tooltip` + `Legend`
      Verify: pie chart renders with colored segments matching rarity colors

- [x] 3.2 Implement aggregation logic: sort by count desc, take top 5, sum rest as "Other" segment with gray color
      Verify: when 7 rarities have non-zero count, chart shows 5 named + 1 "Other"

- [x] 3.3 Ensure labels use current language; "Other" label uses locale key
      Verify: switching language updates pie segment labels

## 4. Rebirth Rarity Bar Chart

- [x] 4.1 Create `RegenBarChart` component: reads `totalRegenRarities`, renders recharts `BarChart` with 7 bars in rebirth rarity order (id 1-7)
      Verify: chart renders 7 bars with correct REGENRARITIES colors

- [x] 4.2 Hide component when player has 0 total rebirths (show "重生后解锁" text instead)
      Verify: before first rebirth, shows message; after rebirth, shows chart

- [x] 4.3 Add tooltip on hover showing rarity name + count
      Verify: hovering a bar shows correct data

## 5. Wire into StatsTab

- [x] 5.1 Restructure StatsTab layout: wrap each chart section in scroll container; add section headers using locale keys
      Verify: `npm run build` succeeds

- [x] 5.2 Render `RarityPieChart` under "稀有度分布" section, passing player.totalRarities and language
      Verify: pie chart appears in StatsTab and responds to data

- [x] 5.3 Render `RegenBarChart` under "重生稀有度分布" section, conditionally based on totalRebirths > 0
      Verify: bar chart appears only after rebirth

- [x] 5.4 Render `RollStrip` (normal) under "最近掷出" section using player.last10Rolls
      Verify: color strip shows in StatsTab

- [x] 5.5 Render `RollStrip` (rebirth) under "最近重生掷出" section using player.last10RegenRolls, conditional on totalRebirths > 0
      Verify: rebirth strip shows only after rebirth

- [x] 5.6 Update `src/styles/StatsTab.css` with chart container styles (scroll wrapper, section spacing, responsive breakpoints)
      Verify: charts look correct on mobile width (375px)
