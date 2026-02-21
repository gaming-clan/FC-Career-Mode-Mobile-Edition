# FC Career Mode Mobile Edition - Codebase Audit & Analysis

This report provides a comprehensive audit of the FC Career Mode Mobile Edition codebase, identifying architectural strengths, technical debt, bugs, and opportunities for improvement.

## 1. Executive Summary

The codebase is a **React Native (Expo)** application with a **Drizzle ORM** backend. It features a sophisticated, modular game engine capable of simulating football matches, player development, and season progression. However, there is a significant **architectural split** between the core game engine (`lib/career-engine.ts`, `lib/match-simulation.ts`) and the current application implementation (`lib/match-integration.ts`, `lib/season-progression.ts`).

### Key Findings:
- **Redundant Systems**: Two parallel match simulation and season progression systems exist.
- **Mock Data Dependency**: Most UI screens rely on hardcoded mock data instead of the database or game state.
- **Incomplete Integration**: The advanced game engine features (aging, potential-based development, xG-based simulation) are not yet wired into the main application flow.
- **Type Inconsistencies**: There are slight mismatches between the `CareerPlayer` interface and the database `players` schema.

---

## 2. Technical Audit

### 2.1 Architecture & Modularization
The project uses a clean directory structure:
- `app/`: Expo Router based screens.
- `components/`: Reusable UI elements.
- `lib/`: Core logic and game engine.
- `drizzle/`: Database schema and migrations.

**Issue**: The `lib/` directory contains two versions of many core functions. 
- `match-simulation.ts` (Advanced) vs `match-integration.ts` (Simple).
- `career-engine.ts` (Advanced) vs `season-progression.ts` (Simple).

**Recommendation**: Consolidate these into a single, robust system using the advanced engine as the source of truth.

### 2.2 Game Engine Analysis

| Feature | Status | Analysis |
| :--- | :--- | :--- |
| **Match Simulation** | 🟨 Partial | `simulateMatch` in `match-simulation.ts` is excellent but unused by the UI, which uses the simpler `match-integration.ts`. |
| **Player Development** | 🟨 Partial | Logic exists in `player-stats.ts` but is not integrated with the season progression. |
| **Transfer Market** | 🟨 Partial | Two different transfer logic files exist (`transfer-market.ts` and logic within `club-squad-management.ts`). |
| **Board Expectations** | ✅ Ready | Good logic in `board-expectations.ts`, needs UI implementation. |

### 2.3 Database & Data Integrity
The Drizzle schema is well-defined and covers:
- Users & Saves
- Clubs & Leagues
- Players & Development History
- Managers & Fixtures

**Bug Found**: `players` table in `schema.ts` uses `mysqlEnum` for positions, but some engine logic uses strings or different categories (e.g., `match(/[ST]|W/)`). This might cause runtime errors or filtering issues.

---

## 3. Identified Bugs & Issues

### 3.1 Critical Issues
1. **Disconnected Game Loop**: Playing a match in `match-report.tsx` uses mock data and doesn't update the database or the user's career save state.
2. **State Persistence**: While `career-storage.ts` exists for `AsyncStorage`, the app doesn't consistently use it to load/save the `CareerGameState`.

### 3.2 Logic Errors
1. **Match Simulation Randomness**: In `match-integration.ts`, goal scorers are chosen randomly (`Home Player ${n}`) rather than from the actual squad.
2. **Age Progression**: In `career-engine.ts`, the `endSeason` function increments age but doesn't update the database, only the in-memory state.

---

## 4. Proposed Improvements & New Features

### 4.1 Immediate Fixes (Phase 4)
- **Unified Engine**: Replace `match-integration.ts` with `match-simulation.ts`.
- **Database Integration**: Update UI screens to fetch data from the Drizzle DB.
- **State Management**: Implement a global state or context to manage the active `CareerGameState`.

### 4.2 Feature Enhancements
- **Dynamic Lineups**: Allow users to actually select their starting 11 in `squad-management.tsx` and have it affect match simulation.
- **Transfer Negotiations**: Implement a UI for the negotiation logic found in `transfer-market.ts`.
- **Youth Academy UI**: Build the screen for promoting youth players based on the `readinessScore`.

---

## 5. Conclusion
The foundation of the game is very strong. The core game engine is "production-ready" in terms of logic, but the application layer is currently a shell using mock data. The focus of the next phase should be **integration and unification**.
