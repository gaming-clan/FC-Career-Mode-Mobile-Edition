/**
 * Unified Game Engine
 * Consolidates match simulation, season progression, and career management
 * This replaces the fragmented match-integration.ts and season-progression.ts
 */

import { simulateMatch as advancedSimulateMatch, type MatchSetup, type MatchResult } from "./match-simulation";
import { playMatch, advanceMatchday, endSeason, type CareerGameState } from "./career-engine";

/**
 * Enhanced match setup with real squad data
 */
export interface UnifiedMatchSetup {
  homeTeam: {
    clubId: number;
    clubName: string;
    squad: Array<{
      id: number;
      name: string;
      position: string;
      overallRating: number;
      pace?: number;
      shooting?: number;
      passing?: number;
      dribbling?: number;
      defense?: number;
      physical?: number;
      form: number;
      morale: number;
    }>;
    formation: {
      code: string;
      defenders: number;
      midfielders: number;
      forwards: number;
      style: "defensive" | "balanced" | "attacking";
      pressing: "low" | "medium" | "high";
      buildUp: "short" | "mixed" | "long";
    };
    morale: number;
  };
  awayTeam: {
    clubId: number;
    clubName: string;
    squad: Array<{
      id: number;
      name: string;
      position: string;
      overallRating: number;
      pace?: number;
      shooting?: number;
      passing?: number;
      dribbling?: number;
      defense?: number;
      physical?: number;
      form: number;
      morale: number;
    }>;
    formation: {
      code: string;
      defenders: number;
      midfielders: number;
      forwards: number;
      style: "defensive" | "balanced" | "attacking";
      pressing: "low" | "medium" | "high";
      buildUp: "short" | "mixed" | "long";
    };
    morale: number;
  };
  homeFieldAdvantage?: number;
  neutralVenue?: boolean;
}

/**
 * Enhanced match result with detailed analytics
 */
export interface UnifiedMatchResult extends MatchResult {
  homeTeamId: number;
  awayTeamId: number;
  homeTeamName: string;
  awayTeamName: string;
  homeFormation: string;
  awayFormation: string;
  matchDate: Date;
  attendanceEstimate: number;
}

/**
 * Simulate a match using the advanced engine with real squad data
 */
export function simulateUnifiedMatch(setup: UnifiedMatchSetup): UnifiedMatchResult {
  // Convert unified setup to advanced match setup format
  const advancedSetup: MatchSetup = {
    homeTeam: {
      clubId: setup.homeTeam.clubId,
      clubName: setup.homeTeam.clubName,
      players: setup.homeTeam.squad.map((p) => ({
        id: p.id,
        name: p.name,
        position: p.position,
        overallRating: p.overallRating,
        pace: p.pace,
        shooting: p.shooting,
        passing: p.passing,
        dribbling: p.dribbling,
        defense: p.defense,
        physical: p.physical,
      })),
      formation: setup.homeTeam.formation,
      morale: setup.homeTeam.morale,
    },
    awayTeam: {
      clubId: setup.awayTeam.clubId,
      clubName: setup.awayTeam.clubName,
      players: setup.awayTeam.squad.map((p) => ({
        id: p.id,
        name: p.name,
        position: p.position,
        overallRating: p.overallRating,
        pace: p.pace,
        shooting: p.shooting,
        passing: p.passing,
        dribbling: p.dribbling,
        defense: p.defense,
        physical: p.physical,
      })),
      formation: setup.awayTeam.formation,
      morale: setup.awayTeam.morale,
    },
    homeFieldAdvantage: setup.homeFieldAdvantage ?? 1.1,
    neutralVenue: setup.neutralVenue ?? false,
  };

  // Run advanced simulation
  const result = advancedSimulateMatch(advancedSetup);

  // Enhance with additional data
  const attendanceEstimate = Math.round(
    30000 + Math.random() * 20000 * (result.stats.home.possession / 100)
  );

  return {
    ...result,
    homeTeamId: setup.homeTeam.clubId,
    awayTeamId: setup.awayTeam.clubId,
    homeTeamName: setup.homeTeam.clubName,
    awayTeamName: setup.awayTeam.clubName,
    homeFormation: setup.homeTeam.formation.formationCode,
    awayFormation: setup.awayTeam.formation.formationCode,
    matchDate: new Date(),
    attendanceEstimate,
  };
}

/**
 * Play a match and update career state
 * This is the main entry point for match simulation in the career
 */
