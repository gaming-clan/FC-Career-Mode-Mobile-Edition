# Integration Guide - FC Career Mode

This guide explains how to integrate the new game engine, state management, and improved screens into your application.

## Overview

The FC Career Mode now has three main layers:

1. **Game Engine Layer** (`lib/game-engine-unified.ts`) - Core simulation logic
2. **State Management Layer** (`lib/game-state-context.tsx`) - Global state and persistence
3. **UI Layer** (`app/modes/*`) - User-facing screens and components

## Step 1: Wrap Your App with GameStateProvider

The first step is to wrap your entire app with the `GameStateProvider` to enable global state management.

**File: `app/_layout.tsx` or your root layout**

```typescript
import { GameStateProvider } from "@/lib/game-state-context";

export default function RootLayout() {
  return (
    <GameStateProvider>
      {/* Your app content */}
    </GameStateProvider>
  );
}
```

This provider must wrap all screens that use the game state.

## Step 2: Initialize a New Career

When a user starts a new career, initialize the game state:

**File: `app/modes/create_a_club.tsx` (or similar)**

```typescript
import { useGameActions } from "@/lib/game-state-context";
import { initializeCareer } from "@/lib/game-engine-unified";

export default function CreateAClubScreen() {
  const { initializeNewGame } = useGameActions();

  const handleStartCareer = async (club: any) => {
    await initializeNewGame(club, 2024);
    // Navigate to career dashboard
  };

  return (
    // Your UI
  );
}
```

## Step 3: Access Game State in Components

Use the `useGameState` hook to access and modify game state:

**File: `app/modes/squad-management.tsx`**

```typescript
import { useGameState } from "@/lib/game-state-context";

export default function SquadManagementScreen() {
  const { gameState, updateGameState } = useGameState();

  if (!gameState) {
    return <Text>No active career</Text>;
  }

  // Display squad from gameState
  const squad = gameState.squad;

  // Update state after changes
  const handleFormationChange = (newFormation: string) => {
    const updated = { ...gameState };
    // Make changes
    updateGameState(updated);
  };

  return (
    // Your UI
  );
}
```

## Step 4: Simulate Matches

Use the unified match engine to simulate matches:

**File: `app/modes/match-report-improved.tsx`**

```typescript
import { playCareerMatch } from "@/lib/game-engine-unified";
import { useGameState } from "@/lib/game-state-context";

export default function MatchReportScreen() {
  const { gameState, updateGameState } = useGameState();

  const handlePlayMatch = () => {
    const fixture = gameState.fixtures.find(f => !f.played);
    const isHome = fixture.homeClubId === gameState.playerClub.id;

    const { result, updatedGameState } = playCareerMatch(
      gameState,
      fixture.id,
      isHome ? gameState.squad : [],
      !isHome ? gameState.squad : [],
      homeFormation,
      awayFormation,
      isHome
    );

    updateGameState(updatedGameState);
  };

  return (
    // Your UI
  );
}
```

## Step 5: Advance Season

Implement weekly and seasonal progression:

**File: `app/modes/fixtures.tsx`**

```typescript
import { advanceCareerMatchday, endCareerSeason } from "@/lib/game-engine-unified";
import { useGameState } from "@/lib/game-state-context";

export default function FixturesScreen() {
  const { gameState, updateGameState } = useGameState();

  const handleAdvanceWeek = () => {
    const updated = advanceCareerMatchday(gameState);
    updateGameState(updated);
  };

  const handleEndSeason = () => {
    const updated = endCareerSeason(gameState);
    updateGameState(updated);
  };

  return (
    // Your UI
  );
}
```

## Step 6: Integrate New Screens

The following new screens are ready to use:

### Match Report Screen
**File: `app/modes/match-report-improved.tsx`**

Features real-time match simulation with actual squad data. Replace the old `match-report.tsx` with this version.

### Youth Academy
**File: `app/modes/youth-academy.tsx`**

Manages youth player development and promotions. Add to your navigation menu.

### Transfer Market
**File: `app/modes/transfer-market-improved.tsx`**

Browse and negotiate transfers. Add to your navigation menu.

## Step 7: Use New Components

### Player Development Card
Display player progression information:

```typescript
import { PlayerDevelopmentCard } from "@/components/game-modes/player-development-card";

<PlayerDevelopmentCard
  playerName="John Doe"
  position="ST"
  age={23}
  currentRating={78}
  potential={88}
  form={65}
  morale={75}
  onPress={() => {}}
/>
```

## Complete Example: Career Dashboard

Here's a complete example of a career dashboard using all the new features:

