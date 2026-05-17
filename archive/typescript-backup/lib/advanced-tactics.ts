/**
 * Advanced Tactical Philosophies
 * Implements Gegenpressing, Tiki-Taka, and other advanced systems
 */

export type AdvancedTactic = "gegenpressing" | "tiki_taka" | "false_nine" | "inverted_fullbacks" | "wing_backs";

export interface AdvancedTacticalSystem {
  name: AdvancedTactic;
  displayName: string;
  description: string;
  requiredFormations: string[];
  requiredPlayerAttributes: {
    pace: number;
    passing: number;
    dribbling: number;
    defense: number;
    stamina: number;
  };
  matchImpact: {
    possession: number;
    pressureIntensity: number;
    buildUpSpeed: number;
    defensiveVulnerability: number;
    injuryRisk: number;
  };
  playerRoleModifications: Record<string, PlayerRoleModification>;
}

export interface PlayerRoleModification {
  roleName: string;
  position: string;
  keyResponsibilities: string[];
  attributeBoosts: {
    [key: string]: number;
  };
  attributePenalties: {
    [key: string]: number;
  };
  staminaDrain: number; // 0-100, how much stamina is drained
}

export interface GegenpressingState {
  pressureZones: PressureZone[];
  ballRecoveryRate: number; // 0-100
  transitionSpeed: number; // 0-100
  playerCoordination: number; // 0-100
  fatigueLevel: number; // 0-100
}

export interface PressureZone {
  area: "defensive" | "midfield" | "attacking";
  intensity: number; // 0-100
  playerCount: number;
  recoveryRate: number; // % chance to win ball in this zone
}

export interface TikiTakaState {
  possessionPercentage: number;
  passCompletionRate: number;
  averagePassLength: number; // meters
  ballRetentionTime: number; // seconds
  playerMovement: number; // 0-100, how well players move off the ball
}

/**
 * GEGENPRESSING SYSTEM
 * High-intensity pressing system focused on immediate ball recovery
 */

export const GEGENPRESSING: AdvancedTacticalSystem = {
  name: "gegenpressing",
  displayName: "Gegenpressing",
  description:
    "Intense pressing system where players immediately pressure the ball after losing possession. Requires high pace, stamina, and coordination.",
  requiredFormations: ["4-3-3", "4-2-3-1", "3-5-2"],
  requiredPlayerAttributes: {
    pace: 78,
    passing: 75,
    dribbling: 72,
    defense: 76,
    stamina: 85,
  },
  matchImpact: {
    possession: -15, // Lower possession due to aggressive play
    pressureIntensity: 95,
    buildUpSpeed: 85, // Quick transitions
    defensiveVulnerability: 25, // Risky, leaves space behind
    injuryRisk: 0.08, // High injury risk
  },
  playerRoleModifications: {
    forward: {
      roleName: "Gegenpressing Forward",
      position: "ST",
      keyResponsibilities: [
        "First line of press",
        "Cut off passing lanes",
        "Force turnovers in attacking third",
        "Quick transition to counter-attack",
      ],
      attributeBoosts: {
        pace: 5,
        defense: 8,
        stamina: 10,
      },
      attributePenalties: {
        dribbling: -3,
      },
      staminaDrain: 90,
    },
    midfielder: {
      roleName: "Gegenpressing Midfielder",
      position: "CM",
      keyResponsibilities: [
        "Second line of press",
        "Cover passing lanes",
        "Immediate recovery runs",
        "Support transitions",
      ],
      attributeBoosts: {
        pace: 3,
        defense: 6,
        stamina: 12,
        passing: 4,
      },
      attributePenalties: {},
      staminaDrain: 95,
    },
    defender: {
      roleName: "Gegenpressing Defender",
      position: "CB",
      keyResponsibilities: [
        "Organize pressing structure",
        "Cover for pressing midfielders",
        "Quick distribution",
        "High line management",
      ],
      attributeBoosts: {
        pace: 4,
        passing: 5,
      },
      attributePenalties: {
        positioning: -2,
      },
      staminaDrain: 85,
    },
  },
};

