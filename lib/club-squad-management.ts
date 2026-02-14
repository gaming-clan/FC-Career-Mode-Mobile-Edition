/**
 * Club and Squad Management
 * Handles club-wide operations and squad analytics
 */

import type { PlayerStats } from "./player-stats";

/**
 * Squad statistics interface
 */
export interface SquadStats {
  totalPlayers: number;
  averageAge: number;
  averageRating: number;
  formation: [number, number, number]; // defenders, midfielders, forwards
  positionCoverage: Record<string, number>;
  injuredPlayers: number;
  homegrowPlayers: number;
  foreignPlayers: number;
}

/**
 * Club financial state
 */
export interface ClubFinancials {
  budget: number;
  weeklyWages: number;
  monthlyRevenue: number;
  stadiumCapacity: number;
  attendancePerMatch: number;
  ticketPrice: number;
  sponsorshipDeals: number;
  merchandiseSales: number;
  competitionPrizePool: number;
}

/**
 * Calculate squad average rating by position
 */
export function getSquadAverageByPosition(
  players: Array<{
    position: string;
    overallRating: number;
  }>,
  position: string,
): number {
  const positionPlayers = players.filter((p) => p.position === position);
  if (positionPlayers.length === 0) return 0;

  const sum = positionPlayers.reduce((acc, p) => acc + p.overallRating, 0);
  return Math.round(sum / positionPlayers.length);
}

/**
 * Analyze squad strengths and weaknesses
 */
export function analyzeSquadBalance(
  players: Array<{
    position: string;
    age: number;
    overallRating: number;
  }>,
): {
  strongPositions: string[];
  weakPositions: string[];
  ageBalance: string;
  suggestions: string[];
} {
  const positionStats = new Map<string, { count: number; avgRating: number; avgAge: number }>();

  for (const player of players) {
    if (!positionStats.has(player.position)) {
      positionStats.set(player.position, { count: 0, avgRating: 0, avgAge: 0 });
    }

    const stats = positionStats.get(player.position)!;
    stats.count++;
    stats.avgRating = (stats.avgRating * (stats.count - 1) + player.overallRating) / stats.count;
    stats.avgAge = (stats.avgAge * (stats.count - 1) + player.age) / stats.count;
  }

  const positions = Array.from(positionStats.entries());
  const avgRating = positions.reduce((acc, [, stats]) => acc + stats.avgRating, 0) / positions.length;
  const avgAge = players.reduce((acc, p) => acc + p.age, 0) / players.length;

  const strongPositions = positions.filter(([, stats]) => stats.avgRating > avgRating + 5).map(([pos]) => pos);

  const weakPositions = positions.filter(([, stats]) => stats.avgRating < avgRating - 5).map(([pos]) => pos);

  let ageBalance = "Balanced";
  if (avgAge < 26) ageBalance = "Very Young";
  else if (avgAge < 28) ageBalance = "Young";
  else if (avgAge > 31) ageBalance = "Aging";
  else if (avgAge > 29) ageBalance = "Slightly Aging";

  const suggestions: string[] = [];

  if (weakPositions.length > 0) {
    suggestions.push(`Strengthen ${weakPositions.join(", ")} positions`);
  }

  if (avgAge > 30) {
    suggestions.push("Consider rejuvenating squad with younger players");
  }

  if (avgAge < 25) {
    suggestions.push("Squad may lack experience; consider adding experienced players");
  }

  const defenderCount = positions.find(([pos]) => pos.includes("B") || pos.includes("CB"))?.[1]?.count ?? 0;
  const midfielderCount = positions.find(([pos]) => pos.includes("M") || pos.includes("CM"))?.[1]?.count ?? 0;
  const forwardCount = positions.find(([pos]) => pos.includes("S") || pos.includes("W"))?.[1]?.count ?? 0;

  if (defenderCount < 4) suggestions.push("Critical: Add defenders to squad");
  if (midfielderCount < 3) suggestions.push("Critical: Add midfielders to squad");
  if (forwardCount < 2) suggestions.push("Add forwards/wingers for depth");

  return {
    strongPositions,
    weakPositions,
    ageBalance,
    suggestions,
  };
}

/**
 * Project squad strength over next season
 */
export function projectSquadStrength(
  players: Array<{
    age: number;
    overallRating: number;
    potential: number;
    contractEndYear: number;
  }>,
  currentYear: number,
): {
  projectedOverallRating: number;
  playersLeaving: number;
  playersStayingWithDevelopment: number;
  projectionConfidence: number;
} {
  let projectedRating = 0;
  let playersLeaving = 0;
  let playersWithDevelopment = 0;

  for (const player of players) {
    if (player.contractEndYear <= currentYear) {
      playersLeaving++;
      continue;
    }

    playersWithDevelopment++;

    // Project development
    if (player.age < 25) {
      projectedRating +=
        player.overallRating +
        Math.min(3, (player.potential - player.overallRating) * 0.1);
    } else if (player.age < 30) {
      projectedRating += player.overallRating + 0.5;
    } else {
      projectedRating += Math.max(player.overallRating - 1, 40);
    }
  }

  const averageProjected = Math.round(projectedRating / Math.max(1, playersWithDevelopment));
  const confidence = Math.min(1, playersWithDevelopment / players.length);

  return {
    projectedOverallRating: averageProjected,
    playersLeaving,
    playersStayingWithDevelopment: playersWithDevelopment,
    projectionConfidence: Math.round(confidence * 100),
  };
}

