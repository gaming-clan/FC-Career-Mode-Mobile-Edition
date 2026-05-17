/**
 * Player Statistics and Game Mechanics
 * Handles player performance, development, and game simulation
 */

/**
 * Player stats interface for calculations
 */
export interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defense: number;
  physical: number;
}

/**
 * Performance rating for a player after a match
 */
export interface PlayerPerformanceRating {
  playerId: number;
  matchRating: number; // 0-10
  goalsScored: number;
  assists: number;
  shotAccuracy: number; // percentage
  passAccuracy: number; // percentage
  tacklesWon: number;
  formChange: number; // -5 to +5
}

/**
 * Calculate overall rating from individual stats
 * Weighted average with emphasis on position-specific stats
 */
export function calculateOverallRating(stats: PlayerStats): number {
  const average = (stats.pace + stats.shooting + stats.passing + stats.dribbling + stats.defense + stats.physical) / 6;
  return Math.round(average);
}

/**
 * Get base match performance based on player stats and form
 * Used for match simulations
 */
export function getPlayerPerformanceMultiplier(
  overallRating: number,
  form: number, // 0-100
  morale: number, // 0-100
): number {
  // Base performance from rating
  const ratingMultiplier = overallRating / 100;

  // Form affects performance by ±20%
  const formEffect = (form - 50) / 250;

  // Morale affects motivation by ±10%
  const moraleEffect = (morale - 50) / 500;

  return ratingMultiplier * (1 + formEffect + moraleEffect);
}

/**
 * Simulate position-specific expected stats in a match
 * Used to predict player output for a given position
 */
export interface ExpectedMatchStats {
  expectedGoals: number; // xG
  expectedAssists: number; // xA
  shotAccuracy: number; // percentage
  passAccuracy: number; // percentage
  tackleSuccess: number; // percentage
}

export function getExpectedMatchStats(
  position: string,
  stats: PlayerStats,
  form: number,
  morale: number,
): ExpectedMatchStats {
  const performanceMultiplier = getPlayerPerformanceMultiplier(
    calculateOverallRating(stats),
    form,
    morale,
  );

  switch (position) {
    case "ST":
    case "CF":
      return {
        expectedGoals: (stats.shooting / 100) * 0.6 * performanceMultiplier,
        expectedAssists: (stats.passing / 100) * 0.2 * performanceMultiplier,
        shotAccuracy: Math.min(stats.shooting / 100, 1) * 70 + 30,
        passAccuracy: Math.min(stats.passing / 100, 1) * 65 + 50,
        tackleSuccess: 20,
      };

    case "LW":
    case "RW":
      return {
        expectedGoals: (stats.shooting / 100) * 0.4 * performanceMultiplier,
        expectedAssists: (stats.passing / 100) * 0.3 * performanceMultiplier,
        shotAccuracy: Math.min(stats.dribbling / 100, 1) * 60 + 40,
        passAccuracy: Math.min(stats.passing / 100, 1) * 70 + 45,
        tackleSuccess: 30,
      };

    case "CAM":
      return {
        expectedGoals: (stats.shooting / 100) * 0.2 * performanceMultiplier,
        expectedAssists: (stats.passing / 100) * 0.5 * performanceMultiplier,
        shotAccuracy: Math.min(stats.shooting / 100, 1) * 60 + 40,
        passAccuracy: Math.min(stats.passing / 100, 1) * 90 + 40,
        tackleSuccess: 40,
      };

    case "CM":
      return {
        expectedGoals: (stats.shooting / 100) * 0.15 * performanceMultiplier,
        expectedAssists: (stats.passing / 100) * 0.25 * performanceMultiplier,
        shotAccuracy: Math.min(stats.shooting / 100, 1) * 55 + 45,
        passAccuracy: Math.min(stats.passing / 100, 1) * 85 + 50,
        tackleSuccess: 60,
      };

    case "CDM":
      return {
        expectedGoals: (stats.defense / 100) * 0.05 * performanceMultiplier,
        expectedAssists: (stats.passing / 100) * 0.1 * performanceMultiplier,
        shotAccuracy: Math.min(stats.shooting / 100, 1) * 45 + 50,
        passAccuracy: Math.min(stats.passing / 100, 1) * 80 + 55,
        tackleSuccess: 75,
      };

    case "LB":
    case "RB":
      return {
        expectedGoals: (stats.physical / 100) * 0.02 * performanceMultiplier,
        expectedAssists: (stats.passing / 100) * 0.15 * performanceMultiplier,
        shotAccuracy: Math.min(stats.shooting / 100, 1) * 40 + 50,
        passAccuracy: Math.min(stats.passing / 100, 1) * 80 + 55,
        tackleSuccess: 70,
      };

    case "CB":
      return {
        expectedGoals: (stats.physical / 100) * 0.01 * performanceMultiplier,
        expectedAssists: (stats.passing / 100) * 0.05 * performanceMultiplier,
        shotAccuracy: Math.min(stats.shooting / 100, 1) * 30 + 50,
        passAccuracy: Math.min(stats.passing / 100, 1) * 85 + 55,
        tackleSuccess: 80,
      };

    case "GK":
      return {
        expectedGoals: 0,
        expectedAssists: 0,
        shotAccuracy: 0,
        passAccuracy: Math.min(stats.passing / 100, 1) * 70 + 50,
        tackleSuccess: 85,
      };

    default:
      return {
        expectedGoals: 0.1,
        expectedAssists: 0.05,
        shotAccuracy: 50,
        passAccuracy: 70,
        tackleSuccess: 50,
      };
  }
}