/**
 * TIKI-TAKA SYSTEM
 * Possession-based system focused on short passes and ball retention
 */

export const TIKI_TAKA: AdvancedTacticalSystem = {
  name: "tiki_taka",
  displayName: "Tiki-Taka",
  description:
    "Possession-dominant system based on short, quick passes. Requires excellent technical ability, passing accuracy, and positional intelligence.",
  requiredFormations: ["4-3-3", "3-5-2", "4-1-4-1"],
  requiredPlayerAttributes: {
    pace: 72,
    passing: 88,
    dribbling: 82,
    defense: 70,
    stamina: 80,
  },
  matchImpact: {
    possession: 25, // High possession
    pressureIntensity: 35, // Lower pressure, more controlled
    buildUpSpeed: 45, // Slower, more methodical
    defensiveVulnerability: 40, // Vulnerable to counter-attacks
    injuryRisk: 0.02, // Low injury risk
  },
  playerRoleModifications: {
    forward: {
      roleName: "Tiki-Taka Forward",
      position: "ST",
      keyResponsibilities: [
        "Link-up play",
        "One-touch passes",
        "Create space for midfielders",
        "Intelligent movement",
      ],
      attributeBoosts: {
        passing: 8,
        dribbling: 6,
        positioning: 7,
      },
      attributePenalties: {
        pace: -2,
        defense: -3,
      },
      staminaDrain: 70,
    },
    midfielder: {
      roleName: "Tiki-Taka Midfielder",
      position: "CM",
      keyResponsibilities: [
        "Ball circulation",
        "Possession retention",
        "Creative passing",
        "Tempo control",
      ],
      attributeBoosts: {
        passing: 10,
        dribbling: 8,
        positioning: 6,
      },
      attributePenalties: {
        defense: -4,
      },
      staminaDrain: 75,
    },
    defender: {
      roleName: "Tiki-Taka Defender",
      position: "CB",
      keyResponsibilities: [
        "Build from the back",
        "Short passing",
        "Possession retention",
        "Sweeper role",
      ],
      attributeBoosts: {
        passing: 8,
        positioning: 5,
      },
      attributePenalties: {
        pace: -3,
      },
      staminaDrain: 65,
    },
  },
};

/**
 * FALSE NINE SYSTEM
 * Advanced system where the striker drops deep to create space
 */

export const FALSE_NINE: AdvancedTacticalSystem = {
  name: "false_nine",
  displayName: "False Nine",
  description:
    "Striker drops deep to midfield, creating space for wingers. Requires technical wingers and intelligent striker positioning.",
  requiredFormations: ["4-3-3", "3-5-2"],
  requiredPlayerAttributes: {
    pace: 75,
    passing: 80,
    dribbling: 85,
    defense: 65,
    stamina: 78,
  },
  matchImpact: {
    possession: 15,
    pressureIntensity: 50,
    buildUpSpeed: 60,
    defensiveVulnerability: 35,
    injuryRisk: 0.04,
  },
  playerRoleModifications: {
    forward: {
      roleName: "False Nine",
      position: "ST",
      keyResponsibilities: [
        "Drop into midfield",
        "Create space for wingers",
        "Link-up play",
        "Creative playmaking",
      ],
      attributeBoosts: {
        passing: 12,
        dribbling: 8,
        positioning: 10,
      },
      attributePenalties: {
        pace: -5,
        defense: -2,
      },
      staminaDrain: 80,
    },
    midfielder: {
      roleName: "False Nine Support",
      position: "CM",
      keyResponsibilities: [
        "Cover for dropped striker",
        "Box-to-box runs",
        "Defensive cover",
      ],
      attributeBoosts: {
        pace: 4,
        defense: 5,
      },
      attributePenalties: {},
      staminaDrain: 85,
    },
  },
};

