/**
 * Career Mode Game Engine
 * Orchestrates all game systems and manages season progression
 */

import type { MatchResult, MatchSetup } from "./match-simulation";
import { simulateMatch } from "./match-simulation";

/**
 * Player in career mode with current stats
 */
export interface CareerPlayer {
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
  morale: number; // 0-100
  form: number; // 0-100
  contractEndYear: number;
  injuryWeeks: number;
  isYouthPlayer: boolean;
}

/**
 * Club in career mode
 */
export interface CareerClub {
  id: number;
  name: string;
  country: string;
  division: string;
  budget: number;
  weeklyWages: number;
  players: CareerPlayer[];
  manager: {
    name: string;
    experience: number;
    reputation: number;
  };
}

/**
 * League table entry
 */
export interface LeagueTableEntry {
  clubId: number;
  clubName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  average: number;
}

/**
 * Season statistics
 */
export interface SeasonStats {
  year: number;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  leaguePosition: number;
  pointsTotal: number;
  bestPlayer: { name: string; rating: number };
  topScorer: { name: string; goals: number };
  winStreak: number;
  currentForm: number; // Wins in last 5
}

/**
 * Fixture in the league
 */
export interface Fixture {
  id: number;
  matchday: number;
  homeClubId: number;
  homeClubName: string;
  awayClubId: number;
  awayClubName: string;
  played: boolean;
  result?: {
    homeScore: number;
    awayScore: number;
  };
  homeFormation?: string;
  awayFormation?: string;
}

/**
 * Career mode game state
 */
export interface CareerGameState {
  currentSeason: number;
  currentMatchday: number;
  playerClub: CareerClub;
  leagueTable: LeagueTableEntry[];
  fixtures: Fixture[];
  seasonStats: SeasonStats;
  squad: CareerPlayer[];
  recentMatches: MatchResult[];
  transferMarketOffers: any[];
  youth: {
    players: CareerPlayer[];
    facilities: number; // 1-5
  };
}

/**
 * Initialize a career mode game
 */
export function initializeCareer(club: CareerClub, startingSeason: number = 2024): CareerGameState {
  return {
    currentSeason: startingSeason,
    currentMatchday: 1,
    playerClub: club,
    leagueTable: [],
    fixtures: [],
    seasonStats: {
      year: startingSeason,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      leaguePosition: 0,
      pointsTotal: 0,
      bestPlayer: { name: "", rating: 0 },
      topScorer: { name: "", goals: 0 },
      winStreak: 0,
      currentForm: 0,
    },
    squad: club.players,
    recentMatches: [],
    transferMarketOffers: [],
    youth: {
      players: club.players.filter((p) => p.isYouthPlayer),
      facilities: 2,
    },
  };
}

/**
 * Simulate a single match from the fixture
 */
export function playMatch(
  gameState: CareerGameState,
  fixture: Fixture,
  isPlayerControl: boolean = true,
): { result: MatchResult; updatedGameState: CareerGameState } {
  const homeClub = fixture.homeClubId === gameState.playerClub.id ? gameState.playerClub : null;
  const awayClub = fixture.awayClubId === gameState.playerClub.id ? gameState.playerClub : null;

  if (!homeClub && !awayClub) {
    throw new Error("Player club not in fixture");
  }

  const isHome = fixture.homeClubId === gameState.playerClub.id;

  // Create match setup
  const matchSetup: MatchSetup = {
    homeTeam: {
      clubId: fixture.homeClubId,
      clubName: fixture.homeClubName,
      players: gameState.squad.map((p) => ({
        id: p.id,
        name: `${p.firstName} ${p.lastName}`,
        position: p.position,
        overallRating: p.overallRating,
      })),
      formation: {
        formationCode: "4-3-3",
        defenders: 4,
        midfielders: 3,
        forwards: 3,
        style: isHome ? "balanced" : "defensive",
        pressing: "medium",
        buildUp: "mixed",
      },
      morale: gameState.squad.reduce((acc, p) => acc + p.morale, 0) / gameState.squad.length,
    },
    awayTeam: {
      clubId: fixture.awayClubId,
      clubName: fixture.awayClubName,
      players: gameState.squad.map((p) => ({
        id: p.id,
        name: `${p.firstName} ${p.lastName}`,
        position: p.position,
        overallRating: p.overallRating,
      })),
      formation: {
        formationCode: "4-3-3",
        defenders: 4,
        midfielders: 3,
        forwards: 3,
        style: !isHome ? "balanced" : "defensive",
        pressing: "medium",
        buildUp: "mixed",
      },
      morale: gameState.squad.reduce((acc, p) => acc + p.morale, 0) / gameState.squad.length,
    },
    homeFieldAdvantage: 1.1,
    neutralVenue: false,
  };

  // Simulate the match
  const result = simulateMatch(matchSetup);

  // Update fixture
  fixture.played = true;
  fixture.result = {
    homeScore: result.homeScore,
    awayScore: result.awayScore,
  };

  // Update game state
  const updatedGameState = { ...gameState };

  // Update player form based on performance
  for (const player of updatedGameState.squad) {
    const playerEvents = result.events.filter((e) => e.playerId === player.id);
    let formChange = 0;

    for (const event of playerEvents) {
      formChange += event.impact;
    }

    player.form = Math.max(0, Math.min(100, player.form + formChange * 5));

    // Morale changes based on match result
    if (
      (isHome && result.homeScore > result.awayScore) ||
      (!isHome && result.awayScore > result.homeScore)
    ) {
      player.morale = Math.min(100, player.morale + 10);
    } else if (
      (isHome && result.homeScore < result.awayScore) ||
      (!isHome && result.awayScore < result.homeScore)
    ) {
      player.morale = Math.max(0, player.morale - 15);
    } else {
      player.morale = Math.max(0, player.morale - 5);
    }

    // Injury simulation
    if (Math.random() < 0.02) {
      player.injuryWeeks = Math.floor(Math.random() * 4) + 1;
    }
  }

  // Update season stats
  updatedGameState.seasonStats.matchesPlayed++;
  updatedGameState.seasonStats.goalsFor += isHome ? result.homeScore : result.awayScore;
  updatedGameState.seasonStats.goalsAgainst += isHome ? result.awayScore : result.homeScore;

  if ((isHome && result.homeScore > result.awayScore) || (!isHome && result.awayScore > result.homeScore)) {
    updatedGameState.seasonStats.wins++;
    updatedGameState.seasonStats.pointsTotal += 3;
  } else if (result.homeScore === result.awayScore) {
    updatedGameState.seasonStats.draws++;
    updatedGameState.seasonStats.pointsTotal += 1;
  } else {
    updatedGameState.seasonStats.losses++;
  }

  // Update recent matches
  updatedGameState.recentMatches.push(result);
  if (updatedGameState.recentMatches.length > 5) {
    updatedGameState.recentMatches.shift();
  }

  return {
    result,
    updatedGameState,
  };
}

