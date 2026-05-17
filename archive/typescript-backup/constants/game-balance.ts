/**
 * Game Balance and Tuning Constants
 * Central location for all game balance parameters
 */

/**
 * Player rating constants
 */
export const PLAYER_RATING = {
  MIN: 40,
  MAX: 99,
  WORLD_CLASS: 88,
  ELITE: 80,
  GREAT: 75,
  PROFESSIONAL: 70,
  EXPERIENCED: 65,
  COMPETENT: 60,
  DEVELOPING: 50,
} as const;

/**
 * Player development rates (per year)
 */
export const DEVELOPMENT_RATES = {
  YOUNG_ACADEMY: (potential: number, current: number) => (potential - current) * 0.15,
  YOUNG_TALENTED: (potential: number, current: number) => (potential - current) * 0.12,
  PEAK_YEARS: (potential: number, current: number) => (potential - current) * 0.05,
  MAINTENANCE: (potential: number, current: number) => (potential - current) * 0.02,
  DECLINE: () => -0.8,
} as const;

/**
 * Age brackets for player development
 */
export const AGE_BRACKETS = {
  ACADEMY: { min: 16, max: 20 },
  YOUNG: { min: 21, max: 23 },
  DEVELOPING: { min: 24, max: 27 },
  PEAK: { min: 28, max: 31 },
  VETERAN: { min: 32, max: 35 },
  DECLINING: { min: 36, max: 50 },
} as const;

/**
 * Match event probabilities
 */
export const MATCH_PROBABILITIES = {
  YELLOW_CARD_PER_MATCH: 2.5, // Average cards per team
  RED_CARD_PER_MATCH: 0.15, // Per team
  INJURY_PER_MATCH: 0.2,
  OWN_GOAL: 0.01,
} as const;

/**
 * Morale modifiers
 */
export const MORALE_CHANGES = {
  WIN_HOME: 15,
  WIN_AWAY: 20,
  DRAW: 5,
  LOSS_HOME: -15,
  LOSS_AWAY: -20,
  UPSET_WIN_BONUS: 10,
  SURPRISING_LOSS_PENALTY: -15,
  STREAK_BONUS_PER_MATCH: 2,
  LOSING_STREAK_PENALTY: -3,
} as const;

/**
 * Form changes
 */
export const FORM_MODIFIERS = {
  MAX_FORM: 100,
  MIN_FORM: 0,
  GOAL_IMPACT: 15,
  ASSIST_IMPACT: 10,
  CLEAN_SHEET: 8,
  RED_CARD: -30,
  YELLOW_CARD: -10,
  INJURY: -20,
  WEEKLY_DECAY: -2,
} as const;

/**
 * Contract negotiation
 */
export const CONTRACT = {
  MIN_DURATION: 1,
  MAX_DURATION: 5,
  STANDARD_DURATION: 3,
  RENEWAL_THRESHOLD: 1, // Years until contract ends
  WAGE_INCREASE_PER_RATING: 2000, // Weekly wage per rating point
  YOUNG_PLAYER_PREMIUM: 1.3, // Age < 25
  AGING_PLAYER_DISCOUNT: 0.7, // Age > 30
} as const;

/**
 * Transfer market values
 */
export const TRANSFER = {
  BASE_VALUE_MULTIPLIER: 1000,
  YOUNG_PROSPECT_POTENTIAL_BOOST: 1.2,
  HIGH_POTENTIAL_THRESHOLD: 85,
  OLD_PLAYER_THRESHOLD: 32,
  VETERAN_DISCOUNT: 0.5,
  EXPERIENCED_DISCOUNT: 0.7,
  SHORT_CONTRACT_DISCOUNT: 0.5,
  SHORT_CONTRACT_THRESHOLD: 1,
  ROUNDING: 100000, // Round to nearest 100k
} as const;

/**
 * Squad size requirements
 */
export const SQUAD_SIZE = {
  MIN_OUTFIELD: 14,
  MIN_GOALKEEPERS: 2,
  MAX_SQUAD: 25,
  IDEAL_OUTFIELD: 20,
  MIN_BENCH_PLAYERS: 5,
} as const;

