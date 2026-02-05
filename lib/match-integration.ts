import { updateStandings } from "./season-progression";
import type { LeagueStanding } from "./season-progression";

export interface MatchSimulationInput {
  homeTeamId: number;
  awayTeamId: number;
  homeTeamName: string;
  awayTeamName: string;
  homeFormation: string;
  awayFormation: string;
  homeSquadRating: number;
  awaySquadRating: number;
  homePlayerCount: number;
  awayPlayerCount: number;
}

export interface MatchEvent {
  minute: number;
  type: "goal" | "yellow_card" | "red_card" | "substitution" | "injury";
  team: "home" | "away";
  player: string;
  description: string;
}

export interface MatchResult {
  homeGoals: number;
  awayGoals: number;
  events: MatchEvent[];
  homeRating: number;
  awayRating: number;
  possession: number;
  shots: number;
  shotsOnTarget: number;
}

export function calculateTeamStrength(
  squadRating: number,
  playerCount: number,
  formation: string
): number {
  const baseStrength = squadRating * (playerCount / 11);
  const formationBonus = getFormationBonus(formation);
  return baseStrength * (1 + formationBonus);
}

function getFormationBonus(formation: string): number {
  const bonuses: Record<string, number> = {
    "4-3-3": 0.05,
    "4-2-3-1": 0.08,
    "3-5-2": 0.03,
    "5-3-2": 0.02,
  };
  return bonuses[formation] || 0;
}

export function simulateMatch(input: MatchSimulationInput): MatchResult {
  const homeStrength = calculateTeamStrength(
    input.homeSquadRating,
    input.homePlayerCount,
    input.homeFormation
  );
  const awayStrength = calculateTeamStrength(
    input.awaySquadRating,
    input.awayPlayerCount,
    input.awayFormation
  );

  const totalStrength = homeStrength + awayStrength;
  const homeWinProbability = homeStrength / totalStrength;

  const events: MatchEvent[] = [];
  let homeGoals = 0;
  let awayGoals = 0;

  for (let minute = 15; minute <= 90; minute += Math.random() * 20 + 5) {
    const random = Math.random();

    if (random < 0.15) {
      const isHomeGoal = Math.random() < homeWinProbability;
      if (isHomeGoal) {
        homeGoals++;
        events.push({
          minute: Math.floor(minute),
          type: "goal",
          team: "home",
          player: `Home Player ${Math.floor(Math.random() * 11) + 1}`,
          description: `Goal! ${input.homeTeamName} scores.`,
        });
      } else {
        awayGoals++;
        events.push({
          minute: Math.floor(minute),
          type: "goal",
          team: "away",
          player: `Away Player ${Math.floor(Math.random() * 11) + 1}`,
          description: `Goal! ${input.awayTeamName} scores.`,
        });
      }
    } else if (random < 0.25) {
      const isHomeCard = Math.random() < 0.5;
      events.push({
        minute: Math.floor(minute),
        type: "yellow_card",
        team: isHomeCard ? "home" : "away",
        player: `Player ${Math.floor(Math.random() * 11) + 1}`,
        description: `Yellow card issued.`,
      });
    }
  }

  const homeRating = 6.5 + Math.random() * 2;
  const awayRating = 6.5 + Math.random() * 2;
  const possession = 40 + Math.random() * 20;

  return {
    homeGoals,
    awayGoals,
    events,
    homeRating,
    awayRating,
    possession,
    shots: Math.floor(10 + Math.random() * 5),
    shotsOnTarget: Math.floor(3 + Math.random() * 4),
  };
}

export function generateMatchReport(
  input: MatchSimulationInput,
  result: MatchResult
): string {
  const possession = result.possession.toFixed(1);
  const homeRating = result.homeRating.toFixed(1);
  const awayRating = result.awayRating.toFixed(1);

  return `
MATCH REPORT
${input.homeTeamName} ${result.homeGoals} - ${result.awayGoals} ${input.awayTeamName}

Formation: ${input.homeFormation} vs ${input.awayFormation}
Possession: ${possession}%
Shots: ${result.shots} (${result.shotsOnTarget} on target)

Team Ratings:
${input.homeTeamName}: ${homeRating}/10
${input.awayTeamName}: ${awayRating}/10

Key Events:
${result.events.map((e) => `${e.minute}' - ${e.description}`).join("\n")}
  `.trim();
}
