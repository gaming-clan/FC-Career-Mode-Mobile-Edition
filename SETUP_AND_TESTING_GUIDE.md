# Career Mode Game Engine - Setup & Testing Guide

Quick reference for setting up and testing the career mode system.

## Project Structure

```
lib/
├── player-stats.ts               # Player development, stats, transfer values
├── club-squad-management.ts      # Squad analysis, youth academy, transfer market
├── match-simulation.ts           # Match events, xG, formation recommendations
├── career-engine.ts              # Season progression, match orchestration
├── react-integration-examples.tsx # React component examples
└── react-integration-examples.tsx # Game engine API usage examples

constants/
└── game-balance.ts               # All game balance tuning values

scripts/
├── seed-data.ts                  # Real club and player data (10 Premier League clubs)
└── seed-database.ts              # Database seeding script

docs/
└── GAME_ENGINE_DOCUMENTATION.md  # Full technical documentation
```

## Quick Start

### 1. Seed the Database with Real Data

First, populate the database with realistic Premier League clubs and players:

```bash
# From project root
tsx scripts/seed-database.ts
```

**What it does:**
- Creates 1 league entry (Premier League)
- Adds 10 Premier League clubs with accurate data:
  - Man City, Man United, Liverpool, Arsenal, Chelsea, Tottenham, Brighton, Aston Villa, Newcastle, West Ham
  - Includes colors, stadiums, capacities, facilities, and financial info
- Adds 30+ real players with Transfermarkt-sourced stats
- Creates player-club relationships
- Initializes player appearances (hair color, kit number)

**Expected output:**
```
🌱 Starting database population...
✅ League created: Premier League
✅ 10 clubs created
✅ 30+ players created
✅ 50+ player appearances created
Database seeding complete!
```

### 2. Import in Your Components

```typescript
// In your career mode component
import { initializeCareer, playMatch, advanceMatchday, endSeason } from "@/lib/career-engine";
import { analyzeSquadBalance, identifyYouthPromotionCandidates } from "@/lib/club-squad-management";
import { calculateOverallRating, simulatePlayerDevelopment } from "@/lib/player-stats";
import { simulateMatch, recommendFormation } from "@/lib/match-simulation";
import { PLAYER_RATING, DEVELOPMENT_RATES, SEASON } from "@/constants/game-balance";
```

### 3. Initialize a Career

```typescript
// Fetch a club from database
const club = await db.query.clubs.findFirst({
  where: (clubs, { eq }) => eq(clubs.id, 1), // Man City
  with: {
    players: true,
  },
});

// Start career
const gameState = initializeCareer(club, 2024);

// Save to localStorage or database
localStorage.setItem("career_state", JSON.stringify(gameState));
```

## Testing the Systems

### Test 1: Player Development

```typescript
import { simulatePlayerDevelopment } from "@/lib/player-stats";

// Test young player development
const youngPlayer = {
  age: 20,
  potential: 85,
  currentRating: 72,
  trainingQuality: 4,
};

const yearResult = simulatePlayerDevelopment(
  youngPlayer.age,
  youngPlayer.potential,
  youngPlayer.currentRating,
  youngPlayer.trainingQuality,
);

console.assert(yearResult.newRating > youngPlayer.currentRating, "Young player should improve");
console.assert(yearResult.newAge === 21, "Age should increase by 1");

// Test decline phase
const veteranPlayer = {
  age: 34,
  potential: 82,
  currentRating: 78,
  trainingQuality: 3,
};

const veteranResult = simulatePlayerDevelopment(
  veteranPlayer.age,
  veteranPlayer.potential,
  veteranPlayer.currentRating,
  veteranPlayer.trainingQuality,
);

console.assert(veteranResult.newRating < veteranPlayer.currentRating, "Veteran should decline");
```

### Test 2: Match Simulation

```typescript
import { simulateMatch } from "@/lib/match-simulation";
import type { MatchSetup } from "@/lib/match-simulation";

// Create test match
const matchSetup: MatchSetup = {
  homeTeam: {
    clubId: 1,
    clubName: "Manchester City",
    players: [
      { id: 1, name: "Haaland", position: "ST", overallRating: 96 },
      { id: 2, name: "De Bruyne", position: "CM", overallRating: 93 },
      // ... 9 more players
    ],
    formation: {
      formationCode: "4-3-3",
      defenders: 4,
      midfielders: 3,
      forwards: 3,
      style: "attacking",
      pressing: "high",
      buildUp: "short",
    },
    morale: 85,
  },
  awayTeam: {
    clubId: 2,
    clubName: "Team B",
    players: [
      { id: 50, name: "Player A", position: "ST", overallRating: 75 },
      // ... players
    ],
    formation: {
      formationCode: "4-3-3",
      defenders: 4,
      midfielders: 3,
      forwards: 3,
      style: "defensive",
      pressing: "medium",
      buildUp: "long",
    },
    morale: 65,
  },
  homeFieldAdvantage: 1.1,
  neutralVenue: false,
};

const result = simulateMatch(matchSetup);

console.log(`Score: ${result.homeScore} - ${result.awayScore}`);
console.log(`Events: ${result.events.length}`);
console.log(`Man of Match: ${result.manOfMatch.name}`);
console.assert(result.homeScore >= 0, "Score should be valid");
console.assert(result.events.length > 0, "Match should have events");
```

### Test 3: Squad Analysis

```typescript
import { analyzeSquadBalance } from "@/lib/club-squad-management";

const analysis = analyzeSquadBalance(gameState.squad);

console.log("Strong Positions:", analysis.strongPositions);
console.log("Weak Positions:", analysis.weakPositions);
console.log("Age Balance:", analysis.ageBalance);
console.log("Suggestions:", analysis.suggestions);

// Verify recommendations
console.assert(Array.isArray(analysis.suggestions), "Should have suggestions");
console.assert(analysis.ageBalance !== "", "Should determine age balance");
```

