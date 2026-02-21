/**
 * Financial System
 * Manages club finances, revenue streams, and budgeting
 */

export interface ClubFinances {
  totalBudget: number;
  availableFunds: number;
  weeklyWages: number;
  monthlyRevenue: number;
  
  // Revenue streams
  ticketRevenue: number;
  sponsorshipDeals: number;
  merchandiseSales: number;
  televisionRights: number;
  prizeMoneyEarned: number;
  
  // Expenses
  playerWages: number;
  staffSalaries: number;
  facilityMaintenance: number;
  medicalExpenses: number;
  scoutingBudget: number;
  
  // Financial health
  profitMargin: number;
  debtLevel: number;
  financialStatus: "excellent" | "good" | "stable" | "struggling" | "critical";
}

export interface SponsorshipDeal {
  id: string;
  name: string;
  annualValue: number;
  yearsRemaining: number;
  performanceBonus: number; // Additional money for top 4 finish
  terminationClause: boolean;
}

export interface RevenueProjection {
  month: number;
  ticketRevenue: number;
  sponsorshipRevenue: number;
  merchandiseRevenue: number;
  televisionRevenue: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

/**
 * Calculate ticket revenue based on attendance and ticket price
 */
export function calculateTicketRevenue(
  stadiumCapacity: number,
  attendancePercentage: number,
  ticketPrice: number,
  matchesPerMonth: number
): number {
  const attendance = stadiumCapacity * (attendancePercentage / 100);
  return Math.round(attendance * ticketPrice * matchesPerMonth);
}

/**
 * Calculate merchandise revenue based on fan base and performance
 */
export function calculateMerchandiseRevenue(
  fanBase: number,
  leaguePosition: number,
  revenuePerFan: number
): number {
  let multiplier = 1;
  
  if (leaguePosition <= 4) multiplier = 1.5; // Top 4 boost
  else if (leaguePosition <= 8) multiplier = 1.2;
  else if (leaguePosition > 15) multiplier = 0.7; // Lower league penalty
  
  return Math.round(fanBase * revenuePerFan * multiplier);
}

/**
 * Calculate total player wages
 */
export function calculateTotalPlayerWages(
  players: Array<{
    overallRating: number;
    age: number;
  }>
): number {
  const BASE_WAGE = 2000; // Weekly wage per rating point
  const YOUNG_PLAYER_PREMIUM = 1.3; // Age < 25
  const AGING_PLAYER_DISCOUNT = 0.7; // Age > 30
  
  return players.reduce((total, player) => {
    let wage = player.overallRating * BASE_WAGE;
    
    if (player.age < 25) wage *= YOUNG_PLAYER_PREMIUM;
    else if (player.age > 30) wage *= AGING_PLAYER_DISCOUNT;
    
    return total + wage;
  }, 0) * 52; // Annual wages
}

/**
 * Calculate staff salary costs
 */
export function calculateStaffSalaries(
  managerSalary: number,
  coachingStaff: number,
  medicalStaff: number,
  scoutingStaff: number
): number {
  const coachSalary = 50000; // Annual per coach
  const medicalSalary = 40000; // Annual per staff
  const scoutSalary = 30000; // Annual per scout
  
  return (
    managerSalary +
    coachingStaff * coachSalary +
    medicalStaff * medicalSalary +
    scoutingStaff * scoutSalary
  );
}

/**
 * Calculate facility maintenance costs
 */
export function calculateFacilityMaintenance(
  stadiumCapacity: number,
  trainingGroundQuality: number,
  medicalFacilityQuality: number,
  youthAcademyQuality: number
): number {
  const stadiumCost = (stadiumCapacity / 1000) * 50000; // £50k per 1000 capacity
  const trainingCost = trainingGroundQuality * 100000;
  const medicalCost = medicalFacilityQuality * 75000;
  const academyCost = youthAcademyQuality * 80000;
  
  return Math.round(stadiumCost + trainingCost + medicalCost + academyCost);
}

/**
 * Calculate financial status
 */
export function getFinancialStatus(
  availableFunds: number,
  monthlyExpenses: number
): "excellent" | "good" | "stable" | "struggling" | "critical" {
  const monthsOfFunding = availableFunds / monthlyExpenses;
  
  if (monthsOfFunding > 24) return "excellent";
  if (monthsOfFunding > 12) return "good";
  if (monthsOfFunding > 6) return "stable";
  if (monthsOfFunding > 2) return "struggling";
  return "critical";
}

/**
 * Project revenue for next month
 */
export function projectMonthlyRevenue(
  clubData: {
    stadiumCapacity: number;
    fanBase: number;
    leaguePosition: number;
    sponsorshipDeals: SponsorshipDeal[];
    televisionDeal: number;
    matchesThisMonth: number;
  }
): RevenueProjection {
  const ticketPrice = 50; // £50 per ticket
  const attendancePercentage = Math.min(100, 40 + clubData.leaguePosition * 2); // Better position = more attendance
  const merchandisePerFan = 10; // £10 per fan annually
  
  const ticketRevenue = calculateTicketRevenue(
    clubData.stadiumCapacity,
    attendancePercentage,
    ticketPrice,
    clubData.matchesThisMonth
  );
  
  const merchandiseRevenue = calculateMerchandiseRevenue(
    clubData.fanBase,
    clubData.leaguePosition,
    merchandisePerFan
  ) / 12; // Monthly share
  
  const sponsorshipRevenue = clubData.sponsorshipDeals.reduce(
    (total, deal) => total + deal.annualValue / 12,
    0
  );
  
  const televisionRevenue = clubData.televisionDeal / 12;
  
  const totalRevenue = ticketRevenue + merchandiseRevenue + sponsorshipRevenue + televisionRevenue;
  
  return {
    month: new Date().getMonth() + 1,
    ticketRevenue,
    sponsorshipRevenue,
    merchandiseRevenue,
    televisionRevenue,
    totalRevenue,
    totalExpenses: 0, // Set by caller
    netProfit: 0, // Calculated by caller
  };
}

/**
 * Apply financial penalties/bonuses for performance
 */
export function applyPerformanceFinancials(
  currentBudget: number,
  leaguePosition: number,
  winRate: number,
  sponsorshipDeals: SponsorshipDeal[]
): {
  newBudget: number;
  bonusEarned: number;
  penalties: number;
} {
  let bonusEarned = 0;
  let penalties = 0;
  
  // Prize money bonuses
  const prizeMoneyTable: Record<number, number> = {
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
  };
  
  bonusEarned += prizeMoneyTable[leaguePosition] || 0;
  
  // Sponsorship performance bonuses
  sponsorshipDeals.forEach((deal) => {
    if (leaguePosition <= 4) {
      bonusEarned += deal.performanceBonus;
    }
  });
  
  // Relegation penalty
  if (leaguePosition > 18) {
    penalties += 5000000; // £5M penalty
  }
  
  // Win rate bonus
  if (winRate > 0.6) {
    bonusEarned += 2000000;
  } else if (winRate < 0.3) {
    penalties += 1000000;
  }
  
  return {
    newBudget: currentBudget + bonusEarned - penalties,
    bonusEarned,
    penalties,
  };
}

/**
 * Calculate budget allocation recommendations
 */
export function getBudgetAllocationRecommendations(
  totalBudget: number
): {
  playerWages: number;
  staffSalaries: number;
  facilityMaintenance: number;
  scoutingBudget: number;
  reserve: number;
} {
  return {
    playerWages: Math.round(totalBudget * 0.50), // 50%
    staffSalaries: Math.round(totalBudget * 0.10), // 10%
    facilityMaintenance: Math.round(totalBudget * 0.08), // 8%
    scoutingBudget: Math.round(totalBudget * 0.07), // 7%
    reserve: Math.round(totalBudget * 0.25), // 25%
  };
}

/**
 * Simulate financial month
 */
export function simulateFinancialMonth(
  currentFinances: ClubFinances,
  monthlyRevenue: number,
  monthlyExpenses: number
): ClubFinances {
  const netCashFlow = monthlyRevenue - monthlyExpenses;
  const newAvailableFunds = currentFinances.availableFunds + netCashFlow;
  
  return {
    ...currentFinances,
    availableFunds: newAvailableFunds,
    monthlyRevenue,
    profitMargin: (netCashFlow / monthlyRevenue) * 100,
    financialStatus: getFinancialStatus(newAvailableFunds, monthlyExpenses),
  };
}

/**
 * Get financial health warnings
 */
export function getFinancialWarnings(finances: ClubFinances): string[] {
  const warnings: string[] = [];
  
  if (finances.financialStatus === "critical") {
    warnings.push("⚠️ CRITICAL: Club finances are in severe danger!");
  } else if (finances.financialStatus === "struggling") {
    warnings.push("⚠️ WARNING: Club finances are struggling.");
  }
  
  if (finances.debtLevel > finances.totalBudget * 0.5) {
    warnings.push("💳 High debt levels detected. Consider selling players.");
  }
  
  if (finances.availableFunds < finances.weeklyWages * 4) {
    warnings.push("💰 Low cash reserves. May struggle to pay wages soon.");
  }
  
  if (finances.profitMargin < 0) {
    warnings.push("📉 Operating at a loss. Revenue is below expenses.");
  }
  
  return warnings;
}