/**
 * Advance to next matchday
 */
export function advanceMatchday(gameState: CareerGameState): CareerGameState {
  const nextGameState = { ...gameState };

  // Decrease injury weeks
  for (const player of nextGameState.squad) {
    if (player.injuryWeeks > 0) {
      player.injuryWeeks--;
    }

    // Slight form decay each week
    player.form = Math.max(0, player.form - 2);
  }

  nextGameState.currentMatchday++;

  return nextGameState;
}

/**
 * End season - trigger promotions, development, contracts
 */
export function endSeason(gameState: CareerGameState): CareerGameState {
  const nextSeason = { ...gameState };

  // Age players
  for (const player of nextSeason.squad) {
    player.age++;

    // Player development
    if (player.age < 25) {
      player.overallRating = Math.min(player.potential, player.overallRating + Math.floor(Math.random() * 3) + 1);
    } else if (player.age < 30) {
      player.overallRating = Math.min(player.potential, player.overallRating + Math.floor(Math.random() * 1));
    } else if (player.age > 32) {
      player.overallRating = Math.max(40, player.overallRating - Math.floor(Math.random() * 2) + 1);
    }

    // Contract management
    if (player.contractEndYear <= gameState.currentSeason) {
      // Player can leave
      if (Math.random() < 0.5) {
        // Remove from squad (simulating transfer out)
        nextSeason.squad = nextSeason.squad.filter((p) => p.id !== player.id);
      } else {
        // Offer new contract
        player.contractEndYear = gameState.currentSeason + 3;
      }
    }
  }

  // Reset season stats for new season
  nextSeason.currentSeason++;
  nextSeason.currentMatchday = 1;
  nextSeason.seasonStats = {
    year: nextSeason.currentSeason,
    matchesPlayed: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    leaguePosition: 0,
    pointsTotal: 0,
    bestPlayer: { name: "", rating: 0 },
    topScorer: { name: "", goals: 0 },
    winStreak: 0,
    currentForm: 0,
  };

  return nextSeason;
}

/**
 * Get manager rating based on performance
 */
export function calculateManagerRating(seasonStats: SeasonStats, expectedPosition: number = 5): number {
  let rating = 50; // Base rating

  // Points efficiency
  const maxPoints = seasonStats.matchesPlayed * 3;
  const efficiency = (seasonStats.pointsTotal / maxPoints) * 100;

  if (efficiency > 70) rating += 30;
  else if (efficiency > 60) rating += 20;
  else if (efficiency > 50) rating += 10;

  // League position (if known)
  if (seasonStats.leaguePosition < expectedPosition) {
    rating += 15;
  } else if (seasonStats.leaguePosition > expectedPosition + 3) {
    rating -= 15;
  }

  // Win rate
  const winRate = (seasonStats.wins / seasonStats.matchesPlayed) * 100;
  if (winRate > 50) rating += 10;
  else if (winRate < 30) rating -= 15;

  return Math.min(100, Math.max(0, rating));
}

/**
 * Calculate budget for next season based on performance
 */
export function calculateSeasonBudget(
  currentBudget: number,
  seasonStats: SeasonStats,
  leaguePosition: number,
  televisionDeal: number, // Annual TV revenue
): number {
  let budget = currentBudget;

  // TV revenue (fixed)
  budget += televisionDeal;

  // Prize money (based on league position)
  const prizeMoney = {
    1: 15000000,
    2: 12000000,
    3: 10000000,
    4: 8000000,
    5: 6000000,
    6: 5000000,
    7: 4000000,
    8: 3000000,
    9: 2500000,
    10: 2000000,
    11: 1500000,
    12: 1000000,
    13: 800000,
    14: 600000,
    15: 400000,
    16: 300000,
    17: 200000,
    18: 100000,
    19: 50000,
    20: 25000,
  } as Record<number, number>;

  budget += prizeMoney[leaguePosition] || 25000;

  // Sponsorship increase from good performance
  if (leaguePosition <= 4) {
    budget *= 1.1; // 10% increase
  } else if (leaguePosition <= 8) {
    budget *= 1.05; // 5% increase
  } else if (leaguePosition > 15) {
    budget *= 0.9; // 10% decrease
  }

  return Math.round(budget);
}
