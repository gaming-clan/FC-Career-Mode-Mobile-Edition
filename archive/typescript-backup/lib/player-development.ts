export interface PlayerStats {
  id: number;
  name: string;
  position: string;
  age: number;
  overall: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defense: number;
  physical: number;
  potential: number;
  experience: number;
  matchesPlayed: number;
  goalsScored: number;
  assists: number;
  form: number;
  morale: number;
}

export interface MatchPerformance {
  playerId: number;
  rating: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  keyPasses: number;
  tackles: number;
  interceptions: number;
  foulsCommitted: number;
}

export function calculatePlayerGrowth(
  player: PlayerStats,
  performance: MatchPerformance
): Partial<PlayerStats> {
  const baseGrowthRate = 0.5;
  const performanceMultiplier = Math.max(0, (performance.rating - 6) / 4);
  const growthFactor = baseGrowthRate * (1 + performanceMultiplier);

  const ageMultiplier = player.age < 25 ? 1.2 : player.age < 30 ? 1 : 0.8;
  const finalGrowth = growthFactor * ageMultiplier;

  const updates: Partial<PlayerStats> = {
    matchesPlayed: player.matchesPlayed + 1,
    experience: player.experience + finalGrowth * 10,
  };

  if (performance.minutesPlayed >= 45) {
    if (performance.goals > 0) {
      updates.shooting = Math.min(99, player.shooting + finalGrowth * 0.8);
      updates.goalsScored = player.goalsScored + performance.goals;
    }

    if (performance.assists > 0) {
      updates.passing = Math.min(99, player.passing + finalGrowth * 0.6);
      updates.assists = player.assists + performance.assists;
    }

    if (performance.tackles > 0 || performance.interceptions > 0) {
      updates.defense = Math.min(99, player.defense + finalGrowth * 0.5);
    }

    if (performance.keyPasses > 2) {
      updates.dribbling = Math.min(99, player.dribbling + finalGrowth * 0.4);
    }

    updates.pace = Math.min(99, player.pace + finalGrowth * 0.2);
    updates.physical = Math.min(99, player.physical + finalGrowth * 0.3);
  }

  updates.form = Math.min(10, Math.max(1, performance.rating));

  updates.overall = calculateOverall(
    updates.pace ?? player.pace,
    updates.shooting ?? player.shooting,
    updates.passing ?? player.passing,
    updates.dribbling ?? player.dribbling,
    updates.defense ?? player.defense,
    updates.physical ?? player.physical,
    player.position
  );

  return updates;
}

function calculateOverall(
  pace: number,
  shooting: number,
  passing: number,
  dribbling: number,
  defense: number,
  physical: number,
  position: string
): number {
  let weights: Record<string, number[]> = {
    ST: [0.1, 0.3, 0.15, 0.25, 0.1, 0.1],
    LW: [0.15, 0.2, 0.15, 0.3, 0.1, 0.1],
    RW: [0.15, 0.2, 0.15, 0.3, 0.1, 0.1],
    CAM: [0.1, 0.15, 0.25, 0.25, 0.1, 0.15],
    CM: [0.1, 0.1, 0.25, 0.15, 0.2, 0.2],
    CDM: [0.1, 0.05, 0.2, 0.1, 0.3, 0.25],
    LB: [0.15, 0.05, 0.15, 0.1, 0.35, 0.2],
    RB: [0.15, 0.05, 0.15, 0.1, 0.35, 0.2],
    CB: [0.05, 0.05, 0.1, 0.05, 0.4, 0.35],
    GK: [0.05, 0.05, 0.05, 0.05, 0.3, 0.45],
  };

  const w = weights[position] || [0.15, 0.15, 0.15, 0.15, 0.2, 0.2];
  const overall =
    pace * w[0] +
    shooting * w[1] +
    passing * w[2] +
    dribbling * w[3] +
    defense * w[4] +
    physical * w[5];

  return Math.round(overall);
}

export function updatePlayerForm(player: PlayerStats, performanceRating: number): number {
  const formChange = (performanceRating - 6.5) * 0.5;
  return Math.min(10, Math.max(1, player.form + formChange));
}

export function updatePlayerMorale(
  player: PlayerStats,
  matchResult: "win" | "draw" | "loss",
  performanceRating: number
): number {
  let moraleChange = 0;

  if (matchResult === "win") moraleChange += 1;
  if (matchResult === "loss") moraleChange -= 1.5;

  if (performanceRating >= 7.5) moraleChange += 0.5;
  if (performanceRating <= 5.5) moraleChange -= 0.5;

  return Math.min(10, Math.max(1, player.morale + moraleChange));
}

export function calculatePotentialGrowth(player: PlayerStats): number {
  const remainingPotential = player.potential - player.overall;
  const ageDecay = Math.max(0, 1 - (player.age - 18) / 15);
  return remainingPotential * ageDecay;
}

export function getPlayerDevelopmentStatus(player: PlayerStats): string {
  const growthRate = calculatePotentialGrowth(player);

  if (growthRate > 5) return "Rising Star";
  if (growthRate > 2) return "Developing";
  if (growthRate > 0) return "Plateau";
  return "Declining";
}

export function shouldOfferNewContract(player: PlayerStats, yearsInClub: number): boolean {
  const developmentStatus = getPlayerDevelopmentStatus(player);
  const isYoung = player.age < 25;
  const hasGoodForm = player.form >= 7;

  if (isYoung && (developmentStatus === "Rising Star" || developmentStatus === "Developing")) {
    return true;
  }

  if (yearsInClub >= 3 && hasGoodForm) {
    return true;
  }

  return false;
}
