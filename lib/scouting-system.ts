/**
 * Scouting System
 * Manages scouts, scouting missions, and player discovery
 */

export type ScoutLevel = "junior" | "senior" | "elite";
export type ScoutingRegion = "domestic" | "europe" | "south_america" | "africa" | "asia";
export type PlayerType = "striker" | "winger" | "midfielder" | "defender" | "goalkeeper" | "any";

export interface Scout {
  id: string;
  name: string;
  level: ScoutLevel;
  region: ScoutingRegion;
  effectiveness: number; // 0-100
  salary: number;
  yearsExperience: number;
  currentMission?: ScoutingMission;
}

export interface ScoutingMission {
  id: string;
  scoutId: string;
  region: ScoutingRegion;
  playerType: PlayerType;
  minRating: number;
  maxAge: number;
  budget: number;
  durationWeeks: number;
  startWeek: number;
  status: "active" | "completed" | "failed";
  playersFound: ScoutedPlayer[];
}

export interface ScoutedPlayer {
  id: string;
  name: string;
  age: number;
  position: string;
  currentClub: string;
  estimatedRating: number;
  potentialRating: number;
  askingPrice: number;
  scoutReport: string;
  discoveredWeek: number;
  confidence: number; // 0-100, how confident scout is in the rating
}

/**
 * Get scout effectiveness based on level and experience
 */
function getScoutEffectiveness(level: ScoutLevel, yearsExperience: number): number {
  const baseLevels: Record<ScoutLevel, number> = {
    junior: 40,
    senior: 70,
    elite: 90,
  };
  
  const base = baseLevels[level];
  const experienceBonus = Math.min(yearsExperience * 2, 20);
  
  return Math.min(100, base + experienceBonus);
}

/**
 * Calculate scout salary
 */
export function calculateScoutSalary(level: ScoutLevel, yearsExperience: number): number {
  const baseSalaries: Record<ScoutLevel, number> = {
    junior: 30000,
    senior: 60000,
    elite: 120000,
  };
  
  const base = baseSalaries[level];
  const experienceBonus = yearsExperience * 2000;
  
  return base + experienceBonus;
}

/**
 * Hire a new scout
 */
export function hireScout(
  name: string,
  level: ScoutLevel,
  region: ScoutingRegion,
  yearsExperience: number
): Scout {
  return {
    id: `scout_${Date.now()}`,
    name,
    level,
    region,
    effectiveness: getScoutEffectiveness(level, yearsExperience),
    salary: calculateScoutSalary(level, yearsExperience),
    yearsExperience,
  };
}

/**
 * Create a scouting mission
 */
export function createScoutingMission(
  scoutId: string,
  region: ScoutingRegion,
  playerType: PlayerType,
  minRating: number,
  maxAge: number,
  budget: number,
  durationWeeks: number,
  currentWeek: number
): ScoutingMission {
  return {
    id: `mission_${Date.now()}`,
    scoutId,
    region,
    playerType,
    minRating,
    maxAge,
    budget,
    durationWeeks,
    startWeek: currentWeek,
    status: "active",
    playersFound: [],
  };
}

/**
 * Generate scouted players based on mission parameters
 */
