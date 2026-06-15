## ADDED Requirements

### Requirement: StatsTab displays normal rarity distribution pie chart

The system SHALL render a pie chart in the StatsTab showing the distribution of normal (non-rebirth) rarities the player has rolled. The chart SHALL use `player.totalRarities` as its data source.

To keep the chart readable with 28 rarity levels (many with 0 count), the pie chart SHALL display the top N rarities by count and aggregate the rest into a single "Other" segment. N SHALL be 5 when there are more than 5 rarities with non-zero count; if 5 or fewer rarities have non-zero count, all SHALL be displayed individually.

Each segment SHALL display:
- The rarity's color as the fill
- A label with the rarity name and count
- A tooltip on hover showing full name, count, and percentage

#### Scenario: Pie chart shows when data exists
- **WHEN** player has rolled at least once
- **THEN** the pie chart SHALL render in the StatsTab with segments based on `totalRarities`

#### Scenario: Pie chart shows correct segments
- **WHEN** player has rolled Common 200 times, Uncommon 30 times, Rare 3 times (and nothing else)
- **THEN** the pie chart SHALL display exactly 3 segments (Common, Uncommon, Rare)

#### Scenario: Pie chart aggregates beyond top 5
- **WHEN** 7 distinct rarities have non-zero counts
- **THEN** the pie chart SHALL show top 5 by count as individual segments and the remaining 2 aggregated as "Other"

#### Scenario: Pie chart uses rarity colors
- **WHEN** the pie chart renders
- **THEN** each segment SHALL use the corresponding rarity's color from RARITIES

#### Scenario: Pie chart shows labels in current language
- **WHEN** language is set to Chinese
- **THEN** segment labels SHALL show Chinese rarity names
- **WHEN** language is set to English
- **THEN** segment labels SHALL show English rarity names

### Requirement: StatsTab displays rebirth rarity distribution bar chart

The system SHALL render a bar chart in the StatsTab showing the distribution of rebirth rarities. The chart SHALL use `player.totalRegenRarities` as its data source (7 entries).

All 7 rebirth rarity levels SHALL be displayed as individual bars. Each bar SHALL show:
- The rebirth rarity's color as the fill
- The rarity name on the X-axis
- The count on the Y-axis
- A tooltip on hover showing full name and count

#### Scenario: Bar chart shows when rebirth data exists
- **WHEN** player has performed at least one rebirth
- **THEN** the bar chart SHALL render with bars for each rebirth rarity with non-zero count

#### Scenario: Bar chart shows zero-count rarities
- **WHEN** a rebirth rarity has count 0
- **THEN** the bar chart SHALL still render a bar of height 0 (no visible bar but axis label present)

#### Scenario: Bar chart uses rebirth rarity colors
- **WHEN** the bar chart renders
- **THEN** each bar SHALL use the corresponding rebirth rarity's color from REGENRARITIES

#### Scenario: Bar chart is hidden when no rebirths
- **WHEN** player has never performed a rebirth
- **THEN** the bar chart SHALL NOT render (or show a message "重生后解锁")
