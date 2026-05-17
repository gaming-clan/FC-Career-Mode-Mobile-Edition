/**
 * Staff Management System
 * Manages coaching staff, medical staff, and their effects on player development
 */

export type StaffRole = "manager" | "assistant_coach" | "attacking_coach" | "defensive_coach" | "fitness_coach" | "goalkeeper_coach" | "head_physio" | "sports_psychologist" | "scout";
export type StaffNationality = "domestic" | "european" | "south_american" | "african" | "asian";

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  nationality: StaffNationality;
  age: number;
  experience: number; // Years
  effectiveness: number; // 0-100
  salary: number; // Annual
  contract: {
    startYear: number;
    endYear: number;
  };
  specializations: string[];
  currentClub?: string;
}

export interface CoachingEffect {
  attackingCoachRating: number;
  defensiveCoachRating: number;
  fitnessCoachRating: number;
  goalkeeperCoachRating: number;
  psychologistRating: number;
  averageEffectiveness: number;
}

export interface PlayerDevelopmentBonus {
  attacking: number; // -10 to 20
  defending: number; // -10 to 20
  physical: number; // -10 to 20
  technical: number; // -10 to 20
  mental: number; // -10 to 20
}

export interface MedicalStaff {
  headPhysio: StaffMember | null;
  assistantPhysios: StaffMember[];
  psychologist: StaffMember | null;
  effectiveness: number; // 0-100
  injuryRecoveryRate: number; // 0-100
  preventionRate: number; // 0-100
}

export interface CoachingStaff {
  manager: StaffMember;
  assistantCoaches: StaffMember[];
  attackingCoach: StaffMember | null;
  defensiveCoach: StaffMember | null;
  fitnessCoach: StaffMember | null;
  goalkeeperCoach: StaffMember | null;
}

/**
 * Calculate staff member salary
 */
export function calculateStaffSalary(
  role: StaffRole,
  experience: number,
  effectiveness: number,
  nationality: StaffNationality
): number {
  const baseSalaries: Record<StaffRole, number> = {
    manager: 500000,
    assistant_coach: 150000,
    attacking_coach: 120000,
    defensive_coach: 120000,
    fitness_coach: 100000,
    goalkeeper_coach: 100000,
    head_physio: 120000,
    sports_psychologist: 100000,
    scout: 50000,
  };

  const nationalityMultiplier: Record<StaffNationality, number> = {
    domestic: 0.8,
    european: 1.0,
    south_american: 0.9,
    african: 0.7,
    asian: 0.8,
  };

  const base = baseSalaries[role];
  const experienceBonus = experience * 5000;
  const effectivenessBonus = (effectiveness - 50) * 1000;
  const nationalityAdjustment = nationalityMultiplier[nationality];

  return Math.round((base + experienceBonus + effectivenessBonus) * nationalityAdjustment);
}

/**
 * Hire a staff member
 */
export function hireStaffMember(
  name: string,
  role: StaffRole,
  nationality: StaffNationality,
  age: number,
  experience: number,
  effectiveness: number,
  specializations: string[] = []
): StaffMember {
  const currentYear = new Date().getFullYear();

  return {
    id: `staff_${Date.now()}`,
    name,
    role,
    nationality,
    age,
    experience,
    effectiveness,
    salary: calculateStaffSalary(role, experience, effectiveness, nationality),
    contract: {
      startYear: currentYear,
      endYear: currentYear + 2 + Math.floor(experience / 5),
    },
    specializations,
  };
}

/**
 * Calculate coaching effects on player development
 */
export function calculateCoachingEffects(
  coachingStaff: CoachingStaff
): CoachingEffect {
  const getEffectiveness = (staff: StaffMember | null): number => {
    return staff ? staff.effectiveness : 50;
  };

  const attackingCoachRating = getEffectiveness(coachingStaff.attackingCoach);
  const defensiveCoachRating = getEffectiveness(coachingStaff.defensiveCoach);
  const fitnessCoachRating = getEffectiveness(coachingStaff.fitnessCoach);
  const goalkeeperCoachRating = getEffectiveness(coachingStaff.goalkeeperCoach);
  const psychologistRating = 50; // Placeholder

  const averageEffectiveness =
    (attackingCoachRating +
      defensiveCoachRating +
      fitnessCoachRating +
      goalkeeperCoachRating +
      psychologistRating) /
    5;

  return {
    attackingCoachRating,
    defensiveCoachRating,
    fitnessCoachRating,
    goalkeeperCoachRating,
    psychologistRating,
    averageEffectiveness,
  };
}

/**
 * Calculate player development bonus from coaching
 */
