import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

/**
 * Get or create the Drizzle database instance.
 *
 * Lazily creates the instance so local tooling can run without a database.
 * If DATABASE_URL is not set, returns null (database not available).
 *
 * @returns Drizzle database instance or null if not connected
 */
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

/**
 * Insert or update a user in the database.
 *
 * Creates a new user or updates existing one by openId.
 * Admin role is automatically assigned if user's openId matches ENV.ownerOpenId.
 *
 * @param user - User data to insert/update
 * @throws Error if openId is missing or database operation fails
 */
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

/**
 * Get a user by their OAuth ID.
 *
 * @param openId - OAuth open ID
 * @returns User object or undefined if not found
 * @throws Error if database is not available
 */
export async function getUserByOpenId(openId: string) {
  if (!openId || typeof openId !== "string") {
    throw new Error("Invalid openId provided");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * ============================================================================
 * CAREER SAVE OPERATIONS
 * ============================================================================
 */

import {
  careerSaves,
  clubs,
  players,
  managers,
  fixtures,
  matchLineups,
  transferOffers,
  loanDeals,
  trainingSessions,
  seasonObjectives,
  leagueStandings,
  playerDevelopment,
  achievements,
  leagues,
  competitions,
  matchEvents,
  scoutReports,
  type InsertCareerSave,
  type InsertClub,
  type InsertPlayer,
  type InsertManager,
  type InsertFixture,
  type InsertTransferOffer,
  type InsertLoanDeal,
  type InsertTrainingSession,
} from "../drizzle/schema";
import { and, asc, desc } from "drizzle-orm";

export async function createCareerSave(data: InsertCareerSave) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(careerSaves).values(data);
  return (result as any).insertId || 0;
}

export async function getCareerSaves(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(careerSaves)
    .where(eq(careerSaves.userId, userId))
    .orderBy(desc(careerSaves.updatedAt));
}

export async function getCareerSave(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(careerSaves).where(eq(careerSaves.id, id));
  return result[0] || null;
}

export async function updateCareerSave(id: number, data: Partial<InsertCareerSave>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(careerSaves).set(data).where(eq(careerSaves.id, id));
}

export async function deleteCareerSave(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(careerSaves).where(eq(careerSaves.id, id));
}

/**
 * ============================================================================
 * CLUB OPERATIONS
 * ============================================================================
 */

export async function createClub(data: InsertClub) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(clubs).values(data);
  return (result as any).insertId || 0;
}

export async function getClub(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(clubs).where(eq(clubs.id, id));
  return result[0] || null;
}

export async function getClubsByLeague(leagueId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clubs).where(eq(clubs.leagueId, leagueId));
}

export async function updateClub(id: number, data: Partial<InsertClub>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(clubs).set(data).where(eq(clubs.id, id));
}

/**
 * ============================================================================
 * PLAYER OPERATIONS
 * ============================================================================
 */

export async function createPlayer(data: InsertPlayer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(players).values(data);
  return (result as any).insertId || 0;
}

export async function getPlayer(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(players).where(eq(players.id, id));
  return result[0] || null;
}

export async function getClubSquad(clubId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(players).where(eq(players.clubId, clubId));
}

export async function getYouthPlayers(clubId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(players)
    .where(and(eq(players.clubId, clubId), eq(players.isYouthPlayer, true)));
}

export async function updatePlayer(id: number, data: Partial<InsertPlayer>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(players).set(data).where(eq(players.id, id));
}

export async function getPlayersByPosition(clubId: number, position: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(players)
    .where(and(eq(players.clubId, clubId), eq(players.position, position as any)));
}

/**
 * ============================================================================
 * MANAGER OPERATIONS
 * ============================================================================
 */

export async function createManager(data: InsertManager) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(managers).values(data);
  return (result as any).insertId || 0;
}

export async function getManager(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(managers).where(eq(managers.id, id));
  return result[0] || null;
}

export async function getClubManager(clubId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(managers).where(eq(managers.clubId, clubId));
  return result[0] || null;
}