```typescript
import React from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useGameState } from "@/lib/game-state-context";
import { calculateManagerRating } from "@/lib/game-engine-unified";
import { PlayerDevelopmentCard } from "@/components/game-modes/player-development-card";

export default function CareerDashboard() {
  const { gameState } = useGameState();

  if (!gameState) {
    return <Text>No active career</Text>;
  }

  const managerRating = calculateManagerRating(gameState.seasonStats);
  const topPlayers = gameState.squad
    .sort((a, b) => b.overallRating - a.overallRating)
    .slice(0, 5);

  return (
    <ScrollView>
      {/* Season Info */}
      <View>
        <Text>Season {gameState.currentSeason}</Text>
        <Text>Matchday {gameState.currentMatchday}</Text>
      </View>

      {/* Manager Rating */}
      <View>
        <Text>Manager Rating: {managerRating}/100</Text>
      </View>

      {/* Season Stats */}
      <View>
        <Text>
          Record: {gameState.seasonStats.wins}W {gameState.seasonStats.draws}D{" "}
          {gameState.seasonStats.losses}L
        </Text>
        <Text>
          Goals: {gameState.seasonStats.goalsFor} - {gameState.seasonStats.goalsAgainst}
        </Text>
        <Text>Points: {gameState.seasonStats.pointsTotal}</Text>
      </View>

      {/* Top Players */}
      <View>
        <Text>Top Players</Text>
        {topPlayers.map((player) => (
          <PlayerDevelopmentCard
            key={player.id}
            playerName={`${player.firstName} ${player.lastName}`}
            position={player.position}
            age={player.age}
            currentRating={player.overallRating}
            potential={player.potential}
            form={player.form}
            morale={player.morale}
          />
        ))}
      </View>
    </ScrollView>
  );
}
```

## Database Integration

The new code integrates with these tables:

### Players Table
```sql
SELECT * FROM players WHERE clubId = ?
```

### Career Saves Table
```sql
INSERT INTO career_saves (userId, mode, name, clubId, currentSeason, currentWeek, gameData)
VALUES (?, ?, ?, ?, ?, ?, ?)
```

### Player Development Table
```sql
INSERT INTO player_development (playerId, season, week, overallRating, pace, shooting, ...)
VALUES (?, ?, ?, ?, ?, ?, ...)
```

### Fixtures Table
```sql
UPDATE fixtures SET homeGoals = ?, awayGoals = ?, status = 'completed'
WHERE id = ?
```

## API Integration Points

If you have a backend API, integrate these endpoints:

### Get Club Data
```typescript
const club = await fetch(`/api/clubs/${clubId}`).then(r => r.json());
```

### Get Opponent Squad
```typescript
const opponent = await fetch(`/api/clubs/${opponentId}/squad`).then(r => r.json());
```

### Save Career Progress
```typescript
await fetch(`/api/career-saves/${saveId}`, {
  method: 'PUT',
  body: JSON.stringify(gameState)
});
```

### Get Transfer Market
```typescript
const market = await fetch(`/api/transfer-market`).then(r => r.json());
```

## Performance Optimization

### Memoization
Use React.memo for expensive components:

```typescript
const PlayerCard = React.memo(({ player }) => (
  // Component
));
```

### Lazy Loading
Load screens on demand:

```typescript
const YouthAcademy = React.lazy(() => import("@/app/modes/youth-academy"));
```

### Pagination
For large lists, implement pagination:

```typescript
const [page, setPage] = useState(0);
const itemsPerPage = 20;
const displayedPlayers = filteredPlayers.slice(
  page * itemsPerPage,
  (page + 1) * itemsPerPage
);
```

## Error Handling

Always handle errors gracefully:

```typescript
try {
  const { result, updatedGameState } = playCareerMatch(...);
  updateGameState(updatedGameState);
} catch (error) {
  console.error("Match simulation failed:", error);
  showErrorMessage("Failed to simulate match");
}
```

## Testing

### Unit Tests
```typescript
describe("simulateUnifiedMatch", () => {
  it("should return valid match result", () => {
    const result = simulateUnifiedMatch(setup);
    expect(result.homeScore).toBeGreaterThanOrEqual(0);
    expect(result.awayScore).toBeGreaterThanOrEqual(0);
  });
});
```

### Integration Tests
```typescript
describe("Career Flow", () => {
  it("should complete full match and update state", async () => {
    const { result, updatedGameState } = playCareerMatch(...);
    expect(updatedGameState.seasonStats.matchesPlayed).toBe(1);
  });
});
```

## Troubleshooting

### Issue: "useGameState must be used within GameStateProvider"
**Solution**: Ensure `GameStateProvider` wraps your component tree in `_layout.tsx`.

### Issue: Game state not persisting
**Solution**: Check that `AsyncStorage` is properly initialized and has permissions.

### Issue: Match simulation too slow
**Solution**: Reduce squad size or implement pagination for match events.

### Issue: Type errors with CareerGameState
**Solution**: Ensure you're importing types from `lib/career-engine.ts`.

## Next Steps

1. Wrap your app with `GameStateProvider`
2. Replace old match report screen with improved version
3. Add new screens to navigation
4. Integrate with database
5. Test complete career flow
6. Deploy and monitor performance

For questions or issues, refer to the audit report and improvements document.