/**
 * Formation constants
 */
export const FORMATIONS = {
  DEFENSIVE: { code: "4-2-3-1", def: 4, mid: 5, fwd: 1 },
  BALANCED: { code: "4-3-3", def: 4, mid: 3, fwd: 3 },
  ATTACKING: { code: "4-1-4-1", def: 4, mid: 5, fwd: 1 },
  WINGBACK: { code: "3-5-2", def: 3, mid: 5, fwd: 2 },
  ULTRA_DEFENSIVE: { code: "5-3-2", def: 5, mid: 3, fwd: 2 },
  ULTRA_ATTACKING: { code: "3-4-3", def: 3, mid: 4, fwd: 3 },
} as const;

/**
 * Position-specific stat importance
 */
export const POSITION_STAT_WEIGHTS: Record<
  string,
  {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defense: number;
    physical: number;
  }
> = {
  GK: { pace: 0.1, shooting: 0, passing: 0.15, dribbling: 0, defense: 0.3, physical: 0.45 },
  CB: { pace: 0.1, shooting: 0.05, passing: 0.2, dribbling: 0.05, defense: 0.45, physical: 0.15 },
  LB: { pace: 0.2, shooting: 0.05, passing: 0.2, dribbling: 0.15, defense: 0.25, physical: 0.15 },
  RB: { pace: 0.2, shooting: 0.05, passing: 0.2, dribbling: 0.15, defense: 0.25, physical: 0.15 },
  CDM: { pace: 0.15, shooting: 0.05, passing: 0.25, dribbling: 0.1, defense: 0.3, physical: 0.15 },
  CM: { pace: 0.15, shooting: 0.1, passing: 0.3, dribbling: 0.15, defense: 0.15, physical: 0.15 },
  CAM: { pace: 0.15, shooting: 0.15, passing: 0.35, dribbling: 0.25, defense: 0.05, physical: 0.05 },
  LW: { pace: 0.25, shooting: 0.15, passing: 0.15, dribbling: 0.3, defense: 0.05, physical: 0.1 },
  RW: { pace: 0.25, shooting: 0.15, passing: 0.15, dribbling: 0.3, defense: 0.05, physical: 0.1 },
  ST: { pace: 0.15, shooting: 0.35, passing: 0.15, dribbling: 0.2, defense: 0.05, physical: 0.1 },
  CF: { pace: 0.2, shooting: 0.3, passing: 0.2, dribbling: 0.15, defense: 0.05, physical: 0.1 },
} as const;

/**
 * Expected match stats constants
 */
export const MATCH_STATS = {
  POSSESSION_EFFECT: 0.01, // 1% per possession point
  FORMATION_ATTACKING_BOOST: 1.3,
  FORMATION_DEFENSIVE_REDUCTION: 0.6,
  FORM_MORALE_EFFECT_RANGE: 0.2, // ±20%
  HOME_FIELD_ADVANTAGE: 1.1, // 10% boost
  NEUTRAL_VENUE: 1.0,
  AVERAGE_GAME_DURATION: 90,
  INJURY_TIME_MIN: 1,
  INJURY_TIME_MAX: 10,
} as const;

/**
 * Budget management
 */
export const BUDGET = {
  WAGE_BUDGET_PERCENTAGE: 0.6, // 60% of budget goes to wages
  YOUTH_INVESTMENT_PERCENTAGE: 0.1, // 10% to youth development
  FACILITIES_MAINTENANCE: 0.05, // 5% to stadium/training
  RESERVE_PERCENTAGE: 0.25, // Keep 25% in reserve
  TRANSFER_PROFIT_TAX: 0.15, // 15% tax on transfer profits
} as const;

/**
 * Season structure
 */