/**
 * INVERTED FULLBACKS SYSTEM
 * Fullbacks cut inside to create overloads in midfield
 */

export const INVERTED_FULLBACKS: AdvancedTacticalSystem = {
  name: "inverted_fullbacks",
  displayName: "Inverted Fullbacks",
  description:
    "Fullbacks tuck inside to midfield, creating numerical advantages. Requires technical fullbacks and wide wingers.",
  requiredFormations: ["4-3-3", "4-2-3-1"],
  requiredPlayerAttributes: {
    pace: 80,
    passing: 78,
    dribbling: 80,
    defense: 72,
    stamina: 82,
  },
  matchImpact: {
    possession: 12,
    pressureIntensity: 55,
    buildUpSpeed: 65,
    defensiveVulnerability: 30,
    injuryRisk: 0.05,
  },
  playerRoleModifications: {
    fullback: {
      roleName: "Inverted Fullback",
      position: "LB/RB",
      keyResponsibilities: [
        "Cut inside to midfield",
        "Create overloads",
        "Passing options",
        "Defensive cover when needed",
      ],
      attributeBoosts: {
        dribbling: 8,
        passing: 6,
        positioning: 7,
      },
      attributePenalties: {
        defense: -5,
      },
      staminaDrain: 85,
    },
  },
};

/**
 * WING BACKS SYSTEM
 * Attacking fullbacks who push high up the pitch
 */

export const WING_BACKS: AdvancedTacticalSystem = {
  name: "wing_backs",
  displayName: "Wing Backs",
  description:
    "Fullbacks operate as wingers, providing width and attacking support. Requires athletic, technical fullbacks.",
  requiredFormations: ["5-3-2", "3-5-2"],
  requiredPlayerAttributes: {
    pace: 85,
    passing: 76,
    dribbling: 78,
    defense: 74,
    stamina: 88,
  },
  matchImpact: {
    possession: 10,
    pressureIntensity: 60,
    buildUpSpeed: 70,
    defensiveVulnerability: 20,
    injuryRisk: 0.06,
  },
  playerRoleModifications: {
    wingback: {
      roleName: "Attacking Wing Back",
      position: "LWB/RWB",
      keyResponsibilities: [
        "Push high up the pitch",
        "Provide width",
        "Attacking support",
        "Quick recovery",
      ],
      attributeBoosts: {
        pace: 10,
        dribbling: 8,
        stamina: 12,
      },
      attributePenalties: {
        defense: -3,
      },
      staminaDrain: 95,
    },
  },
};

/**
 * Initialize Gegenpressing state
 */
export function initializeGegenpressingState(): GegenpressingState {
  return {
    pressureZones: [
      {
        area: "attacking",
        intensity: 95,
        playerCount: 3,
        recoveryRate: 85,
      },
      {
        area: "midfield",
        intensity: 80,
        playerCount: 4,
        recoveryRate: 75,
      },
      {
        area: "defensive",
        intensity: 60,
        playerCount: 2,
        recoveryRate: 65,
      },
    ],
    ballRecoveryRate: 78,
    transitionSpeed: 90,
    playerCoordination: 75,
    fatigueLevel: 0,
  };
}

/**
 * Initialize Tiki-Taka state
 */
export function initializeTikiTakaState(): TikiTakaState {
  return {
    possessionPercentage: 65,
    passCompletionRate: 88,
    averagePassLength: 8, // meters
    ballRetentionTime: 45, // seconds
    playerMovement: 85,
  };
}

/**
 * Simulate Gegenpressing during a match
 */
