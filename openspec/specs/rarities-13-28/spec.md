## ADDED Requirements

### Requirement: System defines rarities 13-28

The system SHALL define 16 additional rarity levels (id 13-28) in the RARITIES constant array, extending the existing 12-rarity set to the full 28-rarity set specified in the game design document.

Each new rarity SHALL have: id, name (zh), name (en), probability (chance), display color, and badge description in both languages.

| id | zh | en | chance | color | badgeDescription |
|----|----|----|--------|-------|------------------|
| 13 | 超级传说 | Super Legendary | 1/4096 | #ffe600 | 带有金色双光芒的八角形徽章 |
| 14 | 极致传说 | Ultra Legendary | 1/8192 | #fff069 | 带有金色三光芒的八角形徽章 |
| 15 | 超越理解的传说 | Legendary Beyond Comprehension | 1/16384 | #fff7cf | 带有金色光环的十角形徽章 |
| 16 | 神话 | Mythical | 1/32768 | #ff6666 | 带有红色火焰的钻石形徽章 |
| 17 | 非常神话 | Very Mythical | 1/65536 | #ff4242 | 带有红色双火焰的钻石形徽章 |
| 18 | 超级神话 | Super Mythical | 1/131072 | #ff2b2b | 带有红色三火焰的钻石形徽章 |
| 19 | 极致神话 | Ultra Mythical | 1/262144 | #ff0000 | 带有红色光环的钻石形徽章 |
| 20 | 闻所未闻... | Unheard-of... | 1/524288 | #961111 | 带有黑色边缘的不规则形徽章 |
| 21 | 黑暗 | Darkness | 1/1048576 | #454545 | 带有黑色漩涡的不规则形徽章 |
| 22 | 绝对黑暗 | Absolute Darkness | 1/2097152 | #000000 | 纯黑色的不规则形徽章 |
| 23 | 我已一无所有... | Now I Have Nothing... | 1/4194304 | #ffffff | 带有裂缝的白色不规则形徽章 |
| 24 | 甚至没有时间... | Not Even Time... | 1/8388608 | #6f00ff | 带有紫色时钟图案的不规则形徽章 |
| 25 | 你为什么要这样做？ | Why Did You Do This? | 1/16777216 | #8455c2 | 带有问号图案的不规则形徽章 |
| 26 | 你撕裂了结构... | You Tore Apart The Fabric... | 1/33554432 | #4f3f8a | 带有撕裂图案的不规则形徽章 |
| 27 | 那维系着一切... | That Holds Everything Together... | 1/67108864 | #474a6e | 带有网格图案的不规则形徽章 |
| 28 | 我永远不会原谅你。 | And I'll Never Forgive You. | 1/134217728 | #4a615b | 带有破碎心形的不规则形徽章 |

#### Scenario: Rarity 13 exists in RARITIES array
- **WHEN** the game loads
- **THEN** `RARITIES` array SHALL contain an entry with `{ id: 13, rarity: "超级传说", rarityEn: "Super Legendary", chance: 1/4096, color: "#ffe600" }`

#### Scenario: Rarity 28 exists in RARITIES array
- **WHEN** the game loads
- **THEN** `RARITIES` array SHALL contain an entry with `{ id: 28, rarity: "我永远不会原谅你。", rarityEn: "And I'll Never Forgive You.", chance: 1/134217728, color: "#4a615b" }`

#### Scenario: RARITIES array length is 28
- **WHEN** the game initializes
- **THEN** `RARITIES.length` SHALL equal 28

### Requirement: System provides SVG badge images for rarities 13-28

The system SHALL provide 16 SVG badge images (badge_13.svg through badge_28.svg) matching the visual descriptions in the game design document. Each SVG SHALL use a 100x100 viewBox and follow the same geometric style as badges 1-12.

#### Scenario: Badge 13 SVG exists
- **WHEN** the game renders a badge with rarityId=13
- **THEN** the Badge component SHALL display the badge_13.svg image

#### Scenario: Badge 28 SVG exists
- **WHEN** the game renders a badge with rarityId=28
- **THEN** the Badge component SHALL display the badge_28.svg image

### Requirement: Badge component supports rarities 1-28

The Badge component SHALL support rarity IDs 1 through 28 inclusive. The existing 12-upper-bound clamp SHALL be replaced with a 28-upper-bound or a dynamic bound based on RARITIES.length.

#### Scenario: Badge renders rarity 13
- **WHEN** Badge component receives `rarityId={13}`
- **THEN** it SHALL render badge_13.svg without falling back to badge_12

#### Scenario: Badge renders rarity 28
- **WHEN** Badge component receives `rarityId={28}`
- **THEN** it SHALL render badge_28.svg without falling back to badge_12

### Requirement: Achievement system auto-extends to cover rarities 13-28

The achievement system SHALL automatically generate discovery achievements for newly discovered rarities 13-28 and quantity achievements (1000, 10000) for each new rarity, following the same pattern used for rarities 7-12.

#### Scenario: Discovery achievements exist for rarity 13
- **WHEN** the ACHIEVEMENTS array is built
- **THEN** it SHALL contain an entry with `id: "discover_13"` and `condition: { type: "rarity", value: 13 }`

#### Scenario: Discovery achievements exist for rarity 28
- **WHEN** the ACHIEVEMENTS array is built
- **THEN** it SHALL contain an entry with `id: "discover_28"` and `condition: { type: "rarity", value: 28 }`

#### Scenario: Quantity achievements exist for rarity 13
- **WHEN** the ACHIEVEMENTS array is built
- **THEN** it SHALL contain entries `quantity_13_1000` and `quantity_13_10000`

#### Scenario: Quantity achievements exist for rarity 28
- **WHEN** the ACHIEVEMENTS array is built
- **THEN** it SHALL contain entries `quantity_28_1000` and `quantity_28_10000`

### Requirement: Index page lists all 28 rarities

The index page (显式Tab/Index Tab) SHALL display entries for all 28 rarities, with undiscovered rarities (13-28) showing count 0 and the waiting-to-be-discovered label.

#### Scenario: Index shows all 28 entries
- **WHEN** the player opens the Index tab
- **THEN** the list SHALL contain 28 entries, one for each rarity id 1 through 28

#### Scenario: Undiscovered rarity shows zero count
- **WHEN** the player has not yet discovered rarity 13
- **THEN** the index entry for rarity 13 SHALL display a count of 0

### Requirement: formatNumber supports up to trillions

The formatNumber function SHALL support up to trillions (1e12), displaying values >= 1e12 with a "T" suffix.

#### Scenario: Trillions display
- **WHEN** `formatNumber(1.5e12)` is called
- **THEN** it SHALL return `"1.50T"`

### Requirement: totalRarities array adapts to RARITIES length

The player state's totalRarities array SHALL initialize to `Array(RARITIES.length).fill(0)` so that it automatically extends to 28 entries when RARITIES has 28 items.

#### Scenario: totalRarities length matches RARITIES
- **WHEN** a new game is initialized
- **THEN** `playerState.totalRarities.length` SHALL equal `RARITIES.length`
