import {
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  mysqlEnum,
  json,
  float,
} from "drizzle-orm/mysql-core";

/**
 * ============================================================================
 * USER & CAREER MANAGEMENT TABLES
 * ============================================================================
 */

// Users table (already exists - framework managed)
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// Career saves - tracks all career saves for all modes
export const careerSaves = mysqlTable("career_saves", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  mode: mysqlEnum("mode", ["manager", "player", "sporting_director", "create_a_club"]).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  clubId: int("clubId"),
  playerId: int("playerId"),
  managerId: int("managerId"),
  currentSeason: int("currentSeason").default(1).notNull(),
  currentWeek: int("currentWeek").default(1).notNull(),
  totalPlayTime: int("totalPlayTime").default(0).notNull(), // in minutes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * ============================================================================
 * CLUB TABLES
 * ============================================================================
 */

// Clubs - core club information
export const clubs = mysqlTable("clubs", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nickname: varchar("nickname", { length: 255 }),
  abbreviation: varchar("abbreviation", { length: 10 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }).notNull(),
  leagueId: int("leagueId").notNull(),
  divisionTier: int("divisionTier").default(1).notNull(), // 1 = top tier, higher = lower
  
  // Branding
  primaryColor: varchar("primaryColor", { length: 7 }).default("#0a7ea4").notNull(),
  secondaryColor: varchar("secondaryColor", { length: 7 }).default("#ffffff").notNull(),
  tertiaryColor: varchar("tertiaryColor", { length: 7 }).default("#000000").notNull(),
  badgeUrl: text("badgeUrl"),
  
  // Stadium
  stadiumName: varchar("stadiumName", { length: 255 }).notNull(),
  stadiumCapacity: int("stadiumCapacity").default(30000).notNull(),
  
  // Finances
  budget: decimal("budget", { precision: 12, scale: 2 }).default("1000000").notNull(),
  wage: decimal("wage", { precision: 12, scale: 2 }).default("0").notNull(),
  revenue: decimal("revenue", { precision: 12, scale: 2 }).default("0").notNull(),
  
  // Reputation & Performance
  reputation: int("reputation").default(50).notNull(), // 0-100
  fanbase: int("fanbase").default(10000).notNull(),
  
  // Facilities
  trainingGroundQuality: int("trainingGroundQuality").default(1).notNull(), // 1-5
  medicalFacilityQuality: int("medicalFacilityQuality").default(1).notNull(), // 1-5
  youthAcademyQuality: int("youthAcademyQuality").default(1).notNull(), // 1-5
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Leagues - competition structure
export const leagues = mysqlTable("leagues", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }).notNull(),
  tier: int("tier").default(1).notNull(), // 1 = top league
  numberOfTeams: int("numberOfTeams").default(20).notNull(),
  matchesPerSeason: int("matchesPerSeason").default(38).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Competitions - cup competitions, international tournaments
export const competitions = mysqlTable("competitions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["domestic_cup", "international_cup", "international_league"]).notNull(),
  country: varchar("country", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * ============================================================================
 * PLAYER TABLES
 * ============================================================================
 */

// Players - all player data
export const players = mysqlTable("players", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  position: mysqlEnum("position", [
    "GK",
    "CB",
    "LB",
    "RB",
    "LWB",
    "RWB",
    "CM",
    "CAM",
    "CDM",
    "LM",
    "RM",
    "CF",
    "ST",
    "LW",
    "RW",
  ]).notNull(),
  age: int("age").notNull(),
  nationality: varchar("nationality", { length: 255 }).notNull(),
  clubId: int("clubId"),
  
  // Physical Attributes
  height: int("height").default(180).notNull(), // cm
  weight: int("weight").default(75).notNull(), // kg
  
  // Player Ratings (0-99)
  pace: int("pace").default(75).notNull(),
  shooting: int("shooting").default(75).notNull(),
  passing: int("passing").default(75).notNull(),
  dribbling: int("dribbling").default(75).notNull(),
  defense: int("defense").default(75).notNull(),
  physical: int("physical").default(75).notNull(),
  
  // Overall Rating
  overallRating: int("overallRating").default(75).notNull(),
  potential: int("potential").default(80).notNull(),
  
  // Status
  form: int("form").default(50).notNull(), // 0-100, affects performance
  morale: int("morale").default(50).notNull(), // 0-100
  injury: varchar("injury", { length: 255 }), // null = no injury
  injuryWeeks: int("injuryWeeks").default(0).notNull(),
  
  // Contract
  contractStartYear: int("contractStartYear").notNull(),
  contractEndYear: int("contractEndYear").notNull(),
  salary: decimal("salary", { precision: 10, scale: 2 }).default("0").notNull(),
  
  // Career Stats
  appearances: int("appearances").default(0).notNull(),
  goals: int("goals").default(0).notNull(),
  assists: int("assists").default(0).notNull(),
  
  // Youth Academy
  isYouthPlayer: boolean("isYouthPlayer").default(false).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Player Appearance Customization (for player career mode)
export const playerAppearance = mysqlTable("player_appearance", {
  id: int("id").autoincrement().primaryKey(),
  playerId: int("playerId").notNull().unique(),
  skinTone: varchar("skinTone", { length: 50 }).default("medium").notNull(),
  hairStyle: varchar("hairStyle", { length: 100 }).default("short").notNull(),
  hairColor: varchar("hairColor", { length: 7 }).default("#000000").notNull(),
  facialHair: varchar("facialHair", { length: 100 }).default("none").notNull(),
  kitNumber: int("kitNumber").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Player Development History (track progression over seasons)
export const playerDevelopment = mysqlTable("player_development", {
  id: int("id").autoincrement().primaryKey(),
  playerId: int("playerId").notNull(),
  season: int("season").notNull(),
  week: int("week").notNull(),
  overallRating: int("overallRating").notNull(),
  pace: int("pace").notNull(),
  shooting: int("shooting").notNull(),
  passing: int("passing").notNull(),
  dribbling: int("dribbling").notNull(),
  defense: int("defense").notNull(),
  physical: int("physical").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * ============================================================================
 * MANAGER TABLES
 * ============================================================================
 */

// Managers - manager profiles
export const managers = mysqlTable("managers", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  nationality: varchar("nationality", { length: 255 }).notNull(),
  age: int("age").notNull(),
  clubId: int("clubId"),
  
  // Experience
  yearsExperience: int("yearsExperience").default(0).notNull(),
  reputation: int("reputation").default(50).notNull(), // 0-100
  
  // Contract
  contractStartYear: int("contractStartYear").notNull(),
  contractEndYear: int("contractEndYear").notNull(),
  salary: decimal("salary", { precision: 10, scale: 2 }).default("0").notNull(),
  
  // Career Stats
  totalMatches: int("totalMatches").default(0).notNull(),
  wins: int("wins").default(0).notNull(),
  draws: int("draws").default(0).notNull(),
  losses: int("losses").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * ============================================================================
 * MATCH TABLES
 * ============================================================================
 */

// Fixtures - scheduled matches
export const fixtures = mysqlTable("fixtures", {
  id: int("id").autoincrement().primaryKey(),
  season: int("season").notNull(),
  week: int("week").notNull(),
  competitionId: int("competitionId").notNull(),
  homeClubId: int("homeClubId").notNull(),
  awayClubId: int("awayClubId").notNull(),
  
  // Match Status
  status: mysqlEnum("status", ["scheduled", "in_progress", "completed"]).default("scheduled").notNull(),
  matchDate: timestamp("matchDate"),
  
  // Result
  homeGoals: int("homeGoals"),
  awayGoals: int("awayGoals"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Match Events - goals, cards, substitutions, etc.
export const matchEvents = mysqlTable("match_events", {
  id: int("id").autoincrement().primaryKey(),
  fixtureId: int("fixtureId").notNull(),
  minute: int("minute").notNull(),
  eventType: mysqlEnum("eventType", [
    "goal",
    "own_goal",
    "assist",
    "yellow_card",
    "red_card",
    "substitution",
    "injury",
  ]).notNull(),
  playerId: int("playerId").notNull(),
  assistPlayerId: int("assistPlayerId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Match Lineups - who played in each match
export const matchLineups = mysqlTable("match_lineups", {
  id: int("id").autoincrement().primaryKey(),
  fixtureId: int("fixtureId").notNull(),
  playerId: int("playerId").notNull(),
  clubId: int("clubId").notNull(),
  position: varchar("position", { length: 10 }).notNull(),
  shirtNumber: int("shirtNumber").notNull(),
  isSubstitute: boolean("isSubstitute").default(false).notNull(),
  minutesPlayed: int("minutesPlayed").default(0).notNull(),
  rating: float("rating"), // 0-10
  goals: int("goals").default(0).notNull(),
  assists: int("assists").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * ============================================================================
 * TRANSFER TABLES
 * ============================================================================
 */

// Transfer Offers - buy/sell offers
export const transferOffers = mysqlTable("transfer_offers", {
  id: int("id").autoincrement().primaryKey(),
  playerId: int("playerId").notNull(),
  fromClubId: int("fromClubId").notNull(),
  toClubId: int("toClubId").notNull(),
  season: int("season").notNull(),
  
  // Offer Details
  offerAmount: decimal("offerAmount", { precision: 12, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "accepted", "rejected", "expired"]).default("pending").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Loan Deals - player loans
export const loanDeals = mysqlTable("loan_deals", {
  id: int("id").autoincrement().primaryKey(),
  playerId: int("playerId").notNull(),
  fromClubId: int("fromClubId").notNull(),
  toClubId: int("toClubId").notNull(),
  season: int("season").notNull(),
  
  // Loan Terms
  loanStartSeason: int("loanStartSeason").notNull(),
  loanEndSeason: int("loanEndSeason").notNull(),
  buyoutPrice: decimal("buyoutPrice", { precision: 12, scale: 2 }),
  
  status: mysqlEnum("status", ["active", "completed", "recalled"]).default("active").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Scout Reports - scouting data for players
export const scoutReports = mysqlTable("scout_reports", {
  id: int("id").autoincrement().primaryKey(),
  playerId: int("playerId").notNull(),
  scoutId: int("scoutId"),
  season: int("season").notNull(),
  
  // Scout Assessment
  assessment: text("assessment"),
  recommendedPrice: decimal("recommendedPrice", { precision: 12, scale: 2 }),
  potentialRating: int("potentialRating"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * ============================================================================
 * SEASON & COMPETITION TABLES
 * ============================================================================
 */

// Season Objectives - board expectations for the season
export const seasonObjectives = mysqlTable("season_objectives", {
  id: int("id").autoincrement().primaryKey(),
  clubId: int("clubId").notNull(),
  season: int("season").notNull(),
  
  // Objectives
  leaguePosition: int("leaguePosition"), // target position
  domesticCupTarget: varchar("domesticCupTarget", { length: 100 }), // e.g., "Win", "Quarter-Finals"
  internationalCupTarget: varchar("internationalCupTarget", { length: 100 }),
  
  // Progress
  completed: boolean("completed").default(false).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// League Standings - current league table
export const leagueStandings = mysqlTable("league_standings", {
  id: int("id").autoincrement().primaryKey(),
  leagueId: int("leagueId").notNull(),
  season: int("season").notNull(),
  clubId: int("clubId").notNull(),
  
  position: int("position").notNull(),
  played: int("played").default(0).notNull(),
  wins: int("wins").default(0).notNull(),
  draws: int("draws").default(0).notNull(),
  losses: int("losses").default(0).notNull(),
  goalsFor: int("goalsFor").default(0).notNull(),
  goalsAgainst: int("goalsAgainst").default(0).notNull(),
  goalDifference: int("goalDifference").default(0).notNull(),
  points: int("points").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * ============================================================================
 * TRAINING & DEVELOPMENT TABLES
 * ============================================================================
 */

// Training Sessions - player training history
export const trainingSessions = mysqlTable("training_sessions", {
  id: int("id").autoincrement().primaryKey(),
  playerId: int("playerId").notNull(),
  clubId: int("clubId").notNull(),
  season: int("season").notNull(),
  week: int("week").notNull(),
  
  // Training Focus
  focusAttribute: varchar("focusAttribute", { length: 50 }).notNull(), // pace, shooting, etc.
  improvementAmount: int("improvementAmount").default(1).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * ============================================================================
 * ACHIEVEMENT & AWARDS TABLES
 * ============================================================================
 */

// Achievements - player and manager achievements
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  playerId: int("playerId"),
  managerId: int("managerId"),
  clubId: int("clubId"),
  season: int("season").notNull(),
  
  // Achievement Type
  type: mysqlEnum("type", [
    "player_of_season",
    "golden_boot",
    "golden_glove",
    "assists_leader",
    "debut",
    "100_games",
    "100_goals",
    "league_title",
    "cup_win",
    "promotion",
  ]).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * ============================================================================
 * EXPORT TYPES
 * ============================================================================
 */

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type CareerSave = typeof careerSaves.$inferSelect;
export type InsertCareerSave = typeof careerSaves.$inferInsert;
export type Club = typeof clubs.$inferSelect;
export type InsertClub = typeof clubs.$inferInsert;
export type League = typeof leagues.$inferSelect;
export type Competition = typeof competitions.$inferSelect;
export type Player = typeof players.$inferSelect;
export type InsertPlayer = typeof players.$inferInsert;
export type PlayerAppearance = typeof playerAppearance.$inferSelect;
export type PlayerDevelopment = typeof playerDevelopment.$inferSelect;
export type Manager = typeof managers.$inferSelect;
export type InsertManager = typeof managers.$inferInsert;
export type Fixture = typeof fixtures.$inferSelect;
export type InsertFixture = typeof fixtures.$inferInsert;
export type MatchEvent = typeof matchEvents.$inferSelect;
export type MatchLineup = typeof matchLineups.$inferSelect;
export type TransferOffer = typeof transferOffers.$inferSelect;
export type InsertTransferOffer = typeof transferOffers.$inferInsert;
export type LoanDeal = typeof loanDeals.$inferSelect;
export type InsertLoanDeal = typeof loanDeals.$inferInsert;
export type ScoutReport = typeof scoutReports.$inferSelect;
export type SeasonObjective = typeof seasonObjectives.$inferSelect;
export type LeagueStanding = typeof leagueStandings.$inferSelect;
export type TrainingSession = typeof trainingSessions.$inferSelect;
export type InsertTrainingSession = typeof trainingSessions.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;