export function playCareerMatch(
  gameState: CareerGameState,
  fixtureId: number,
  homeSquad: Array<{
    id: number;
    firstName: string;
    lastName: string;
    position: string;
    overallRating: number;
    pace?: number;
    shooting?: number;
    passing?: number;
    dribbling?: number;
    defense?: number;
    physical?: number;
    form: number;
    morale: number;
  }>,
  awaySquad: Array<{
    id: number;
    firstName: string;
    lastName: string;
    position: string;
    overallRating: number;
    pace?: number;
    shooting?: number;
    passing?: number;
    dribbling?: number;
    defense?: number;
    physical?: number;
    form: number;
    morale: number;
  }>,
  homeFormation: { code: string; style: "defensive" | "balanced" | "attacking"; defenders: number; midfielders: number; forwards: number; pressing: "low" | "medium" | "high"; buildUp: "short" | "mixed" | "long" },
  awayFormation: { code: string; style: "defensive" | "balanced" | "attacking"; defenders: number; midfielders: number; forwards: number; pressing: "low" | "medium" | "high"; buildUp: "short" | "mixed" | "long" },
  isHome: boolean
): { result: UnifiedMatchResult; updatedGameState: CareerGameState } {
  // Build unified match setup
  const setup: UnifiedMatchSetup = {
    homeTeam: {
      clubId: isHome ? gameState.playerClub.id : 0,
      clubName: isHome ? gameState.playerClub.name : "Away Team",
      squad: homeSquad.map((p) => ({
        id: p.id,
        name: `${p.firstName} ${p.lastName}`,
        position: p.position,
        overallRating: p.overallRating,
        pace: p.pace,
        shooting: p.shooting,
        passing: p.passing,
        dribbling: p.dribbling,
        defense: p.defense,
        physical: p.physical,
        form: p.form,
        morale: p.morale,
      })),
      formation: homeFormation,
      morale: homeSquad.reduce((acc, p) => acc + p.morale, 0) / homeSquad.length,
    },
    awayTeam: {
      clubId: !isHome ? gameState.playerClub.id : 0,
      clubName: !isHome ? gameState.playerClub.name : "Home Team",
      squad: awaySquad.map((p) => ({
        id: p.id,
        name: `${p.firstName} ${p.lastName}`,
        position: p.position,
        overallRating: p.overallRating,
        pace: p.pace,
        shooting: p.shooting,
        passing: p.passing,
        dribbling: p.dribbling,
        defense: p.defense,
        physical: p.physical,
        form: p.form,
        morale: p.morale,
      })),
      formation: awayFormation,
      morale: awaySquad.reduce((acc, p) => acc + p.morale, 0) / awaySquad.length,
    },
    homeFieldAdvantage: isHome ? 1.1 : 1.0,
    neutralVenue: false,
  };

  // Simulate match
  const result = simulateUnifiedMatch(setup);

  // Update game state using the career engine
  const fixture = gameState.fixtures.find((f) => f.id === fixtureId);
  if (!fixture) {
    throw new Error(`Fixture ${fixtureId} not found`);
  }

  // Update fixture result
  fixture.played = true;
  fixture.result = {
    homeScore: result.homeScore,
    awayScore: result.awayScore,
  };

  // Update player stats based on match events
  const updatedGameState = { ...gameState };
  for (const player of updatedGameState.squad) {
    const playerEvents = result.events.filter((e) => e.playerId === player.id);
    let formChange = 0;

    for (const event of playerEvents) {
      formChange += event.impact;
    }

    player.form = Math.max(0, Math.min(100, player.form + formChange * 5));

    // Morale changes based on match result
    const isPlayerHome = isHome;
    if (
      (isPlayerHome && result.homeScore > result.awayScore) ||
      (!isPlayerHome && result.awayScore > result.homeScore)
    ) {
      player.morale = Math.min(100, player.morale + 10);
    } else if (
      (isPlayerHome && result.homeScore < result.awayScore) ||
      (!isPlayerHome && result.awayScore < result.homeScore)
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

  if (
    (isHome && result.homeScore > result.awayScore) ||
    (!isHome && result.awayScore > result.homeScore)
  ) {
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
 * Advance to the next matchday
 */
export function advanceCareerMatchday(gameState: CareerGameState): CareerGameState {
  return advanceMatchday(gameState);
}

/**
 * End the season and prepare for the next one
 */
export function endCareerSeason(gameState: CareerGameState): CareerGameState {
  return endSeason(gameState);
}

/**
 * Export the original career engine functions for backward compatibility
 */
export { playMatch, advanceMatchday, endSeason, initializeCareer, calculateManagerRating, calculateSeasonBudget } from "./career-engine";
export type { CareerGameState, CareerPlayer, CareerClub } from "./career-engine";