export function simulateGegenpressing(
  state: GegenpressingState,
  opponentPossession: number,
  playerFitness: number,
  teamCoordination: number
): {
  updatedState: GegenpressingState;
  ballRecovered: boolean;
  fatigueIncrease: number;
} {
  const baseRecoveryChance = state.ballRecoveryRate;
  const fitnessModifier = playerFitness / 100;
  const coordinationModifier = teamCoordination / 100;
  const recoveryChance = baseRecoveryChance * fitnessModifier * coordinationModifier;

  const ballRecovered = Math.random() * 100 < recoveryChance;

  const fatigueIncrease = 2 + (100 - playerFitness) * 0.02;

  return {
    updatedState: {
      ...state,
      fatigueLevel: Math.min(100, state.fatigueLevel + fatigueIncrease),
      playerCoordination: Math.max(50, state.playerCoordination - fatigueIncrease * 0.5),
    },
    ballRecovered,
    fatigueIncrease,
  };
}

/**
 * Simulate Tiki-Taka during a match
 */
export function simulateTikiTaka(
  state: TikiTakaState,
  playerPassing: number,
  playerDribbling: number,
  opponentPressure: number
): {
  updatedState: TikiTakaState;
  goalChance: number;
  ballLost: boolean;
} {
  const passingModifier = playerPassing / 100;
  const dribblingModifier = playerDribbling / 100;
  const pressureModifier = opponentPressure / 100;

  const passCompletionRate = Math.max(70, state.passCompletionRate - pressureModifier * 15);
  const ballLostChance = (100 - passCompletionRate) * 0.5;
  const ballLost = Math.random() * 100 < ballLostChance;

  const goalChance = state.possessionPercentage * passingModifier * dribblingModifier * 0.1;

  return {
    updatedState: {
      ...state,
      passCompletionRate,
      possessionPercentage: Math.min(
        85,
        state.possessionPercentage + (ballLost ? -5 : 2)
      ),
      ballRetentionTime: state.ballRetentionTime + (ballLost ? -10 : 5),
    },
    goalChance: Math.min(100, goalChance),
    ballLost,
  };
}

/**
 * Check if squad is suitable for advanced tactic
 */
export function isSquadSuitableForTactic(
  squad: Array<{
    position: string;
    pace: number;
    passing: number;
    dribbling: number;
    defense: number;
    stamina: number;
  }>,
  tactic: AdvancedTacticalSystem
): {
  suitable: boolean;
  missingAttributes: string[];
  suitabilityScore: number;
} {
  const missingAttributes: string[] = [];
  let suitabilityScore = 0;

  const avgSquadStats = {
    pace: squad.reduce((a, p) => a + p.pace, 0) / squad.length,
    passing: squad.reduce((a, p) => a + p.passing, 0) / squad.length,
    dribbling: squad.reduce((a, p) => a + p.dribbling, 0) / squad.length,
    defense: squad.reduce((a, p) => a + p.defense, 0) / squad.length,
    stamina: squad.reduce((a, p) => a + p.stamina, 0) / squad.length,
  };

  Object.entries(tactic.requiredPlayerAttributes).forEach(([attr, required]) => {
    const avgStat = avgSquadStats[attr as keyof typeof avgSquadStats];
    if (avgStat < required) {
      missingAttributes.push(`${attr} (${Math.round(avgStat)} vs ${required} required)`);
    } else {
      suitabilityScore += 20;
    }
  });

  return {
    suitable: missingAttributes.length === 0,
    missingAttributes,
    suitabilityScore: Math.max(0, suitabilityScore - missingAttributes.length * 15),
  };
}

/**
 * Get tactic recommendations based on squad
 */
export function getTacticRecommendations(
  squad: Array<{
    position: string;
    pace: number;
    passing: number;
    dribbling: number;
    defense: number;
    stamina: number;
  }>
): Array<{ tactic: AdvancedTacticalSystem; suitabilityScore: number }> {
  const allTactics = [GEGENPRESSING, TIKI_TAKA, FALSE_NINE, INVERTED_FULLBACKS, WING_BACKS];

  return allTactics
    .map((tactic) => ({
      tactic,
      suitabilityScore: isSquadSuitableForTactic(squad, tactic).suitabilityScore,
    }))
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}
