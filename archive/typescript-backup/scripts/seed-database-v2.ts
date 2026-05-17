/// <reference path="../types.global.d.ts" />

/**
 * Database Seeding Script - Comprehensive Leagues & Players
 * Populates database with realistic data from 8 major leagues
 *  
 * Usage: tsx scripts/seed-database-v2.ts
 */

// Mock types for checking - actual drizzle import will be handled at runtime
type DbType = any;

/**
 * Main seeding function
 */
async function seedDatabase(): Promise<void> {
  try {
    // Validate environment
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error("❌ DATABASE_URL environment variable not set");
      process.exit(1);
    }

    console.log("🌱 Starting comprehensive database seed...\n");

    // Import at runtime
    // @ts-ignore - drizzle-orm modules installed but not at compile time
    const { drizzle } = await import("drizzle-orm/mysql2");
    const schema = await import("../drizzle/schema");
    const seedData = await import("./comprehensive-seed-data");

    // Initialize database
    const db = drizzle(dbUrl, { schema }) as DbType;

    let leagueCount = 0;
    let clubCount = 0;
    let playerCount = 0;
    let appearanceCount = 0;

    // ============================================
    // LEAGUES
    // ============================================
    console.log("📌 Creating leagues...");
    for (const league of seedData.LEAGUES) {
      try {
        await db.insert(schema.leagues).values({
          name: league.name,
          country: league.country,
          tier: league.tier,
          numberOfTeams: league.numberOfTeams,
          matchesPerSeason: league.matchesPerSeason,
        });
        leagueCount++;
      } catch (error) {
        // League might already exist
      }
    }
    console.log(`✅ ${leagueCount} leagues created\n`);

    // ============================================
    // CLUBS - All Premier League
    // ============================================
    console.log("📌 Creating Premier League clubs...");
    const clubMap = new Map<string, number>();
    let clubId = 1;

    for (const club of seedData.PREMIER_LEAGUE_CLUBS) {
      try {
        await db.insert(schema.clubs).values({
          name: club.name,
          nickname: club.nickname,
          abbreviation: club.abbreviation,
          city: club.city,
          country: club.country,
          leagueId: 1,
          divisionTier: 1,
          primaryColor: club.primaryColor,
          secondaryColor: club.secondaryColor,
          stadium: club.stadium,
          stadiumCapacity: club.stadiumCapacity,
          founded: club.founded,
          domesticTitles: club.domesticTitles,
          europeanTitles: club.europeanTitles,
          budget: club.budget,
          weeklyWages: club.weeklyWages,
          facilities: club.facilities,
        });
        clubMap.set(club.name, clubId);
        clubId++;
        clubCount++;
      } catch (error) {
        // Club might already exist
      }
    }
    console.log(`✅ ${clubCount} Premier League clubs created\n`);

    // ============================================
    // La Liga CLUBS
    // ============================================
    console.log("📌 Creating La Liga clubs...");
    for (const club of seedData.LA_LIGA_CLUBS) {
      try {
        await db.insert(schema.clubs).values({
          name: club.name,
          nickname: club.nickname,
          abbreviation: club.abbreviation,
          city: club.city,
          country: club.country,
          leagueId: 2,
          divisionTier: 1,
          primaryColor: club.primaryColor,
          secondaryColor: club.secondaryColor,
          stadium: club.stadium,
          stadiumCapacity: club.stadiumCapacity,
          founded: club.founded,
          domesticTitles: club.domesticTitles,
          europeanTitles: club.europeanTitles,
          budget: club.budget,
          weeklyWages: club.weeklyWages,
          facilities: club.facilities,
        });
        clubMap.set(club.name, clubId);
        clubId++;
        clubCount++;
      } catch (error) {
        // Club might already exist
      }
    }
    console.log(`✅ La Liga clubs created (${clubCount} total)\n`);

    // ============================================
    // SERIE A CLUBS
    // ============================================
    console.log("📌 Creating Serie A clubs...");
    for (const club of seedData.SERIE_A_CLUBS) {
      try {
        await db.insert(schema.clubs).values({
          name: club.name,
          nickname: club.nickname,
          abbreviation: club.abbreviation,
          city: club.city,
          country: club.country,
          leagueId: 3,
          divisionTier: 1,
          primaryColor: club.primaryColor,
          secondaryColor: club.secondaryColor,
          stadium: club.stadium,
          stadiumCapacity: club.stadiumCapacity,
          founded: club.founded,
          domesticTitles: club.domesticTitles,
          europeanTitles: club.europeanTitles,
          budget: club.budget,
          weeklyWages: club.weeklyWages,
          facilities: club.facilities,
        });
        clubMap.set(club.name, clubId);
        clubId++;
        clubCount++;
      } catch (error) {
        // Club might already exist
      }
    }
    console.log(`✅ Serie A clubs created (${clubCount} total)\n`);

    // ============================================
    // PLAYERS
    // ============================================
    console.log("📌 Creating players...");

    // Combine all player arrays
    const allPlayers = [
      ...seedData.PREMIER_LEAGUE_PLAYERS,
      ...seedData.LA_LIGA_PLAYERS,
      ...seedData.SERIE_A_PLAYERS,
      ...seedData.BUNDESLIGA_PLAYERS,
      ...seedData.LIGUE_1_PLAYERS,
    ];

    let playerId = 1;

    for (const player of allPlayers) {
      try {
        const clubId = clubMap.get(player.club);
        if (!clubId) {
          console.warn(`⚠️ Club not found for player: ${player.firstName} ${player.lastName}`);
          continue;
        }

        await db.insert(schema.players).values({
          firstName: player.firstName,
          lastName: player.lastName,
          age: player.age,
          nationality: player.nationality,
          position: player.position,
          overallRating: player.overallRating,
          potential: player.potential,
          pace: player.pace,
          shooting: player.shooting,
          passing: player.passing,
          dribbling: player.dribbling,
          defense: player.defense,
          physical: player.physical,
          height: player.height,
          weight: player.weight,
          clubId: clubId,
          contractEndYear: player.contractEndYear,
          isYouthPlayer: player.isYouthPlayer,
          preferredFoot: player.preferredFoot,
          injuryWeeks: 0,
        });

        // Create player appearance record
        try {
          await db.insert(schema.playerAppearance).values({
            playerId: playerId,
            hairColor: Math.random() > 0.5 ? "black" : "brown",
            skinTone: "medium",
            facialHair: Math.random() > 0.5,
            kitNumber: 1 + Math.floor(Math.random() * 23),
          });
          appearanceCount++;
        } catch (error) {
          // Ignore appearance creation errors
        }

        playerId++;
        playerCount++;
      } catch (error) {
        // Player might already exist
        console.warn(`⚠️ Error creating player: ${player.firstName} ${player.lastName}`);
      }
    }

    console.log(`✅ ${playerCount} players created\n`);
    console.log(`✅ ${appearanceCount} player appearances created\n`);

    console.log("=".repeat(50));
    console.log("📊 Seed Summary:");
    console.log(`  Leagues: ${leagueCount}`);
    console.log(`  Clubs: ${clubCount}`);
    console.log(`  Players: ${playerCount}`);
    console.log(`  Appearances: ${appearanceCount}`);
    console.log("=".repeat(50));
    console.log("\n✨ Database seeding complete!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
