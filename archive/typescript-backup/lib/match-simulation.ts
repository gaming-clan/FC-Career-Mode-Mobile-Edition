/**
 * Match Simulation and Game Mechanics
 * Handles match events, player performance, and tactical systems
 */

import type { PlayerStats } from "./player-stats";

/**
 * Match event type
 */
export type MatchEventType = "goal" | "assist" | "tackle" | "pass" | "miss" | "save" | "injury" | "yellow" | "red" | "substitution";

/**
 * Match event in a game
 */
export interface MatchEvent {
  minute: number;
  type: MatchEventType;
  playerId: number;
  playerName: string;
  position: string;
  description: string;
  impact: number; // -5 to +5
}

/**
 * Match statistics
 */
export interface MatchStatistics {
  team: "home" | "away";
  possession: number;
  shots: number;
  shotsOnTarget: number;
  passes: number;
  passAccuracy: number;
  tackles: number;
  interceptions: number;
  fouls: number;
  cards: {
    yellow: number;
    red: number;
  };
  injuries: number;
}

/**
 * Team formation configuration
 */
export interface Formation {
  formationCode: string; // "4-3-3", "4-2-3-1", etc.
  defenders: number;
  midfielders: number;
  forwards: number;
  style: "defensive" | "balanced" | "attacking";
  pressing: "low" | "medium" | "high";
  buildUp: "short" | "mixed" | "long";
}

/**
 * Match setup with both teams
 */
export interface MatchSetup {
  homeTeam: {
    clubId: number;
    clubName: string;
    players: Array<{ id: number; name: string; position: string; overallRating: number }>;
    formation: Formation;
    morale: number; // 0-100
  };
  awayTeam: {
    clubId: number;
    clubName: string;
    players: Array<{ id: number; name: string; position: string; overallRating: number }>;
    formation: Formation;
    morale: number; // 0-100
  };
  homeFieldAdvantage: number; // 1-1.2 multiplier
  neutralVenue: boolean;
}

/**
 * Match result
 */
export interface MatchResult {
  homeScore: number;
  awayScore: number;
  events: MatchEvent[];
  stats: {
    home: MatchStatistics;
    away: MatchStatistics;
  };
  manOfMatch: {
    playerId: number;
    name: string;
    team: "home" | "away";
    rating: number; // 0-10
  };
  duration: "ft" | "aet" | "pen"; // Full time, After extra time, Penalties
}

/**
 * Calculate expected goals (xG) for a team
 */
export function calculateExpectedGoals(
  players: Array<{
    id: number;
    position: string;
    overallRating: number;
    pace?: number;
    shooting?: number;
    dribbling?: number;
  }>,
  formation: Formation,
  possession: number,
): number {
  let xG = 0;

  // Count attacking players
  const forwards = players.filter((p) => p.position.match(/[ST]|W/));
  const midfielders = players.filter((p) => p.position.match(/M|AM/));

  // Forwards generate most xG
  for (const player of forwards) {
    const shooting = player.shooting ?? (player.overallRating * 0.8);
    const baseChance = (shooting / 100) * 0.3;
    const adjustedChance = baseChance * (possession / 50); // More possession = more chances
    xG += adjustedChance;
  }

  // Midfielders generate some xG
  for (const midfielder of midfielders) {
    const shooting = midfielder.shooting ?? (midfielder.overallRating * 0.6);
    const baseChance = (shooting / 100) * 0.1;
    const adjustedChance = baseChance * (possession / 50);
    xG += adjustedChance;
  }

  // Formation style affects xG
  if (formation.style === "attacking") xG *= 1.3;
  else if (formation.style === "defensive") xG *= 0.6;

  return Math.round(xG * 100) / 100;
}

/**
 * Generate a realistic match simulation
 */
