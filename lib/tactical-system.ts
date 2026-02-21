/**
 * Tactical System
 * Implements in-match tactical adjustments and their effects on match simulation
 */

export type TacticalInstruction = 
  | "balanced"
  | "attacking"
  | "defensive"
  | "counter_attack"
  | "possession"
  | "high_press"
  | "park_the_bus"
  | "long_ball";

export interface TacticalAdjustment {
  instruction: TacticalInstruction;
  minute: number;
  expectedImpact: {
    possessionChange: number; // -20 to +20
    attackingPowerChange: number; // -30 to +30
    defensiveStrengthChange: number; // -30 to +30
    injuryRiskIncrease: number; // 0 to 0.1
  };
}

export interface MatchTactics {
  formation: string;
  baseStyle: "defensive" | "balanced" | "attacking";
  pressing: "low" | "medium" | "high";
  buildUp: "short" | "mixed" | "long";
  adjustments: TacticalAdjustment[];
  currentInstruction: TacticalInstruction;
}

/**
 * Get tactical adjustments for a specific instruction
 */
export function getTacticalAdjustmentImpact(
  instruction: TacticalInstruction,
  currentPossession: number,
  currentAttackingPower: number,
  currentDefensiveStrength: number
): {
  newPossession: number;
  newAttackingPower: number;
  newDefensiveStrength: number;
  injuryRiskIncrease: number;
  moraleCost: number;
} {
  const impacts: Record<TacticalInstruction, any> = {
    balanced: {
      possessionChange: 0,
      attackingPowerChange: 0,
      defensiveStrengthChange: 0,
      injuryRiskIncrease: 0,
      moraleCost: 0,
    },
    attacking: {
      possessionChange: 10,
      attackingPowerChange: 25,
      defensiveStrengthChange: -20,
      injuryRiskIncrease: 0.02,
      moraleCost: -5,
    },
    defensive: {
      possessionChange: -10,
      attackingPowerChange: -15,
      defensiveStrengthChange: 25,
      injuryRiskIncrease: 0,
      moraleCost: 0,
    },
    counter_attack: {
      possessionChange: -15,
      attackingPowerChange: 20,
      defensiveStrengthChange: 15,
      injuryRiskIncrease: 0.03,
      moraleCost: -10,
    },
    possession: {
      possessionChange: 20,
      attackingPowerChange: 10,
      defensiveStrengthChange: -5,
      injuryRiskIncrease: 0.01,
      moraleCost: 0,
    },
    high_press: {
      possessionChange: 5,
      attackingPowerChange: 15,
      defensiveStrengthChange: -10,
      injuryRiskIncrease: 0.05,
      moraleCost: -15,
    },
    park_the_bus: {
      possessionChange: -25,
      attackingPowerChange: -30,
      defensiveStrengthChange: 35,
      injuryRiskIncrease: 0,
      moraleCost: -20,
    },
    long_ball: {
      possessionChange: -20,
      attackingPowerChange: 15,
      defensiveStrengthChange: 10,
      injuryRiskIncrease: 0.02,
      moraleCost: -5,
    },
  };

  const impact = impacts[instruction];

  return {
    newPossession: Math.max(20, Math.min(80, currentPossession + impact.possessionChange)),
    newAttackingPower: Math.max(0, currentAttackingPower + impact.attackingPowerChange),
    newDefensiveStrength: Math.max(0, currentDefensiveStrength + impact.defensiveStrengthChange),
    injuryRiskIncrease: impact.injuryRiskIncrease,
    moraleCost: impact.moraleCost,
  };
}

/**
 * Get recommended tactics based on match situation
 */
export function getRecommendedTactics(
  matchSituation: {
    currentScore: { home: number; away: number };
    isHome: boolean;
    possession: number;
    timeRemaining: number;
    squadRating: number;
    opponentRating: number;
  }
): TacticalInstruction[] {
  const { currentScore, isHome, possession, timeRemaining, squadRating, opponentRating } = matchSituation;
  const yourScore = isHome ? currentScore.home : currentScore.away;
  const opponentScore = isHome ? currentScore.away : currentScore.home;
  const ratingDifference = squadRating - opponentRating;

  const recommendations: TacticalInstruction[] = [];

  // Winning scenario
  if (yourScore > opponentScore) {
    if (timeRemaining < 15) {
      recommendations.push("park_the_bus");
    } else if (timeRemaining < 30) {
      recommendations.push("defensive");
    } else {
      recommendations.push("balanced");
    }
  }

  // Losing scenario
  if (yourScore < opponentScore) {
    if (timeRemaining < 20) {
      recommendations.push("attacking");
      recommendations.push("high_press");
    } else if (ratingDifference > 5) {
      recommendations.push("counter_attack");
    } else {
      recommendations.push("attacking");
    }
  }

  // Draw scenario
  if (yourScore === opponentScore) {
    if (timeRemaining < 10) {
      recommendations.push("attacking");
    } else if (possession > 55) {
      recommendations.push("possession");
    } else if (possession < 45) {
      recommendations.push("counter_attack");
    } else {
      recommendations.push("balanced");
    }
  }

  // Add default if empty
  if (recommendations.length === 0) {
    recommendations.push("balanced");
  }

  return recommendations;
}

/**
 * Calculate the effectiveness of a tactical instruction
 */