export function generateScoutedPlayers(
  mission: ScoutingMission,
  scout: Scout,
  count: number = 5
): ScoutedPlayer[] {
  const players: ScoutedPlayer[] = [];
  const positions: Record<PlayerType, string[]> = {
    striker: ["ST", "CF"],
    winger: ["LW", "RW", "LM", "RM"],
    midfielder: ["CM", "CAM", "CDM"],
    defender: ["CB", "LB", "RB", "LWB", "RWB"],
    goalkeeper: ["GK"],
    any: ["ST", "LW", "RW", "CAM", "CM", "CDM", "LB", "RB", "CB", "GK"],
  };
  
  const clubs = [
    "Real Madrid", "Barcelona", "Bayern Munich", "PSG", "Manchester City",
    "Liverpool", "Manchester United", "Chelsea", "Arsenal", "Juventus",
    "AC Milan", "Inter Milan", "Napoli", "Roma", "Lazio",
    "Atlético Madrid", "Sevilla", "Valencia", "Villarreal", "Real Sociedad",
    "Borussia Dortmund", "RB Leipzig", "Bayer Leverkusen", "Schalke 04", "Werder Bremen",
    "Lyon", "Marseille", "Monaco", "Lille", "Nice",
  ];
  
  const surnames = [
    "Silva", "Santos", "Oliveira", "Ferreira", "Gomes", "Costa", "Pereira",
    "Müller", "Schmidt", "Weber", "Wagner", "Becker", "Hoffmann", "Schulz",
    "García", "López", "González", "Rodríguez", "Martínez", "Hernández", "Pérez",
    "Rossi", "Bianchi", "Ferrari", "Russo", "Ricci", "Gallo", "Moretti",
  ];
  
  const firstNames = [
    "João", "Carlos", "Diego", "Miguel", "Lucas", "Pablo", "Sergio",
    "Marco", "Andrea", "Luca", "Antonio", "Giuseppe", "Francesco", "Matteo",
    "Manuel", "José", "Luis", "Juan", "Pedro", "Alejandro", "Rafael",
  ];
  
  for (let i = 0; i < count; i++) {
    const baseRating = mission.minRating + Math.random() * (95 - mission.minRating);
    const confidence = 50 + scout.effectiveness * 0.5 + Math.random() * 20;
    const ratingVariance = (100 - confidence) / 10;
    const estimatedRating = Math.round(baseRating + (Math.random() - 0.5) * ratingVariance);
    
    players.push({
      id: `player_${Date.now()}_${i}`,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`,
      age: Math.floor(Math.random() * (mission.maxAge - 18) + 18),
      position: positions[mission.playerType][
        Math.floor(Math.random() * positions[mission.playerType].length)
      ],
      currentClub: clubs[Math.floor(Math.random() * clubs.length)],
      estimatedRating: Math.max(mission.minRating, Math.min(99, estimatedRating)),
      potentialRating: estimatedRating + Math.floor(Math.random() * 15),
      askingPrice: Math.round(
        (estimatedRating - 70) * 1000000 * (1 + Math.random() * 0.5)
      ),
      scoutReport: generateScoutReport(scout.level, estimatedRating),
      discoveredWeek: mission.startWeek,
      confidence: Math.round(confidence),
    });
  }
  
  return players;
}

/**
 * Generate a scout report
 */
function generateScoutReport(scoutLevel: ScoutLevel, playerRating: number): string {
  const reports: Record<ScoutLevel, string[]> = {
    junior: [
      "Promising young talent with good potential.",
      "Shows potential but needs development.",
      "Could be a good squad player.",
      "Has the attributes we're looking for.",
    ],
    senior: [
      "Excellent technical ability and game intelligence.",
      "Strong physical attributes with good positioning.",
      "Consistent performer with reliable output.",
      "High-quality player with proven track record.",
    ],
    elite: [
      "World-class talent with exceptional potential.",
      "Outstanding technical and physical attributes.",
      "Elite mentality and leadership qualities.",
      "Future star with immediate impact potential.",
    ],
  };
  
  const reportList = reports[scoutLevel];
  return reportList[Math.floor(Math.random() * reportList.length)];
}

/**
 * Calculate mission success rate
 */
export function calculateMissionSuccessRate(
  scout: Scout,
  mission: ScoutingMission,
  regionsVisited: number
): number {
  let successRate = scout.effectiveness;
  
  // Region familiarity
  if (scout.region === mission.region) {
    successRate += 15;
  }
  
  // Mission difficulty
  const difficultyPenalty = (mission.minRating - 70) * 0.5;
  successRate -= difficultyPenalty;
  
  // Budget impact
  if (mission.budget < 5000000) {
    successRate -= 20;
  }
  
  return Math.max(0, Math.min(100, successRate));
}

/**
 * Complete a scouting mission
 */
export function completeMission(
  mission: ScoutingMission,
  scout: Scout
): ScoutingMission {
  const successRate = calculateMissionSuccessRate(scout, mission, 1);
  const success = Math.random() * 100 < successRate;
  
  if (success) {
    const playersFound = generateScoutedPlayers(mission, scout, 3 + Math.floor(Math.random() * 4));
    return {
      ...mission,
      status: "completed",
      playersFound,
    };
  } else {
    return {
      ...mission,
      status: "failed",
      playersFound: [],
    };
  }
}

/**
 * Get scouting recommendations based on squad needs
 */
export function getScoutingRecommendations(
  squad: Array<{ position: string; overallRating: number; age: number }>,
  budget: number
): {
  position: PlayerType;
  priority: "critical" | "high" | "medium" | "low";
  suggestedRating: number;
  maxAge: number;
  estimatedBudget: number;
}[] {
  const recommendations = [];
  
  // Count players by position
  const positionCounts: Record<string, number> = {};
  const positionRatings: Record<string, number[]> = {};
  
  squad.forEach((player) => {
    positionCounts[player.position] = (positionCounts[player.position] || 0) + 1;
    if (!positionRatings[player.position]) positionRatings[player.position] = [];
    positionRatings[player.position].push(player.overallRating);
  });
  
  // Analyze needs
  const positions: Array<{ type: PlayerType; name: string }> = [
    { type: "striker", name: "ST" },
    { type: "winger", name: "LW/RW" },
    { type: "midfielder", name: "CM" },
    { type: "defender", name: "CB" },
    { type: "goalkeeper", name: "GK" },
  ];
  
  positions.forEach(({ type, name }) => {
    const count = positionCounts[name] || 0;
    const avgRating = positionRatings[name]
      ? positionRatings[name].reduce((a, b) => a + b, 0) / positionRatings[name].length
      : 70;
    
    let priority: "critical" | "high" | "medium" | "low" = "low";
    let suggestedRating = avgRating + 2;
    
    if (count < 2) {
      priority = "critical";
      suggestedRating = Math.max(75, avgRating + 5);
    } else if (count < 3) {
      priority = "high";
      suggestedRating = avgRating + 3;
    } else if (avgRating < 75) {
      priority = "medium";
      suggestedRating = avgRating + 2;
    }
    
    if (priority !== "low") {
      recommendations.push({
        position: type,
        priority,
        suggestedRating: Math.round(suggestedRating),
        maxAge: 28,
        estimatedBudget: Math.round((suggestedRating - 70) * 1000000),
      });
    }
  });
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Calculate total scouting costs
 */
export function calculateScoutingCosts(scouts: Scout[], missions: ScoutingMission[]): number {
  const scoutSalaries = scouts.reduce((total, scout) => total + scout.salary, 0);
  const missionCosts = missions
    .filter((m) => m.status === "active")
    .reduce((total, mission) => total + mission.budget, 0);
  
  return scoutSalaries + missionCosts;
}
