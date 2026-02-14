/// <reference path="../types.global.d.ts" />

/**
 * Database Seeding Script
 * Populates the database with realistic Premier League data
 *
 * Usage: tsx scripts/seed-database.ts
 */

// @ts-ignore - drizzle-orm/mysql2 is installed but not at compile time
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema";
import { PREMIER_LEAGUE_CLUBS, PREMIER_LEAGUE_PLAYERS, type ClubSeed, type PlayerSeed } from "./seed-data";

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const db = drizzle(process.env.DATABASE_URL, { schema });

  console.log("🌱 Starting database seed...\n");

  try {
    // Step 1: Create Premier League
    console.log("📌 Creating Premier League...");
    const leagueResult = await db.insert(schema.leagues).values({
      name: "Premier League",
      country: "England",
      tier: 1,
      numberOfTeams: 20,
      matchesPerSeason: 38,
    });
    console.log("✅ Premier League created\n");

    // Get the league ID (would be 1 if fresh database)
    const leagueId = 1;

    // Step 2: Create clubs
    console.log("📌 Creating clubs...");
    const clubMap = new Map<string, number>();

    for (const clubSeed of PREMIER_LEAGUE_CLUBS) {
      const result = await db.insert(schema.clubs).values({
        name: clubSeed.name,
        nickname: clubSeed.nickname,
        abbreviation: clubSeed.abbreviation,
        city: clubSeed.city,
        country: clubSeed.country,
        leagueId: leagueId,
        divisionTier: 1,
        primaryColor: clubSeed.primaryColor,
        secondaryColor: clubSeed.secondaryColor,
        tertiaryColor: clubSeed.tertiaryColor,
        stadiumName: clubSeed.stadiumName,
        stadiumCapacity: clubSeed.stadiumCapacity,
        budget: "5000000.00",
        wage: "0.00",
        revenue: "0.00",
        reputation: clubSeed.reputation,
        fanbase: Math.floor(clubSeed.stadiumCapacity * 0.8),
        trainingGroundQuality: clubSeed.trainingGroundQuality,
        medicalFacilityQuality: clubSeed.medicalFacilityQuality,
        youthAcademyQuality: clubSeed.youthAcademyQuality,
      });

      // Store the club ID for later reference
      const allClubs = await db.select().from(schema.clubs).where(
        (clubs: Record<string, unknown>) => clubs.name === clubSeed.name
      );
      if (allClubs.length > 0) {
        clubMap.set(clubSeed.name, allClubs[0].id);
      }
    }
    console.log(`✅ ${PREMIER_LEAGUE_CLUBS.length} clubs created\n`);

    // Step 3: Create players and assign them to clubs
    console.log("📌 Creating players...");
    let playersCreated = 0;

    for (const playerSeed of PREMIER_LEAGUE_PLAYERS) {
      const clubId = clubMap.get(playerSeed.clubName);

      if (!clubId) {
        console.warn(`⚠️  Club not found for player: ${playerSeed.firstName} ${playerSeed.lastName}`);
        continue;
      }

      await db.insert(schema.players).values({
        firstName: playerSeed.firstName,
        lastName: playerSeed.lastName,
        position: playerSeed.position,
        age: playerSeed.age,
        nationality: playerSeed.nationality,
        clubId: clubId,
        height: playerSeed.height,
        weight: playerSeed.weight,
        pace: playerSeed.pace,
        shooting: playerSeed.shooting,
        passing: playerSeed.passing,
        dribbling: playerSeed.dribbling,
        defense: playerSeed.defense,
        physical: playerSeed.physical,
        overallRating: playerSeed.overallRating,
        potential: playerSeed.potential,
        form: 50,
        morale: 50,
        injury: null,
        injuryWeeks: 0,
        contractStartYear: 2024,
        contractEndYear: playerSeed.contractEndYear,
        salary: "100000.00",
        appearances: Math.floor(Math.random() * 200),
        goals: Math.floor(Math.random() * 50),
        assists: Math.floor(Math.random() * 30),
        isYouthPlayer: playerSeed.age < 21,
      });

      playersCreated++;
    }
    console.log(`✅ ${playersCreated} players created\n`);

    // Step 4: Create player appearance for each player
    console.log("📌 Creating player appearances...");
    const allPlayers = await db.select().from(schema.players);
    let appearancesCreated = 0;

    for (const player of allPlayers) {
      const hairColors = ["#000000", "#8B4513", "#FFD700", "#FF6347", "#FFFFFF"];
      const randomHairColor = hairColors[Math.floor(Math.random() * hairColors.length)];
      const kitNumbers = Array.from({ length: 23 }, (_, i) => i + 1); // 1-23
      const randomKit = kitNumbers[Math.floor(Math.random() * kitNumbers.length)];

      try {
        await db.insert(schema.playerAppearance).values({
          playerId: player.id,
          skinTone: "medium",
          hairStyle: "short",
          hairColor: randomHairColor,
          facialHair: Math.random() > 0.5 ? "stubble" : "none",
          kitNumber: randomKit,
        });
        appearancesCreated++;
      } catch (error) {
        // Appearance might already exist, continue
      }
    }
    console.log(`✅ ${appearancesCreated} player appearances created\n`);

    console.log("🎉 Database seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - League: 1 (Premier League)`);
    console.log(`   - Clubs: ${PREMIER_LEAGUE_CLUBS.length}`);
    console.log(`   - Players: ${playersCreated}`);
    console.log(`   - Player Appearances: ${appearancesCreated}`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed().catch(console.error);