/**
 * Calculate squad wage budget utilization
 */
export function calculateWageBudgetUtility(
  availableBudget: number,
  usedWages: number,
): {
  percentageUsed: number;
  remainingBudget: number;
  status: "overspent" | "critical" | "tight" | "comfortable" | "abundant";
  canSignPlayer: (playerWage: number) => boolean;
} {
  const percentageUsed = (usedWages / availableBudget) * 100;
  const remainingBudget = availableBudget - usedWages;

  let status: "overspent" | "critical" | "tight" | "comfortable" | "abundant";
  if (percentageUsed > 100) status = "overspent";
  else if (percentageUsed > 90) status = "critical";
  else if (percentageUsed > 75) status = "tight";
  else if (percentageUsed > 50) status = "comfortable";
  else status = "abundant";

  return {
    percentageUsed: Math.round(percentageUsed),
    remainingBudget,
    status,
    canSignPlayer: (playerWage: number) => playerWage <= remainingBudget,
  };
}

/**
 * Identify youth players ready for first team
 */
export interface YouthPlayerPromotion {
  playerId: number;
  name: string;
  age: number;
  overallRating: number;
  position: string;
  readinessScore: number; // 0-100
  recommendation: "ready" | "close" | "developing" | "too_young";
}

export function identifyYouthPromotionCandidates(
  youthPlayers: Array<{
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    overallRating: number;
    potential: number;
    position: string;
    isYouthPlayer: boolean;
  }>,
  seniorSquadAverage: number,
): YouthPlayerPromotion[] {
  return youthPlayers
    .filter((p) => p.isYouthPlayer)
    .map((p) => {
      // Calculate readiness score (0-100)
      const ageScore = Math.min((p.age / 23) * 100, 100);
      const ratingScore = (p.overallRating / seniorSquadAverage) * 100;
      const potentialScore = (p.potential / 95) * 100;
      const readinessScore = Math.round((ageScore * 0.3 + ratingScore * 0.4 + potentialScore * 0.3) / 100);

      let recommendation: "ready" | "close" | "developing" | "too_young";
      if (readinessScore >= 80) recommendation = "ready";
      else if (readinessScore >= 65) recommendation = "close";
      else if (readinessScore >= 50) recommendation = "developing";
      else recommendation = "too_young";

      return {
        playerId: p.id,
        name: `${p.firstName} ${p.lastName}`,
        age: p.age,
        overallRating: p.overallRating,
        position: p.position,
        readinessScore,
        recommendation,
      };
    })
    .sort((a, b) => b.readinessScore - a.readinessScore);
}

/**
 * Calculate club reputation effect on player development
 */
export function getClubReputationMultiplier(
  clubAverageRating: number,
  leagueAverageRating: number,
): number {
  // Top clubs develop players faster
  const reputationDifference = clubAverageRating - leagueAverageRating;
  return 1 + reputationDifference * 0.005; // +0.1% per rating point
}

/**
 * Simulate transfer market activity
 */
export interface TransferOffer {
  playerId: number;
  fromClubId: number;
  toClubId: number;
  bidAmount: number;
  salary: number;
  contractDuration: number; // years
  likelihoods: {
    playerAccepts: number;
    clubAccepts: number;
    dealCompletes: number;
  };
}

export function generateTransferOffers(
  existingPlayers: Array<{
    id: number;
    clubId: number;
    overallRating: number;
    age: number;
    estimatedValue: number;
    contractEndYear: number;
  }>,
  currentYear: number,
  marketActivity: "low" | "medium" | "high", // transfer window intensity
): TransferOffer[] {
  const baseActivityRate = {
    low: 0.1,
    medium: 0.25,
    high: 0.4,
  }[marketActivity];

  const offers: TransferOffer[] = [];

  for (const player of existingPlayers) {
    if (Math.random() > baseActivityRate) continue;

    // Higher rated players attract more offers
    const bidAmount = player.estimatedValue * (0.8 + Math.random() * 0.4);

    // Younger players get better salary offers (development potential)
    const salaryMultiplier = player.age < 25 ? 1.3 : player.age < 30 ? 1.0 : 0.7;
    const salary = (player.overallRating * 2000) * salaryMultiplier;

    // Calculate likelihood of player accepting
    let playerAcceptLikelihood = 0;
    if (player.contractEndYear - currentYear < 1) playerAcceptLikelihood = 0.8; // Wants out
    else if (player.age < 25) playerAcceptLikelihood = 0.6; // Young players ambitious
    else playerAcceptLikelihood = 0.3; // Settled players less likely

    // Club accepts based on price
    const clubAcceptLikelihood = Math.min(1, (bidAmount / player.estimatedValue) * 0.95);

    // Deal completes based on both parties
    const dealCompletion = Math.min(1, playerAcceptLikelihood * clubAcceptLikelihood);

    offers.push({
      playerId: player.id,
      fromClubId: player.clubId,
      toClubId: Math.floor(Math.random() * 100), // Random other club
      bidAmount: Math.round(bidAmount),
      salary: Math.round(salary),
      contractDuration: 3 + Math.floor(Math.random() * 3),
      likelihoods: {
        playerAccepts: Math.round(playerAcceptLikelihood * 100),
        clubAccepts: Math.round(clubAcceptLikelihood * 100),
        dealCompletes: Math.round(dealCompletion * 100),
      },
    });
  }

  return offers.sort((a, b) => b.likelihoods.dealCompletes - a.likelihoods.dealCompletes);
}