export function simulateMatch(matchSetup: MatchSetup): MatchResult {
  // Calculate team strengths
  const homeStrength = matchSetup.homeTeam.players.reduce((acc, p) => acc + p.overallRating, 0) / matchSetup.homeTeam.players.length;
  const awayStrength = matchSetup.awayTeam.players.reduce((acc, p) => acc + p.overallRating, 0) / matchSetup.awayTeam.players.length;

  // Calculate possession
  let homePossession = (homeStrength / (homeStrength + awayStrength)) * 100;

  // Formation style affects possession
  if (matchSetup.homeTeam.formation.style === "attacking") homePossession += 10;
  else if (matchSetup.homeTeam.formation.style === "defensive") homePossession -= 10;

  if (matchSetup.awayTeam.formation.style === "attacking") homePossession -= 10;
  else if (matchSetup.awayTeam.formation.style === "defensive") homePossession += 10;

  homePossession = Math.min(100, Math.max(20, homePossession));
  const awayPossession = 100 - homePossession;

  // Calculate expected goals
  const homeXG = calculateExpectedGoals(matchSetup.homeTeam.players, matchSetup.homeTeam.formation, homePossession);
  const awayXG = calculateExpectedGoals(matchSetup.awayTeam.players, matchSetup.awayTeam.formation, awayPossession);

  // Convert xG to actual goals (plus randomness)
  const homeScore = Math.round(homeXG + (Math.random() > 0.5 ? 1 : 0));
  const awayScore = Math.round(awayXG + (Math.random() > 0.5 ? 1 : 0));

  // Generate match events
  const events: MatchEvent[] = [];

  // Goal events
  for (let i = 0; i < homeScore; i++) {
    const scorer = matchSetup.homeTeam.players[Math.floor(Math.random() * matchSetup.homeTeam.players.length)];
    events.push({
      minute: Math.floor(15 + Math.random() * 75),
      type: "goal",
      playerId: scorer.id,
      playerName: scorer.name,
      position: scorer.position,
      description: `${scorer.name} scores!`,
      impact: 5,
    });
  }

  for (let i = 0; i < awayScore; i++) {
    const scorer = matchSetup.awayTeam.players[Math.floor(Math.random() * matchSetup.awayTeam.players.length)];
    events.push({
      minute: Math.floor(15 + Math.random() * 75),
      type: "goal",
      playerId: scorer.id,
      playerName: scorer.name,
      position: scorer.position,
      description: `${scorer.name} scores!`,
      impact: 5,
    });
  }

  // Yellow cards (random)
  const yellowCards = Math.floor(Math.random() * 4) + 2;
  for (let i = 0; i < yellowCards; i++) {
    const allPlayers = [...matchSetup.homeTeam.players, ...matchSetup.awayTeam.players];
    const player = allPlayers[Math.floor(Math.random() * allPlayers.length)];
    events.push({
      minute: Math.floor(Math.random() * 90),
      type: "yellow",
      playerId: player.id,
      playerName: player.name,
      position: player.position,
      description: `${player.name} receives yellow card`,
      impact: -1,
    });
  }

  // Red cards (rare)
  if (Math.random() < 0.15) {
    const allPlayers = [...matchSetup.homeTeam.players, ...matchSetup.awayTeam.players];
    const player = allPlayers[Math.floor(Math.random() * allPlayers.length)];
    events.push({
      minute: Math.floor(Math.random() * 90),
      type: "red",
      playerId: player.id,
      playerName: player.name,
      position: player.position,
      description: `${player.name} receives red card`,
      impact: -3,
    });
  }

  // Injuries (low chance)
  if (Math.random() < 0.2) {
    const allPlayers = [...matchSetup.homeTeam.players, ...matchSetup.awayTeam.players];
    const player = allPlayers[Math.floor(Math.random() * allPlayers.length)];
    events.push({
      minute: Math.floor(Math.random() * 90),
      type: "injury",
      playerId: player.id,
      playerName: player.name,
      position: player.position,
      description: `${player.name} is injured`,
      impact: -2,
    });
  }

  // Sort events by minute
  events.sort((a, b) => a.minute - b.minute);

  // Man of the Match
  const allPlayers = [...matchSetup.homeTeam.players, ...matchSetup.awayTeam.players];
  const manOfMatch = allPlayers[Math.floor(Math.random() * allPlayers.length)];
  const team = matchSetup.homeTeam.players.some((p) => p.id === manOfMatch.id) ? "home" : "away";

  // Match statistics
  const homeStats: MatchStatistics = {
    team: "home",
    possession: homePossession,
    shots: Math.round(homeXG * 2.5 + Math.random() * 4),
    shotsOnTarget: Math.round(homeXG * 1.5 + Math.random() * 2),
    passes: Math.round((homePossession / 100) * 600 + Math.random() * 100),
    passAccuracy: 75 + Math.random() * 15,
    tackles: 15 + Math.floor(Math.random() * 8),
    interceptions: 5 + Math.floor(Math.random() * 6),
    fouls: 8 + Math.floor(Math.random() * 6),
    cards: {
      yellow: Math.floor(Math.random() * 3) + 1,
      red: Math.random() < 0.08 ? 1 : 0,
    },
    injuries: Math.random() < 0.2 ? 1 : 0,
  };

  const awayStats: MatchStatistics = {
    team: "away",
    possession: awayPossession,
    shots: Math.round(awayXG * 2.5 + Math.random() * 4),
    shotsOnTarget: Math.round(awayXG * 1.5 + Math.random() * 2),
    passes: Math.round((awayPossession / 100) * 600 + Math.random() * 100),
    passAccuracy: 75 + Math.random() * 15,
    tackles: 15 + Math.floor(Math.random() * 8),
    interceptions: 5 + Math.floor(Math.random() * 6),
    fouls: 8 + Math.floor(Math.random() * 6),
    cards: {
      yellow: Math.floor(Math.random() * 3) + 1,
      red: Math.random() < 0.08 ? 1 : 0,
    },
    injuries: Math.random() < 0.2 ? 1 : 0,
  };

  return {
    homeScore,
    awayScore,
    events,
    stats: {
      home: homeStats,
      away: awayStats,
    },
    manOfMatch: {
      playerId: manOfMatch.id,
      name: manOfMatch.name,
      team,
      rating: 7.5 + Math.random() * 2.5,
    },
    duration: "ft",
  };
}