export function calculatePlayerDevelopmentBonus(
  playerPosition: string,
  coachingEffects: CoachingEffect,
  playerAge: number,
  playerPotential: number
): PlayerDevelopmentBonus {
  const developmentMultiplier = playerAge < 25 ? 1.5 : playerAge < 30 ? 1.0 : 0.5;
  const potentialMultiplier = (playerPotential - 70) / 30;

  let attacking = 0;
  let defending = 0;
  let physical = 0;
  let technical = 0;
  let mental = 0;

  // Position-specific bonuses
  if (playerPosition.includes("ST") || playerPosition.includes("W")) {
    attacking = (coachingEffects.attackingCoachRating - 50) * 0.2 * developmentMultiplier;
    technical = (coachingEffects.attackingCoachRating - 50) * 0.15 * developmentMultiplier;
  } else if (playerPosition.includes("CB") || playerPosition.includes("B")) {
    defending = (coachingEffects.defensiveCoachRating - 50) * 0.2 * developmentMultiplier;
    physical = (coachingEffects.fitnessCoachRating - 50) * 0.1 * developmentMultiplier;
  } else if (playerPosition.includes("CM") || playerPosition.includes("M")) {
    attacking = (coachingEffects.attackingCoachRating - 50) * 0.1 * developmentMultiplier;
    defending = (coachingEffects.defensiveCoachRating - 50) * 0.1 * developmentMultiplier;
    technical = (coachingEffects.attackingCoachRating - 50) * 0.15 * developmentMultiplier;
  } else if (playerPosition.includes("GK")) {
    defending = (coachingEffects.goalkeeperCoachRating - 50) * 0.25 * developmentMultiplier;
  }

  // Fitness coach affects all positions
  physical += (coachingEffects.fitnessCoachRating - 50) * 0.15 * developmentMultiplier;

  // Mental development from psychologist
  mental = (coachingEffects.psychologistRating - 50) * 0.1 * developmentMultiplier;

  // Apply potential multiplier
  attacking *= 1 + potentialMultiplier * 0.2;
  defending *= 1 + potentialMultiplier * 0.2;
  physical *= 1 + potentialMultiplier * 0.2;
  technical *= 1 + potentialMultiplier * 0.2;
  mental *= 1 + potentialMultiplier * 0.2;

  return {
    attacking: Math.round(attacking),
    defending: Math.round(defending),
    physical: Math.round(physical),
    technical: Math.round(technical),
    mental: Math.round(mental),
  };
}

/**
 * Calculate medical staff effectiveness
 */
export function calculateMedicalEffectiveness(medicalStaff: MedicalStaff): {
  injuryRecoveryRate: number;
  preventionRate: number;
  overallEffectiveness: number;
} {
  const headPhysioEffect = medicalStaff.headPhysio ? medicalStaff.headPhysio.effectiveness : 50;
  const assistantEffect =
    medicalStaff.assistantPhysios.length > 0
      ? medicalStaff.assistantPhysios.reduce((a, p) => a + p.effectiveness, 0) /
        medicalStaff.assistantPhysios.length
      : 50;
  const psychologistEffect = medicalStaff.psychologist
    ? medicalStaff.psychologist.effectiveness
    : 50;

  const injuryRecoveryRate =
    (headPhysioEffect * 0.5 + assistantEffect * 0.3 + psychologistEffect * 0.2) / 100;
  const preventionRate =
    (headPhysioEffect * 0.4 + assistantEffect * 0.4 + psychologistEffect * 0.2) / 100;
  const overallEffectiveness =
    (headPhysioEffect * 0.5 + assistantEffect * 0.3 + psychologistEffect * 0.2) / 100;

  return {
    injuryRecoveryRate: Math.round(injuryRecoveryRate * 100),
    preventionRate: Math.round(preventionRate * 100),
    overallEffectiveness: Math.round(overallEffectiveness * 100),
  };
}

/**
 * Apply injury recovery based on medical staff
 */
export function applyInjuryRecovery(
  injuryWeeks: number,
  medicalStaffEffectiveness: number
): number {
  const recoverySpeedup = (medicalStaffEffectiveness - 50) * 0.02;
  const newInjuryWeeks = Math.max(0, injuryWeeks - (1 + recoverySpeedup));
  return newInjuryWeeks;
}

/**
 * Calculate injury prevention chance
 */
export function calculateInjuryPreventionChance(
  baseInjuryRisk: number,
  medicalStaffEffectiveness: number
): number {
  const preventionBonus = (medicalStaffEffectiveness - 50) * 0.02;
  return Math.max(0, baseInjuryRisk - preventionBonus);
}

/**
 * Get staff recommendations based on squad needs
 */