### Test 4: Season Progression

```typescript
import { playMatch, advanceMatchday, endSeason } from "@/lib/career-engine";

// Play a match
const fixture = gameState.fixtures.find((f) => !f.played);
const { result, updatedGameState } = playMatch(gameState, fixture!);

console.assert(updateGameState.seasonStats.matchesPlayed === 1, "Matches played should increment");
console.assert(result.homeScore >= 0, "Goal differential should be reasonable");

// Advance week
gameState = advanceMatchday(updatedGameState);

// End season
gameState = endSeason(gameState);
console.assert(gameState.currentSeason === 2025, "Season should advance");
console.assert(gameState.currentMatchday === 1, "Should reset to matchday 1");
```

## Performance Benchmarks

Run these to ensure systems are performant:

### Benchmark 1: Match Simulation Speed

```typescript
import { simulateMatch } from "@/lib/match-simulation";

console.time("Single Match Simulation");
for (let i = 0; i < 100; i++) {
  simulateMatch(matchSetup);
}
console.timeEnd("Single Match Simulation");

// Target: < 5000ms for 100 matches (50ms each)
```

### Benchmark 2: Squad Analysis Speed

```typescript
import { analyzeSquadBalance } from "@/lib/club-squad-management";

console.time("Squad Analysis");
for (let i = 0; i < 1000; i++) {
  analyzeSquadBalance(gameState.squad);
}
console.timeEnd("Squad Analysis");

// Target: < 100ms for 1000 analyses
```

### Benchmark 3: Player Development Projection

```typescript
import { projectSquadStrength } from "@/lib/club-squad-management";

console.time("Season Projection");
projectSquadStrength(gameState.squad, 2024);
console.timeEnd("Season Projection");

// Target: < 50ms
```

## Common Issues & Solutions

### Issue: "Cannot find module"

**Solution:** Ensure all imports use correct paths:
```typescript
// ✅ Correct
import { simulateMatch } from "@/lib/match-simulation";
import { PLAYER_RATING } from "@/constants/game-balance";

// ❌ Wrong
import { simulateMatch } from "./lib/match-simulation";
```

### Issue: "Player has no property xyz"

**Solution:** Check that CareerPlayer interface matches database schema:
```typescript
// Ensure all fields exist in database:
interface CareerPlayer {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  position: string;
  overallRating: number;
  potential: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defense: number;
  physical: number;
  morale: number;
  form: number;
  contractEndYear: number;
  injuryWeeks: number;
  isYouthPlayer: boolean;
  }
```

### Issue: "Match always same result"

**Solution:** This is a known issue with randomization. The simulation uses `Math.random()` which is deterministic if seeded. To add variability:
```typescript
// In match-simulation.ts, multiply random values:
const homeScore = Math.round(homeXG + (Math.random() > 0.5 ? 1 : 0));
// This creates natural variance while keeping xG as base
```

## Next Steps

### Phase 1: Basic Career Mode (1-2 weeks)
- [ ] Create career initialization screen (club selection)
- [ ] Build fixture list view
- [ ] Implement match simulation UI
- [ ] Add season statistics dashboard

### Phase 2: Squad Management (2-3 weeks)
- [ ] Squad list with filtering/sorting
- [ ] Player detail modals
- [ ] Youth academy management
- [ ] Contract management interface

### Phase 3: Transfer Market (2-3 weeks)
- [ ] Transfer window mechanics
- [ ] Transfer offers rendering
- [ ] Squad budget management
- [ ] Contract negotiations

### Phase 4: Advanced Features (Optional)
- [ ] Rival clubs with personalities
- [ ] Media system affecting morale
- [ ] Scout system for talent discovery
- [ ] Loan player mechanics
- [ ] Manager reputation system

## Extending the System

### Adding New Position-Specific Logic

```typescript
// In player-stats.ts, getExpectedMatchStats()

case "LM": // Left midfielder (new position)
  return {
    expectedGoals: (stats.shooting / 100) * 0.25 * performanceMultiplier,
    expectedAssists: (stats.passing / 100) * 0.4 * performanceMultiplier,
    shotAccuracy: Math.min(stats.dribbling / 100, 1) * 60 + 40,
    passAccuracy: Math.min(stats.passing / 100, 1) * 75 + 45,
    tackleSuccess: 50,
  };
```

### Adding New Match Events

```typescript
// In match-simulation.ts, simulateMatch()

// Add own goal event
if (Math.random() < MATCH_PROBABILITIES.OWN_GOAL) {
  const randomPlayer = allPlayers[Math.floor(Math.random() * allPlayers.length)];
  events.push({
    minute: Math.floor(Math.random() * 90),
    type: "goal",
    playerId: randomPlayer.id,
    playerName: randomPlayer.name,
    position: randomPlayer.position,
    description: `${randomPlayer.name} own goal 🤦`,
    impact: -5,
  });
}
```

### Adding New Balance Constants

```typescript
// In constants/game-balance.ts

export const WEATHER = {
  RAIN_POSSESSION_EFFECT: -0.05, // Wet pitch = less possession
  COLD_INJURY_MULTIPLIER: 1.2, // More injuries in cold
  WIND_CROSSING_EFFECT: 0.1, // Harder to cross in wind
} as const;
```

## Resources

- **Transfermarkt**: Player stats and valuations https://www.transfermarkt.com
- **Wikipedia**: Club and league information
- **Official Premier League**: Current standings and fixtures

---

**Last Updated**: 2024
**Version**: 1.0.0
**Maintainer**: Your Team