/**
 * Simulate player development over time
 * Young players improve, old players decline
 */
export function simulatePlayerDevelopment(
  age: number,
  potential: number,
  currentRating: number,
  trainingQuality: number, // 1-5
): { newRating: number; newAge: number } {
  let developmentRate = 0;

  if (age < 23) {
    // Young players improve faster
    developmentRate = (potential - currentRating) * 0.15 * (trainingQuality / 5);
  } else if (age < 28) {
    // Peak years, slight improvement possible
    developmentRate = (potential - currentRating) * 0.05 * (trainingQuality / 5);
  } else if (age < 32) {
    // Maintenance phase
    developmentRate = (potential - currentRating) * 0.02 * (trainingQuality / 5);
  } else {
    // Decline phase
    developmentRate = -0.8; // Decline per year
  }

  const newRating = Math.max(40, Math.min(99, currentRating + developmentRate));

  return {
    newRating: Math.round(newRating),
    newAge: age + 1,
  };
}

/**
 * Calculate stat changes based on position specialization
 */
export function getPositionStatModifiers(position: string): Partial<PlayerStats> {
  switch (position) {
    case "ST":
      return { shooting: 2, dribbling: 1, defense: -2 };
    case "CF":
      return { shooting: 2, passing: 1, defense: -2 };
    case "LW":
    case "RW":
      return { dribbling: 2, pace: 1, defense: -1 };
    case "CAM":
      return { passing: 2, dribbling: 1, defense: -2 };
    case "CM":
      return { passing: 1, defense: 1 };
    case "CDM":
      return { defense: 2, physical: 1, dribbling: -1 };
    case "LB":
    case "RB":
      return { defense: 1, pace: 1, passing: 1 };
    case "CB":
      return { defense: 2, physical: 1, pace: -1 };
    case "GK":
      return { physical: 2, defense: 2, pace: -2 };
    default:
      return {};
  }
}

/**
 * Estimate transfer market value for a player
 */
export function estimateTransferValue(
  age: number,
  overallRating: number,
  potential: number,
  contractYearsRemaining: number,
): number {
  // Base value formula
  let baseValue = overallRating * overallRating * 1000;

  // Age factor
  if (age < 23) {
    baseValue *= 1.2 * (potential / overallRating);
  } else if (age > 32) {
    baseValue *= 0.5;
  } else if (age > 30) {
    baseValue *= 0.7;
  }

  // Contract factor
  if (contractYearsRemaining < 1) {
    baseValue *= 0.5;
  } else if (contractYearsRemaining < 2) {
    baseValue *= 0.75;
  }

  // Round to nearest 100k
  return Math.max(100000, Math.round(baseValue / 100000) * 100000);
}

/**
 * Get suggested players by position and budget
 */
export interface PlayerSuggestion {
  playerId: number;
  name: string;
  position: string;
  age: number;
  overallRating: number;
  estimatedValue: number;
  contractUntil: number;
}

export function suggestPlayersByPosition(
  position: string,
  maxBudget: number,
  players: Array<{
    id: number;
    firstName: string;
    lastName: string;
    position: string;
    age: number;
    overallRating: number;
    contractEndYear: number;
  }>,
): PlayerSuggestion[] {
  return players
    .filter((p) => p.position === position)
    .map((p) => ({
      playerId: p.id,
      name: `${p.firstName} ${p.lastName}`,
      position: p.position,
      age: p.age,
      overallRating: p.overallRating,
      estimatedValue: estimateTransferValue(p.age, p.overallRating, p.overallRating, p.contractEndYear - new Date().getFullYear()),
      contractUntil: p.contractEndYear,
    }))
    .filter((p) => p.estimatedValue <= maxBudget)
    .sort((a, b) => b.overallRating - a.overallRating)
    .slice(0, 10);
}