export function getStaffRecommendations(
  currentStaff: StaffMember[],
  squad: Array<{ position: string; age: number }>,
  budget: number
): Array<{
  role: StaffRole;
  priority: "critical" | "high" | "medium" | "low";
  estimatedCost: number;
  expectedBenefit: string;
}> {
  const recommendations = [];

  // Check for attacking coach
  const hasAttackingCoach = currentStaff.some((s) => s.role === "attacking_coach");
  if (!hasAttackingCoach) {
    recommendations.push({
      role: "attacking_coach",
      priority: "high",
      estimatedCost: 120000,
      expectedBenefit: "Improve attacking player development",
    });
  }

  // Check for defensive coach
  const hasDefensiveCoach = currentStaff.some((s) => s.role === "defensive_coach");
  if (!hasDefensiveCoach) {
    recommendations.push({
      role: "defensive_coach",
      priority: "high",
      estimatedCost: 120000,
      expectedBenefit: "Improve defensive player development",
    });
  }

  // Check for fitness coach
  const hasFitnessCoach = currentStaff.some((s) => s.role === "fitness_coach");
  if (!hasFitnessCoach) {
    recommendations.push({
      role: "fitness_coach",
      priority: "medium",
      estimatedCost: 100000,
      expectedBenefit: "Improve player fitness and reduce injuries",
    });
  }

  // Check for goalkeeper coach
  const hasGoalkeeperCoach = currentStaff.some((s) => s.role === "goalkeeper_coach");
  if (!hasGoalkeeperCoach) {
    recommendations.push({
      role: "goalkeeper_coach",
      priority: "medium",
      estimatedCost: 100000,
      expectedBenefit: "Improve goalkeeper development",
    });
  }

  // Check for head physio
  const hasHeadPhysio = currentStaff.some((s) => s.role === "head_physio");
  if (!hasHeadPhysio) {
    recommendations.push({
      role: "head_physio",
      priority: "critical",
      estimatedCost: 120000,
      expectedBenefit: "Reduce injury recovery time",
    });
  }

  // Check for sports psychologist
  const hasPsychologist = currentStaff.some((s) => s.role === "sports_psychologist");
  if (!hasPsychologist) {
    recommendations.push({
      role: "sports_psychologist",
      priority: "medium",
      estimatedCost: 100000,
      expectedBenefit: "Improve player morale and mental resilience",
    });
  }

  // Filter by budget
  return recommendations
    .filter((r) => r.estimatedCost <= budget)
    .sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
}

/**
 * Calculate total staff costs
 */
export function calculateTotalStaffCosts(staff: StaffMember[]): number {
  return staff.reduce((total, member) => total + member.salary, 0);
}

/**
 * Apply staff contract renewal
 */
export function renewStaffContract(
  staff: StaffMember,
  years: number = 2,
  salaryIncrease: number = 0.1
): StaffMember {
  const currentYear = new Date().getFullYear();

  return {
    ...staff,
    salary: Math.round(staff.salary * (1 + salaryIncrease)),
    contract: {
      startYear: currentYear,
      endYear: currentYear + years,
    },
  };
}

/**
 * Check for staff contract expiration
 */
export function getExpiringContracts(
  staff: StaffMember[],
  weeksUntilExpiry: number = 26
): StaffMember[] {
  const currentYear = new Date().getFullYear();
  const currentWeek = Math.ceil(
    (new Date().getTime() - new Date(currentYear, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)
  );

  return staff.filter((s) => {
    const weeksUntilEnd =
      (s.contract.endYear - currentYear) * 52 - currentWeek;
    return weeksUntilEnd > 0 && weeksUntilEnd <= weeksUntilExpiry;
  });
}

/**
 * Generate staff member profile
 */
export function generateStaffMember(
  role: StaffRole,
  nationality: StaffNationality = "european"
): StaffMember {
  const experience = Math.floor(Math.random() * 25) + 5;
  const effectiveness = Math.floor(Math.random() * 30) + 60;
  const age = 30 + experience;

  const names: Record<StaffNationality, string[]> = {
    domestic: ["Smith", "Johnson", "Williams", "Brown", "Jones"],
    european: ["García", "Müller", "Rossi", "Dupont", "Schmidt"],
    south_american: ["Silva", "Santos", "Oliveira", "Costa", "Pereira"],
    african: ["Diallo", "Traore", "Sow", "Kone", "Ndiaye"],
    asian: ["Kim", "Lee", "Park", "Chen", "Wang"],
  };

  const firstNames = [
    "John",
    "Carlos",
    "Marco",
    "Luis",
    "Antonio",
    "José",
    "Miguel",
    "Diego",
    "Pablo",
    "Roberto",
  ];

  const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${names[nationality][Math.floor(Math.random() * names[nationality].length)]}`;

  return hireStaffMember(name, role, nationality, age, experience, effectiveness);
}
