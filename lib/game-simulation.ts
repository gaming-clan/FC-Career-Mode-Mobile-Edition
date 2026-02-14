import { Player, Club } from "./db";

export interface MatchResult {
  homeGoals: number;
  awayGoals: number;
  events: MatchEvent[];
  homePlayerRatings: Record<string, number>;
  awayPlayerRatings: Record<string, number>;
}

export interface MatchEvent {
  minute: number;
  type: "goal" | "assist" | "yellow_card" | "red_card" | "substitution" | "injury";
  playerId: string;
  assistPlayerId?: string;
  description: string;
}

export function simulateMatch(
  homeClub: Club,
  awayClub: Club,
  homeSquad: Player[],
  awaySquad: Player[]
): MatchResult {
  // Calculate team strengths based on player ratings
  const homeStrength = calculateTeamStrength(homeSquad);
  const awayStrength = calculateTeamStrength(awaySquad);
  
  // Home advantage factor (approx 5%)
  const homeAdvantage = 1.05;
  const adjustedHomeStrength = homeStrength * homeAdvantage;
  
  // Total strength for probability distribution
  const totalStrength = adjustedHomeStrength + awayStrength;
  
  // Base goals (average goals in a football match is around 2.5)
  const homeExpectedGoals = (adjustedHomeStrength / totalStrength) * 2.5;
  const awayExpectedGoals = (awayStrength / totalStrength) * 2.5;
  
  // Apply Poisson-like variation
  const homeGoals = Math.max(0, Math.round(homeExpectedGoals + (Math.random() - 0.5) * 3));
  const awayGoals = Math.max(0, Math.round(awayExpectedGoals + (Math.random() - 0.5) * 3));
  
  const events: MatchEvent[] = [];
  
  // Generate goal events for home team
  for (let i = 0; i < homeGoals; i++) {
    const minute = Math.floor(Math.random() * 90) + 1;
    const scorer = homeSquad[Math.floor(Math.random() * homeSquad.length)];
    const assister = homeSquad[Math.floor(Math.random() * homeSquad.length)];
    
    events.push({
      minute,
      type: "goal",
      playerId: scorer.id,
      assistPlayerId: assister.id !== scorer.id ? assister.id : undefined,
      description: `${scorer.name} SCORES for ${homeClub.name}!`,
    });
  }
  
  // Generate goal events for away team
  for (let i = 0; i < awayGoals; i++) {
    const minute = Math.floor(Math.random() * 90) + 1;
    const scorer = awaySquad[Math.floor(Math.random() * awaySquad.length)];
    const assister = awaySquad[Math.floor(Math.random() * awaySquad.length)];
    
    events.push({
      minute,
      type: "goal",
      playerId: scorer.id,
      assistPlayerId: assister.id !== scorer.id ? assister.id : undefined,
      description: `${scorer.name} SCORES for ${awayClub.name}!`,
    });
  }
  
  // Sort events by minute
  events.sort((a, b) => a.minute - b.minute);
  
  // Generate player ratings based on performance and outcome
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
  
  const totalRating = squad.reduce((sum, p) => sum + p.rating, 0);
  return totalRating / squad.length;
}

function generatePlayerRatings(
  squad: Player[],
  goalsFor: number,
  goalsAgainst: number
): Record<string, number> {
  const ratings: Record<string, number> = {};
  
  const winBonus = goalsFor > goalsAgainst ? 1.0 : goalsFor === goalsAgainst ? 0.0 : -0.5;
  
  squad.forEach((player) => {
    // Base rating derived from their overall rating, centered around 6.5
    let rating = 6.5 + (player.rating - 75) / 10 + winBonus;
    
    // Add some randomness
    rating += (Math.random() - 0.5) * 2;
    
    // Clamp between 4.0 and 10.0
    rating = Math.max(4.0, Math.min(10.0, rating));
    ratings[player.id] = Math.round(rating * 10) / 10;
  });
  
  return ratings;
}

export function calculatePlayerMarketValue(player: Player): number {
  const ratingValue = player.rating * 500000;
  
  let ageFactor = 1.0;
  if (player.age < 23) {
    ageFactor = 1.2 + (23 - player.age) * 0.1;
  } else if (player.age > 30) {
    ageFactor = 1.0 - (player.age - 30) * 0.1;
  }
  
  const potentialFactor = 1 + (player.potential - player.rating) / 50;
  
  const marketValue = ratingValue * ageFactor * potentialFactor;
  return Math.round(marketValue / 100000) * 100000;
}