export function calculateTacticalEffectiveness(
  instruction: TacticalInstruction,
  playerSkills: {
    pace: number;
    passing: number;
    defense: number;
    dribbling: number;
  },
  formation: string
): number {
  let effectiveness = 50; // Base effectiveness

  // Effectiveness varies by formation
  const formationBonus: Record<string, Record<TacticalInstruction, number>> = {
    "4-3-3": {
      balanced: 10,
      attacking: 5,
      defensive: 0,
      counter_attack: 5,
      possession: 10,
      high_press: 5,
      park_the_bus: -5,
      long_ball: 0,
    },
    "4-2-3-1": {
      balanced: 5,
      attacking: 0,
      defensive: 15,
      counter_attack: 10,
      possession: 5,
      high_press: 0,
      park_the_bus: 10,
      long_ball: 5,
    },
    "3-5-2": {
      balanced: 5,
      attacking: 15,
      defensive: 0,
      counter_attack: 5,
      possession: 15,
      high_press: 10,
      park_the_bus: -10,
      long_ball: 0,
    },
    "5-3-2": {
      balanced: 0,
      attacking: -10,
      defensive: 20,
      counter_attack: 15,
      possession: 0,
      high_press: -5,
      park_the_bus: 15,
      long_ball: 10,
    },
  };

  const bonus = formationBonus[formation]?.[instruction] || 0;
  effectiveness += bonus;

  // Effectiveness varies by player skills
  if (instruction === "possession") {
    effectiveness += (playerSkills.passing - 70) * 0.3;
  } else if (instruction === "high_press") {
    effectiveness += (playerSkills.pace - 70) * 0.3;
  } else if (instruction === "defensive" || instruction === "park_the_bus") {
    effectiveness += (playerSkills.defense - 70) * 0.3;
  } else if (instruction === "counter_attack") {
    effectiveness += (playerSkills.pace - 70) * 0.2 + (playerSkills.dribbling - 70) * 0.2;
  }

  return Math.max(0, Math.min(100, effectiveness));
}

/**
 * Apply tactical adjustment to match state
 */
export function applyTacticalAdjustment(
  currentState: {
    possession: number;
    attackingPower: number;
    defensiveStrength: number;
    playerMorale: number;
    injuryRisk: number;
  },
  adjustment: TacticalAdjustment,
  playerSkills: { pace: number; passing: number; defense: number; dribbling: number },
  formation: string
): {
  possession: number;
  attackingPower: number;
  defensiveStrength: number;
  playerMorale: number;
  injuryRisk: number;
} {
  const impact = getTacticalAdjustmentImpact(
    adjustment.instruction,
    currentState.possession,
    currentState.attackingPower,
    currentState.defensiveStrength
  );

  const effectiveness = calculateTacticalEffectiveness(adjustment.instruction, playerSkills, formation);
  const effectivenessMultiplier = effectiveness / 100;

  return {
    possession: currentState.possession + impact.possessionChange * effectivenessMultiplier,
    attackingPower: currentState.attackingPower + impact.attackingPowerChange * effectivenessMultiplier,
    defensiveStrength: currentState.defensiveStrength + impact.defensiveStrengthChange * effectivenessMultiplier,
    playerMorale: Math.max(0, Math.min(100, currentState.playerMorale + impact.moraleCost)),
    injuryRisk: currentState.injuryRisk + impact.injuryRiskIncrease,
  };
}

/**
 * Get tactical description for UI display
 */
export function getTacticalDescription(instruction: TacticalInstruction): {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
} {
  const descriptions: Record<TacticalInstruction, any> = {
    balanced: {
      name: "Balanced",
      description: "Standard tactical approach with equal focus on attack and defense",
      pros: ["Stable", "Flexible", "No morale cost"],
      cons: ["No particular advantage", "Predictable"],
    },
    attacking: {
      name: "Attacking",
      description: "Push forward with more players in attacking positions",
      pros: ["Increased goal-scoring chances", "Morale boost"],
      cons: ["Defensive vulnerability", "Higher injury risk"],
    },
    defensive: {
      name: "Defensive",
      description: "Prioritize defensive solidity and counter-attacks",
      pros: ["Strong defense", "Compact shape"],
      cons: ["Less possession", "Limited attacking opportunities"],
    },
    counter_attack: {
      name: "Counter Attack",
      description: "Absorb pressure and exploit spaces on the break",
      pros: ["Effective against strong teams", "Quick transitions"],
      cons: ["Requires fast players", "Morale cost", "High injury risk"],
    },
    possession: {
      name: "Possession",
      description: "Control the game through ball possession and passing",
      pros: ["Dominates possession", "Reduces opponent chances"],
      cons: ["Requires skilled passers", "Can be slow to break down defenses"],
    },
    high_press: {
      name: "High Press",
      description: "Aggressively press opponents high up the pitch",
      pros: ["Regain possession quickly", "Disrupt opponent play"],
      cons: ["Very tiring", "High injury risk", "Leaves space behind"],
    },
    park_the_bus: {
      name: "Park the Bus",
      description: "Extreme defensive setup with minimal attacking intent",
      pros: ["Nearly impenetrable defense", "Effective for holding leads"],
      cons: ["Very low morale", "Boring for fans", "Limited attacking chances"],
    },
    long_ball: {
      name: "Long Ball",
      description: "Bypass midfield with direct long passes",
      pros: ["Quick transitions", "Effective against possession-focused teams"],
      cons: ["Less possession", "Requires tall strikers", "Unpredictable"],
    },
  };

  return descriptions[instruction];
}
