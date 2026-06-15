## ADDED Requirements

### Requirement: StatsTab displays last 10 normal rolls as color strip

The system SHALL render a horizontal color strip in the StatsTab showing the player's last 10 normal rolls. Each roll SHALL be represented by a colored square/rectangle using the roll's rarity color from RARITIES.

The color strip SHALL:
- Display exactly the last 10 rolls from `player.last10Rolls` (or fewer if not yet 10 rolls)
- Show rolls from oldest (left) to newest (right)
- Have an arrow or visual indicator pointing to the most recent roll
- Show a tooltip on hover with: rarity name, chance, and position (e.g., "#3 of 10")

#### Scenario: Color strip shows all available rolls
- **WHEN** player has rolled 5 times
- **THEN** the color strip SHALL display 5 colored squares
- **WHEN** player has rolled 15 times
- **THEN** the color strip SHALL display 10 colored squares (last 10)

#### Scenario: Color strip orders oldest to newest
- **WHEN** the last 10 rolls are [Common, Uncommon, Rare, Common, Common, Common, Common, Common, Common, Common]
- **THEN** the strip SHALL show Common at left, Common at right, with Uncommon and Rare in between

#### Scenario: Color strip shows current language labels
- **WHEN** language is Chinese
- **THEN** hover tooltip SHALL show Chinese rarity name
- **WHEN** language is English
- **THEN** hover tooltip SHALL show English rarity name

### Requirement: StatsTab displays last 10 rebirth rolls as color strip

The system SHALL render a separate horizontal color strip for rebirth rolls, following the same format as the normal rolls color strip but using `player.last10RegenRolls` as data and REGENRARITIES colors.

#### Scenario: Rebirth color strip hidden when no rebirths
- **WHEN** player has never performed a rebirth
- **THEN** the rebirth color strip SHALL NOT render

#### Scenario: Rebirth color strip shows when rebirths exist
- **WHEN** player has performed at least one rebirth
- **THEN** the rebirth color strip SHALL render with available rebirth roll colors
