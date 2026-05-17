/**
 * Validation Script for Unified Game Engine
 * Tests core simulation logic and state updates
 */

import { initializeCareer, playCareerMatch, advanceCareerMatchday, endCareerSeason } from "../lib/game-engine-unified";

async function validateEngine() {
  console.log("🚀 Starting Game Engine Validation...");

  // 1. Initialize Career
  const mockClub = {
    id: 1,
    name: "Test FC",
    country: "England",
    division: "Premier League",
    budget: 100000000,
    weeklyWages: 1000000,
    players: [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        age: 23,
        position: "ST",
        overallRating: 85,
        potential: 90,
        pace: 88,
        shooting: 86,
        passing: 75,
        dribbling: 82,
        defense: 40,
        physical: 78,
        morale: 70,
        form: 70,
        contractEndYear: 2026,
        injuryWeeks: 0,
        isYouthPlayer: false,
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        age: 20,
        position: "GK",
        overallRating: 75,
        potential: 85,
        pace: 70,
        shooting: 30,
        passing: 65,
        dribbling: 60,
        defense: 75,
        physical: 70,
        morale: 70,
        form: 70,
        contractEndYear: 2027,
        injuryWeeks: 0,
        isYouthPlayer: true,
      },
    ],
    manager: {
      name: "Test Manager",
      experience: 50,
      reputation: 50,
    },
  };

  let gameState = initializeCareer(mockClub as any, 2024);
  console.log("✅ Career Initialized");

  // 2. Setup Mock Fixtures
  gameState.fixtures = [
    {
      id: 1,
      matchday: 1,
      homeClubId: 1,
      homeClubName: "Test FC",
      awayClubId: 2,
      awayClubName: "Opponent FC",
      played: false,
    },
  ];
  console.log("✅ Mock Fixtures Setup");

  // 3. Play Match
  console.log("⚽ Simulating Match...");
  const { result, updatedGameState } = playCareerMatch(
    gameState,
    1,
    gameState.squad,
    gameState.squad, // Use same squad for opponent for testing
    {
      code: "4-3-3",
      style: "balanced",
      defenders: 4,
      midfielders: 3,
      forwards: 3,
      pressing: "medium",
      buildUp: "mixed",
    },
    {
      code: "4-3-3",
      style: "balanced",
      defenders: 4,
      midfielders: 3,
      forwards: 3,
      pressing: "medium",
      buildUp: "mixed",
    },
    true
  );

  console.log(`✅ Match Completed: ${result.homeScore} - ${result.awayScore}`);
  console.log(`📊 Stats: Possession ${result.stats.home.possession}% - ${result.stats.away.possession}%`);
  console.log(`⭐ Man of the Match: ${result.manOfMatch.name} (${result.manOfMatch.rating.toFixed(1)})`);

  gameState = updatedGameState;

  // 4. Validate State Updates
  if (gameState.seasonStats.matchesPlayed !== 1) {
    throw new Error("Season stats matchesPlayed not updated");
  }
  console.log("✅ Season Stats Updated");

  // 5. Advance Matchday
  gameState = advanceCareerMatchday(gameState);
  if (gameState.currentMatchday !== 2) {
    throw new Error("Current matchday not advanced");
  }
  console.log("✅ Matchday Advanced");

  // 6. End Season
  console.log("📅 Ending Season...");
  const oldAge = gameState.squad[0].age;
  gameState = endCareerSeason(gameState);
  
  if (gameState.currentSeason !== 2025) {
    throw new Error("Current season not advanced");
  }
  if (gameState.squad[0].age !== oldAge + 1) {
    throw new Error("Player age not advanced");
  }
  console.log("✅ Season Ended & Advanced");

  console.log("\n✨ All Game Engine Validations Passed! ✨");
}

validateEngine().catch((err) => {
  console.error("❌ Validation Failed:", err);
  process.exit(1);
});