export async function updateManager(id: number, data: Partial<InsertManager>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(managers).set(data).where(eq(managers.id, id));
}

/**
 * ============================================================================
 * FIXTURE & MATCH OPERATIONS
 * ============================================================================
 */

export async function createFixture(data: InsertFixture) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(fixtures).values(data);
  return (result as any).insertId || 0;
}

export async function getFixture(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(fixtures).where(eq(fixtures.id, id));
  return result[0] || null;
}

export async function getWeekFixtures(season: number, week: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(fixtures)
    .where(and(eq(fixtures.season, season), eq(fixtures.week, week)));
}

export async function updateFixture(id: number, data: Partial<InsertFixture>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(fixtures).set(data).where(eq(fixtures.id, id));
}

/**
 * ============================================================================
 * TRANSFER OPERATIONS
 * ============================================================================
 */

export async function createTransferOffer(data: InsertTransferOffer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(transferOffers).values(data);
  return (result as any).insertId || 0;
}

export async function getTransferOffers(playerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(transferOffers)
    .where(eq(transferOffers.playerId, playerId))
    .orderBy(desc(transferOffers.createdAt));
}

export async function updateTransferOffer(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(transferOffers).set({ status: status as any }).where(eq(transferOffers.id, id));
}

export async function createLoanDeal(data: InsertLoanDeal) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(loanDeals).values(data);
  return (result as any).insertId || 0;
}

export async function getActiveLoanDeals(clubId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(loanDeals)
    .where(and(eq(loanDeals.toClubId, clubId), eq(loanDeals.status, "active" as any)));
}

/**
 * ============================================================================
 * TRAINING OPERATIONS
 * ============================================================================
 */

export async function createTrainingSession(data: InsertTrainingSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(trainingSessions).values(data);
  return (result as any).insertId || 0;
}

export async function getPlayerTrainingSessions(playerId: number, season: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(trainingSessions)
    .where(and(eq(trainingSessions.playerId, playerId), eq(trainingSessions.season, season)))
    .orderBy(asc(trainingSessions.week));
}

/**
 * ============================================================================
 * SEASON MANAGEMENT OPERATIONS
 * ============================================================================
 */

export async function getSeasonObjectives(clubId: number, season: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(seasonObjectives)
    .where(and(eq(seasonObjectives.clubId, clubId), eq(seasonObjectives.season, season)));
}

export async function getLeagueStandings(leagueId: number, season: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(leagueStandings)
    .where(and(eq(leagueStandings.leagueId, leagueId), eq(leagueStandings.season, season)))
    .orderBy(asc(leagueStandings.position));
}

/**
 * ============================================================================
 * PLAYER DEVELOPMENT OPERATIONS
 * ============================================================================
 */

export async function getPlayerDevelopmentHistory(playerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(playerDevelopment)
    .where(eq(playerDevelopment.playerId, playerId))
    .orderBy(asc(playerDevelopment.season), asc(playerDevelopment.week));
}

/**
 * ============================================================================
 * ACHIEVEMENT OPERATIONS
 * ============================================================================
 */

export async function getPlayerAchievements(playerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(achievements).where(eq(achievements.playerId, playerId));
}

export async function getManagerAchievements(managerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(achievements).where(eq(achievements.managerId, managerId));
}

/**
 * ============================================================================
 * LEAGUE & COMPETITION OPERATIONS
 * ============================================================================
 */

export async function getLeague(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(leagues).where(eq(leagues.id, id));
  return result[0] || null;
}

export async function getAllLeagues() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leagues);
}

export async function getCompetition(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(competitions).where(eq(competitions.id, id));
  return result[0] || null;
}

export async function getAllCompetitions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(competitions);
}

/**
 * ============================================================================
 * SCOUT REPORT OPERATIONS
 * ============================================================================
 */

export async function getScoutReports(playerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(scoutReports)
    .where(eq(scoutReports.playerId, playerId))
    .orderBy(desc(scoutReports.createdAt));
}
