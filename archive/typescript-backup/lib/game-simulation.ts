export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  overallRating: number;
  form: number;
  age: number;
  potential: number;
  contractEndYear: number;
}

export interface Club {
  id: number;
  name: string;
  overallRating: number;
}

export interface MatchResult {
  homeGoals: number;
  awayGoals: number;
  events: MatchEvent[];
  homePlayerRatings: Record<number, number>;
  awayPlayerRatings: Record<number, number>;
}

export interface MatchEvent {
  minute: number;
  type: "goal" | "assist" | "yellow_card" | "red_card" | "substitution" | "injury";
  playerId: number;
  assistPlayerId?: number;
  description: string;
}

export function simulateMatch(
  homeClub: Club,
  awayClub: Club,
  homeSquad: Player[],
  awaySquad: Player[]
): MatchResult {
  const homeStrength = calculateTeamStrength(homeSquad);
  const awayStrength = calculateTeamStrength(awaySquad);
  const homeAdvantage = 1.05;
  const adjustedHomeStrength = homeStrength * homeAdvantage;
  const totalStrength = adjustedHomeStrength + awayStrength;

  const homeExpectedGoals = (adjustedHomeStrength / totalStrength) * 2.5;
  const awayExpectedGoals = (awayStrength / totalStrength) * 2.5;

  const homeGoals = Math.max(0, Math.round(homeExpectedGoals + (Math.random() - 0.5) * 2));
  const awayGoals = Math.max(0, Math.round(awayExpectedGoals + (Math.random() - 0.5) * 2));

  const events: MatchEvent[] = [];

  for (let i = 0; i < homeGoals; i++) {
    const minute = Math.floor(Math.random() * 85) + 5;
    const scorer = homeSquad[Math.floor(Math.random() * homeSquad.length)];
    const assister = homeSquad[Math.floor(Math.random() * homeSquad.length)];
    events.push({
      minute,
      type: "goal",
      playerId: scorer.id,
      assistPlayerId: assister.id !== scorer.id ? assister.id : undefined,
      description: `${scorer.firstName} ${scorer.lastName} scores!`,
    });
  }

  for (let i = 0; i < awayGoals; i++) {
    const minute = Math.floor(Math.random() * 85) + 5;
    const scorer = awaySquad[Math.floor(Math.random() * awaySquad.length)];
    const assister = awaySquad[Math.floor(Math.random() * awaySquad.length)];
    events.push({
      minute,
      type: "goal",
      playerId: scorer.id,
      assistPlayerId: assister.id !== scorer.id ? assister.id : undefined,
      description: `${scorer.firstName} ${scorer.lastName} scores!`,
    });
  }

  events.sort((a, b) => a.minute - b.minute);

  const homePlayerRatings = generatePlayerRatings(homeSquad, homeGoals, awayGoals);
  const awayPlayerRatings = generatePlayerRatings(awaySquad, awayGoals, homeGoals);

  return {
    homeGoals,
    awayGoals,
    events,
    homePlayerRatings,
    awayPlayerRatings,
  };
}

function calculateTeamStrength(squad: Player[]): number {
  if (squad.length === 0) return 50;

  let totalStrength = 0;
  const positionWeights: Record<string, number> = {
    GK: 0.8,
    CB: 1.2,
    LB: 1.0,
    RB: 1.0,
    CM: 1.3,
    CAM: 1.2,
    CDM: 1.2,
    CF: 1.4,
    ST: 1.4,
    LW: 1.2,
    RW: 1.2,
  };

  squad.forEach((player) => {
    const weight = positionWeights[player.position] || 1.0;
    const formMultiplier = 0.5 + (player.form / 100) * 0.5;
    totalStrength += player.overallRating * weight * formMultiplier;
  });

  return totalStrength / squad.length;
}

function generatePlayerRatings(
  squad: Player[],
  goalsFor: number,
  goalsAgainst: number
): Record<number, number> {
  const ratings: Record<number, number> = {};

  squad.forEach((player) => {
    let rating = (player.overallRating / 99) * 10;

    if (goalsFor > goalsAgainst) {
      rating += 0.5;
    } else if (goalsFor < goalsAgainst) {
      rating -= 0.5;
    }

    rating += (Math.random() - 0.5) * 2;
    rating = Math.max(1, Math.min(10, rating));
    ratings[player.id] = Math.round(rating * 10) / 10;
  });

  return ratings;
}

export function calculatePlayerMarketValue(player: Player): number {
  const ratingValue = player.overallRating * 50000;

  let ageFactor = 1.0;
  if (player.age < 23) {
    ageFactor = 0.5 + (player.age - 18) * 0.1;
  } else if (player.age > 32) {
    ageFactor = 1.0 - (player.age - 32) * 0.1;
  }

  const potentialFactor = 1 + (player.potential - player.overallRating) / 100;
  const yearsRemaining = Math.max(0, player.contractEndYear - new Date().getFullYear());
  const contractFactor = 0.5 + Math.min(yearsRemaining / 5, 1.0) * 0.5;

  const marketValue = ratingValue * ageFactor * potentialFactor * contractFactor;
  return Math.round(marketValue / 10000) * 10000;
}

export function calculateAttributeImprovement(
  currentRating: number,
  trainingQuality: number,
  playerAge: number
): number {
  const ageFactor = playerAge < 23 ? 1.2 : playerAge < 28 ? 1.0 : 0.8;
  const improvementFactor = 1 - currentRating / 99;
  const qualityMultiplier = trainingQuality / 3;
  const improvement = 1.0 * ageFactor * improvementFactor * qualityMultiplier;
  return Math.round(improvement * 10) / 10;
}
