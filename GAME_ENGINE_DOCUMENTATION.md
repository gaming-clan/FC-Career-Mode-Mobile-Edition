# FC Career Mode Game Engine Documentation

A comprehensive guide to the player career mode system, including player development, club management, match simulation, and season progression.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Core Modules](#core-modules)
- [Game Systems](#game-systems)
- [Balance Constants](#balance-constants)
- [Usage Examples](#usage-examples)
- [Integration Guide](#integration-guide)

## Architecture Overview

The career mode system is organized into independent, composable modules that work together to create a complete football management simulation:

```
┌─────────────────────────────────────────┐
│      Career Mode Game Engine            │
│     (career-engine.ts)                  │
│  - Season progression                   │
│  - Match orchestration                  │
│  - Career state management              │
└─────────────────────────────────────────┘
           ↓ ↓ ↓ ↓ ↓
    ┌────────────────────────┐
    │   Game Systems         │
    └────────────────────────┘
    │                        │
┌───┴─────────────┬──────────┴──────────┬──────────────────┐
│                 │                     │                  │
▼                 ▼                     ▼                  ▼
Player Stats    Club/Squad         Match Simulation   Balance Constants
(player-stats)  Management         (match-simulation) (game-balance)
                (club-squad-mgmt)
```

## Core Modules

### 1. **player-stats.ts** - Individual Player Statistics

Manages individual player performance and development.

#### Key Interfaces

```typescript
interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defense: number;
  physical: number;
}

interface PlayerPerformanceRating {
  playerId: number;
  matchRating: number; // 0-10
  goalsScored: number;
  assists: number;
  shotAccuracy: number;
  passAccuracy: number;
  tacklesWon: number;
  formChange: number; // -5 to +5
}
```

#### Key Functions

**`calculateOverallRating(stats: PlayerStats): number`**
- Calculates overall rating from six attributes using weighted average
- Returns value from 40-99

**`getPlayerPerformanceMultiplier(overall, form, morale): number`**
- Calculates performance boost based on:
  - Overall rating (base)
  - Form (±20% effect)
  - Morale (±10% effect)
- Used for match simulation

**`simulatePlayerDevelopment(age, potential, currentRating, trainingQuality): {...}`**
- Age-based development model:
  - Ages 16-23: Rapid improvement towards potential
  - Ages 24-27: Gradual improvement
  - Ages 28-32: Peak maintenance
  - Ages 33+: Decline phase
- Returns new rating and age

**`getExpectedMatchStats(position, stats, form, morale): ExpectedMatchStats`**
- Position-specific expected performance:
  - Strikers: Focus on goals/shots
  - Wingers: Dribbling/crossing
  - Midfielders: Passing/defense balance
  - Defenders: Tackles/interceptions
  - Goalkeepers: Distribution/saves

**`estimateTransferValue(age, rating, potential, contractYears): number`**
- Market value calculation factors:
  - Player rating squared
  - Age factor (young players valued higher)
  - Potential influence (85+ potential premium)
  - Contract duration discount
- Rounded to nearest 100k

### 2. **club-squad-management.ts** - Club Operations

Manages club-wide statistics, squad composition, and youth development.

#### Key Functions

**`analyzeSquadBalance(players): {...}`**
- Identifies squad strengths/weaknesses by position
- Calculates age balance indicators
- Provides recruitment suggestions
- Returns: strong positions, weak positions, age assessment, recommendations

**`projectSquadStrength(players, currentYear): {...}`**
- Projects squad development one season ahead
- Accounts for:
  - Player age and development potential
  - Contract expirations
  - Natural aging progression
- Returns: projected rating, attrition rate, confidence level

**`calculateWageBudgetUtility(budget, usedWages): {...}`**
- Analyzes budget utilization
- Status levels: overspent | critical | tight | comfortable | abundant
- Returns remaining budget and player signing capability

**`identifyYouthPromotionCandidates(youthPlayers, seniorAverage): YouthPlayerPromotion[]`**
- Identifies youth players ready for first team
- Readiness score combines: age (30%), rating vs squad (40%), potential (30%)
- Recommendations: ready | close | developing | too_young
- Sorted by readiness

### 3. **match-simulation.ts** - Match Mechanics

Simulates individual matches with realistic game events and statistics.

#### Key Types

```typescript
type MatchEventType = "goal" | "assist" | "tackle" | "pass" | "miss" | "save" | "injury" | "yellow" | "red" | "substitution";

interface Formation {
  formationCode: string; // "4-3-3"
  defenders: number;
  midfielders: number;
  forwards: number;
  style: "defensive" | "balanced" | "attacking";
  pressing: "low" | "medium" | "high";
  buildUp: "short" | "mixed" | "long";
}
```

#### Key Functions

**`calculateExpectedGoals(players, formation, possession): number`**
- Calculates xG based on:
  - Player attributes (shooting, dribbling)
  - Formation style (+30% attacking, -40% defensive)
  - Team possession percentage
- Used to predict match outcome probability

**`simulateMatch(matchSetup): MatchResult`**
- Full match simulation including:
  - Possession calculation (rating-based, formation-affected)
  - Expected goals conversion to actual goals
  - Match events: goals, tackles, cards, injuries
  - Statistics: possession, shots, passes, fouls
  - Man of the match selection
- Returns complete match result with events

**`calculatePointsAwarded(homeScore, awayScore): {...}`**
- League points: 3 for win, 1 for draw, 0 for loss
- Standard football rules

**`calculateMoraleImpact(isHome, yourScore, opponentScore, yourRating, opponentRating): number`**
- Morale changes: Win (+15), Draw (+5), Loss (-15)
- Upset bonus: +10 when weaker team wins
- Upset penalty: -15 when stronger team unexpectedly loses
- Home field bonus for wins: +5

**`recommendFormation(players, playStyle): Formation`**
- Suggests optimal formation based on:
  - Available player positions
  - Play style preference
  - Team composition analysis

### 4. **career-engine.ts** - Season Progression

Orchestrates all systems to manage career progression.

#### Key Functions

**`initializeCareer(club, startingSeason): CareerGameState`**
- Prepares game state with:
  - Empty league table
  - Fixture schedule
  - Initial season statistics
  - Youth academy integration

**`playMatch(gameState, fixture, isPlayerControl): {...}`**
- Executes a scheduled match:
  - Creates match setup from game state
  - Simulates match
  - Updates player form/morale
  - Tracks season statistics
  - Manages injuries
- Returns match result and updated game state

**`advanceMatchday(gameState): CareerGameState`**
- Weekly progression:
  - Decreases injury weeks
  - Applies form decay (-2 per week)
  - Prepares for next fixture

**`endSeason(gameState): CareerGameState`**
- Season conclusion:
  - Ages all players
  - Applies development (varies by age)
  - Manages contract expirations
  - Resets season statistics
  - Transitions to next season

**`calculateManagerRating(seasonStats, expectedPosition): number`**
- Manager performance rating (0-100):
  - Points efficiency: 70% = +30, 50% = +10
  - League position vs expectations: ±15
  - Win rate bonus: 50%+ wins = +10
  - Poor performance: <30% wins = -15

**`calculateSeasonBudget(currentBudget, seasonStats, position, tvDeal): number`**
- Next season budget from:
  - TV revenue (fixed)
  - Prize money (position-based: £15M for 1st, £25k for 20th)
  - Performance bonuses: ±10% for top 4, ±5% for mid-table
  - Relegation penalty: -10%

## Game Systems

### Player Development

**Age-Based Development Model:**
- **16-20**: Young player at academy (YOUNG_Academy rate)
- **21-23**: Young talented player (YOUNG_TALENTED rate)
- **24-27**: Developing professional (normal advancement)
- **28-31**: Peak years (maintenance/slight improvement)
- **32-35**: Veteran (decline begins)
- **36+**: Serious decline phase

**Development Calculation:**
```
newRating = currentRating + (potential - currentRating) × developmentRate
```

Development rates are affected by:
- Training quality (1-5 scale)
- Club reputation (top clubs = +0.5% development boost)
- Youth academy facilities (1-5 level)
- Player morale

### Match Simulation

**Possession Calculation:**
```
homePossession = (homeStrength / (homeStrength + awayStrength)) × 100
± adjustments for formation style
```

**Expected Goals (xG):**
- Forwards: `(shooting/100) × 0.3 × (possession/50)`
- Midfielders: `(shooting/100) × 0.1 × (possession/50)`
- Formation modifier: ±30% for attacking/defensive
- Result: Actual goals = round(xG) ± randomness

**Player Performance Multiplier:**
```
perf = (rating/100) × (1 + (form-50)/250 + (morale-50)/500)
```

### Squad Management

**Squad Balance Assessment:**
1. Position-specific averages
2. Age balance: Very Young (<26) / Young / Balanced / Aging (>31)
3. Coverage analysis: Minimum players per position
4. Suggestions: Strengthen weak positions, rejuvenate aging squad

**Youth Development Path:**
1. Academy players (16-20): Develop in youth academy
2. Promotion candidates (70+ readiness): Ready for first team
3. First team integration: Regular minutes for development
4. Contract management: Renewal windows at contract end

### Contract System

**Contract Values:**
- Base: rating × 2000 (weekly wage)
- Young bonus: ×1.3 for age <25
- Age discount: ×0.7 for age >30
- Contract length: 1-5 years (standard 3)

**Expiration Management:**
- Contract end notification at 1 year remaining
- Renewal offer or free transfer
- 50% chance player remains if contract expires

### Transfer Market

**Market Activity:**
- Low window: 10% of available players get offers
- Medium window: 25% get offers
- High window: 40% get offers

**Transfer Likelihood:**
- Player agreement: Higher for young (<25) or expiring contracts
- Club acceptance: Based on bid amount vs estimated value
- Success rate: Combination of both parties' likelihood

## Balance Constants

All game balance values are centralized in `game-balance.ts`:

### Rating Scales
- **World-class**: 88-99
- **Elite**: 80-87
- **Great**: 75-79
- **Professional**: 70-74
- **Developing**: 50-69
- **Minimum**: 40

### Performance Effects
- Form change: ±30 points per match event
- Morale change: ±20 points per match result
- Weekly decay: -2 form, -1 morale
- Home advantage: ×1.1 multiplier

### Season Structure
- 38 league matches per season
- 5 additional cup matches possible
- 2 transfer windows (summer June-Sept, winter Jan-Feb)
- 20 teams per league

## Usage Examples

### Example 1: Initialize Career Mode

```typescript
import { initializeCareer, playMatch, advanceMatchday } from "@/lib/career-engine";

// Start a career with a specific club
const club: CareerClub = {
  id: 1,
  name: "Manchester United",
  players: [...], // 25 players from database
  // ... other properties
};

const gameState = initializeCareer(club, 2024);
```

### Example 2: Simulate a Match

```typescript
import { playMatch } from "@/lib/career-engine";

const homeFixture = gameState.fixtures[0];
const { result, updatedGameState } = playMatch(gameState, homeFixture);

console.log(`Final Score: ${result.homeScore}-${result.awayScore}`);
console.log(`Man of Match: ${result.manOfMatch.name}`);
console.log(`Events: ${result.events.length}`);

// Update game state
gameState = updatedGameState;
```

### Example 3: Analyze Squad

```typescript
import { analyzeSquadBalance } from "@/lib/club-squad-management";

const analysis = analyzeSquadBalance(gameState.squad);

console.log(`Strong Positions: ${analysis.strongPositions.join(", ")}`);
console.log(`Age Balance: ${analysis.ageBalance}`);
console.log(`Suggestions:`, analysis.suggestions);
```

### Example 4: Project Development

```typescript
import { simulatePlayerDevelopment } from "@/lib/player-stats";

const player = gameState.squad[0];
const { newRating, newAge } = simulatePlayerDevelopment(
  player.age,
  player.potential,
  player.overallRating,
  3, // training quality (1-5)
);

console.log(`${player.firstName} develops from ${player.overallRating} to ${newRating}`);
```

### Example 5: Youth Promotion

```typescript
import { identifyYouthPromotionCandidates } from "@/lib/club-squad-management";

const squadAverage = gameState.squad.reduce((a, p) => a + p.overallRating, 0) / gameState.squad.length;
const candidates = identifyYouthPromotionCandidates(gameState.youth.players, squadAverage);

const ready = candidates.filter((c) => c.recommendation === "ready");
console.log(`Ready for promotion: ${ready.map((c) => c.name).join(", ")}`);
```

## Integration Guide

### Database Integration

The career engine requires the following database tables:

1. **players** (from schema.ts)
   - Overall stats and attributes
   - Contract dates
   - Position data

2. **playerDevelopment** (track season progression)
   - Should record: player_id, season, rating, stats
   - Allows historical progression viewing

3. **clubs** (from schema.ts)
   - Basic club information
   - Financial data (budget, wages)

4. **managers** (from schema.ts)
   - Manager stats and performance history

### UI Integration

**Recommended Screen Structure:**
```
Career Mode Root
├── Dashboard (current season summary)
├── Squad Management
│   ├── Squad List
│   ├── Player Details (with development chart)
│   ├── Youth Academy
│   └── Transfer Market
├── Competition
│   ├── Fixtures/Results
│   ├── League Table
│   └── Match Details
├── Club
│   ├── Overview (budget, morale, facilities)
│   ├── Facilities Upgrade
│   └── Contracts
└── Career Stats
    ├── Personal Record
    ├── Season History
    └── Awards & Achievements
```

### State Management

The `CareerGameState` should be persisted with:
- Cloud sync every match/transaction
- Local cache for offline play
- Restore capability from backups

### Match Simulation Integration

Populate `MatchSetup.homeTeam.players` and `.awayTeam.players` from:
- `CareerClub.players` for player club
- Mock/AI generated teams for opponents

## Performance Considerations

- **Match simulation**: ~50ms for single match (optimize if needed)
- **Season projection**: Cache calculated values for multiple seasons
- **Squad analysis**: Batch operations to prevent lag
- **Development calculations**: Use memoization for repeated player rating calc

## Future Enhancements

- Multi-season "what-if" simulations
- Trading deadline mechanics
- Loan system (player loans in/out)
- Rival clubs with personalities
- Assistant manager influence
- Medical/fitness tracking
- Scout system for talent discovery
- Media/press system affecting morale
- Player agents and their influence