/**
 * Calculate league table points from match result
 */
export function calculatePointsAwarded(homeScore: number, awayScore: number): { homePoints: number; awayPoints: number } {
  if (homeScore > awayScore) {
    return { homePoints: 3, awayPoints: 0 };
  } else if (awayScore > homeScore) {
    return { homePoints: 0, awayPoints: 3 };
  } else {
    return { homePoints: 1, awayPoints: 1 };
  }
}

/**
 * Calculate morale impact from match result
 */
export function calculateMoraleImpact(
  isHome: boolean,
  yourScore: number,
  opponentScore: number,
  yourRating: number,
  opponentRating: number,
): number {
  // Base impact from result
  let impact = 0;

  if (yourScore > opponentScore) {
    impact = 15; // Win
  } else if (yourScore === opponentScore) {
    impact = 5; // Draw
  } else {
    impact = -15; // Loss
  }

  // Adjust for expectations (upset bonus/upset penalty)
  const ratingDifference = yourRating - opponentRating;
  if (yourScore > opponentScore && ratingDifference < -5) {
    impact += 10; // Major upset win
  } else if (yourScore < opponentScore && ratingDifference > 5) {
    impact -= 15; // Surprising loss against weaker team
  }

  // Home advantage
  if (isHome && yourScore > opponentScore) {
    impact += 5;
  }

  return Math.max(-30, Math.min(30, impact));
}

/**
 * Generate tactical recommendations based on player ratings
 */
export function recommendFormation(
  players: Array<{
    position: string;
    overallRating: number;
  }>,
  playStyle: "defensive" | "balanced" | "attacking" = "balanced",
): Formation & { rationale: string } {
  const positionCounts = new Map<string, number>();

  for (const player of players) {
    const category = player.position.substring(0, 1);
    positionCounts.set(category, (positionCounts.get(category) ?? 0) + 1);
  }

  const defenders = positionCounts.get("D") ?? 0;
  const midfielders = positionCounts.get("M") ?? 0;
  const forwards = positionCounts.get("F") ?? 0;

  let formations: (Formation & { rationale: string })[] = [
    {
      formationCode: "4-3-3",
      defenders: 4,
      midfielders: 3,
      forwards: 3,
      style: "balanced",
      pressing: "medium",
      buildUp: "mixed",
      rationale: "Balanced formation - versatile and reliable",
    },
    {
      formationCode: "4-2-3-1",
      defenders: 4,
      midfielders: 5,
      forwards: 1,
      style: "defensive",
      pressing: "low",
      buildUp: "short",
      rationale: "Defensive formation - solid protection",
    },
    {
      formationCode: "3-5-2",
      defenders: 3,
      midfielders: 5,
      forwards: 2,
      style: "balanced",
      pressing: "medium",
      buildUp: "mixed",
      rationale: "Wing-back formation - width and flexibility",
    },
    {
      formationCode: "4-1-4-1",
      defenders: 4,
      midfielders: 5,
      forwards: 1,
      style: "attacking",
      pressing: "high",
      buildUp: "short",
      rationale: "Advanced formation - creative midfield",
    },
  ];

  if (playStyle === "defensive") {
    formations = formations.filter((f) => f.style === "defensive" || f.style === "balanced");
  } else if (playStyle === "attacking") {
    formations = formations.filter((f) => f.style === "attacking" || f.style === "balanced");
  }

  return formations[Math.floor(Math.random() * formations.length)];
}