export const SEASON = {
  MATCHDAYS_PER_SEASON: 38,
  CUPS_PER_SEASON: 5, // FA Cup, League Cup, European, etc.
  TOTAL_POSSIBLE_MATCHES: 60,
  MATCHES_PER_MATCHDAY: 10,
  TRANSFER_WINDOW_SUMMER: { start: 6, end: 9 }, // June - September (month)
  TRANSFER_WINDOW_WINTER: { start: 1, end: 2 }, // January - February
} as const;

/**
 * League table constants
 */
export const LEAGUE = {
  PROMOTION_SPOTS: 2,
  PLAYOFF_SPOTS: 2,
  PLAYOFF_POSITIONS: { start: 3, end: 6 },
  RELEGATION_SPOTS: 3,
  TEAMS_PER_LEAGUE: 20,
  DOUBLE_HEADER: true, // Play each team home and away
} as const;

/**
 * Youth academy constants
 */
export const YOUTH_ACADEMY = {
  FACILITY_LEVELS: { min: 1, max: 5 },
  DEVELOPMENT_BOOST_PER_LEVEL: 0.05, // 5% per level
  ACADEMY_INTAKE_AGE: 16,
  PROMOTION_READINESS_THRESHOLD: 70,
  YOUTH_CONTRACT_DURATION: 3,
  HOMEGROWN_REGISTRATION_AGE: 21,
} as const;

/**
 * Manager attributes
 */
export const MANAGER = {
  MAX_EXPERIENCE: 100,
  MAX_TACTICS: 100,
  MAX_MORALE_INFLUENCE: 20, // Points morale can be influenced
  REPUTATION_GAIN_PER_CUP_WIN: 10,
  REPUTATION_GAIN_PER_LEAGUE_WIN: 5,
  REPUTATION_LOSS_PER_LOSS: -2,
  REPUTATION_LOSS_RELEGATION: -50,
} as const;

/**
 * Injury mechanics
 */
export const INJURY = {
  MINOR_WEEKS: { min: 1, max: 2 },
  MODERATE_WEEKS: { min: 3, max: 6 },
  SERIOUS_WEEKS: { min: 7, max: 12 },
  SEVERE_WEEKS: { min: 13, max: 24 },
  CAREER_THREATENING_THRESHOLD: 30,
  MATCH_INJURY_CHANCE: 0.02,
  FATIGUE_INJURY_CHANCE: 0.01,
} as const;

/**
 * Training and facility effects
 */
export const TRAINING = {
  FACILITY_LEVEL_BONUS: [0, 0.02, 0.04, 0.06, 0.08, 0.1], // Per facility level
  INTENSE_TRAINING_BOOST: 0.15, // 15% faster development
  INTENSE_TRAINING_INJURY_RISK: 0.03, // 3% injury chance
  REST_INJURY_RECOVERY: 0.25, // 25% better recovery
  FRIENDSHIP_BONUS: 0.05, // Players developing faster together
} as const;

/**
 * Performance rating scale
 */
export const MATCH_RATING = {
  TERRIBLE: { min: 0, max: 3, description: "Terrible" },
  POOR: { min: 3, max: 5, description: "Poor" },
  AVERAGE: { min: 5, max: 6.5, description: "Average" },
  GOOD: { min: 6.5, max: 7.5, description: "Good" },
  VERY_GOOD: { min: 7.5, max: 8.5, description: "Very Good" },
  EXCELLENT: { min: 8.5, max: 9.5, description: "Excellent" },
  OUTSTANDING: { min: 9.5, max: 10, description: "Outstanding" },
} as const;

/**
 * Finance constants
 */
export const FINANCE = {
  TICKET_REVENUE_PER_SPECTATOR: 25, // £ per ticket
  MERCHANDISE_REVENUE_PER_SPECTATOR: 5,
  AVERAGE_WAGE_MULTIPLIER: 2000, // Weekly wage × rating
  SPONSORSHIP_BONUS_PER_RATING: 100000, // Annual bonus
  TV_DEAL_BASE: 5000000, // Annual TV money
  EUROPEAN_PARTICIPATION_BONUS: 1000000, // Per qualifying round
} as const;
