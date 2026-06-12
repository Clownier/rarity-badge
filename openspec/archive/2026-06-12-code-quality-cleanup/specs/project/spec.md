## MODIFIED Requirements

### Requirement: Project directory structure

The project SHALL maintain a clean source tree with no dead code files or unused utility exports.

#### Scenario: use-toast.ts removed
- **WHEN** the project source is inspected
- **THEN** `src/hooks/use-toast.ts` SHALL NOT exist

#### Scenario: cn() not exported from utils.ts
- **WHEN** the project source is inspected
- **THEN** `src/lib/utils.ts` SHALL NOT export a `cn` function

### Requirement: IndexTab is a separate component

The index tab SHALL be implemented as a standalone component file at `src/components/IndexTab.tsx`, consistent with MainTab and StatsTab.

#### Scenario: IndexTab exists as component
- **WHEN** the project source is inspected
- **THEN** `src/components/IndexTab.tsx` SHALL exist and export a React component

#### Scenario: Game.tsx uses IndexTab component
- **WHEN** Game.tsx is inspected
- **THEN** `renderIndexTab` inline function SHALL NOT exist
- **AND** Game.tsx SHALL import and use `<IndexTab>` component

### Requirement: No unused npm dependencies

The project SHALL NOT have unused npm packages in its production or dev dependencies.

#### Scenario: cva and tailwindcss-animate uninstalled
- **WHEN** `npm ls` is run
- **THEN** `class-variance-authority` and `tailwindcss-animate` SHALL NOT be listed

#### Scenario: vite-plugin-svgr uninstalled
- **WHEN** `npm ls` is run
- **THEN** `vite-plugin-svgr` SHALL NOT be listed
- **AND** `vite.config.ts` SHALL NOT reference it in the plugins array
