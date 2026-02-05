CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`playerId` int,
	`managerId` int,
	`clubId` int,
	`season` int NOT NULL,
	`type` enum('player_of_season','golden_boot','golden_glove','assists_leader','debut','100_games','100_goals','league_title','cup_win','promotion') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `career_saves` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`mode` enum('manager','player','sporting_director','create_a_club') NOT NULL,
	`name` varchar(255) NOT NULL,
	`clubId` int,
	`playerId` int,
	`managerId` int,
	`currentSeason` int NOT NULL DEFAULT 1,
	`currentWeek` int NOT NULL DEFAULT 1,
	`totalPlayTime` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `career_saves_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clubs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`nickname` varchar(255),
	`abbreviation` varchar(10) NOT NULL,
	`city` varchar(255) NOT NULL,
	`country` varchar(255) NOT NULL,
	`leagueId` int NOT NULL,
	`divisionTier` int NOT NULL DEFAULT 1,
	`primaryColor` varchar(7) NOT NULL DEFAULT '#0a7ea4',
	`secondaryColor` varchar(7) NOT NULL DEFAULT '#ffffff',
	`tertiaryColor` varchar(7) NOT NULL DEFAULT '#000000',
	`badgeUrl` text,
	`stadiumName` varchar(255) NOT NULL,
	`stadiumCapacity` int NOT NULL DEFAULT 30000,
	`budget` decimal(12,2) NOT NULL DEFAULT '1000000',
	`wage` decimal(12,2) NOT NULL DEFAULT '0',
	`revenue` decimal(12,2) NOT NULL DEFAULT '0',
	`reputation` int NOT NULL DEFAULT 50,
	`fanbase` int NOT NULL DEFAULT 10000,
	`trainingGroundQuality` int NOT NULL DEFAULT 1,
	`medicalFacilityQuality` int NOT NULL DEFAULT 1,
	`youthAcademyQuality` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clubs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `competitions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('domestic_cup','international_cup','international_league') NOT NULL,
	`country` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `competitions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fixtures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`season` int NOT NULL,
	`week` int NOT NULL,
	`competitionId` int NOT NULL,
	`homeClubId` int NOT NULL,
	`awayClubId` int NOT NULL,
	`status` enum('scheduled','in_progress','completed') NOT NULL DEFAULT 'scheduled',
	`matchDate` timestamp,
	`homeGoals` int,
	`awayGoals` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fixtures_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `league_standings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leagueId` int NOT NULL,
	`season` int NOT NULL,
	`clubId` int NOT NULL,
	`position` int NOT NULL,
	`played` int NOT NULL DEFAULT 0,
	`wins` int NOT NULL DEFAULT 0,
	`draws` int NOT NULL DEFAULT 0,
	`losses` int NOT NULL DEFAULT 0,
	`goalsFor` int NOT NULL DEFAULT 0,
	`goalsAgainst` int NOT NULL DEFAULT 0,
	`goalDifference` int NOT NULL DEFAULT 0,
	`points` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `league_standings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leagues` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`country` varchar(255) NOT NULL,
	`tier` int NOT NULL DEFAULT 1,
	`numberOfTeams` int NOT NULL DEFAULT 20,
	`matchesPerSeason` int NOT NULL DEFAULT 38,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leagues_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loan_deals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`playerId` int NOT NULL,
	`fromClubId` int NOT NULL,
	`toClubId` int NOT NULL,
	`season` int NOT NULL,
	`loanStartSeason` int NOT NULL,
	`loanEndSeason` int NOT NULL,
	`buyoutPrice` decimal(12,2),
	`status` enum('active','completed','recalled') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `loan_deals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `managers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(255) NOT NULL,
	`lastName` varchar(255) NOT NULL,
	`nationality` varchar(255) NOT NULL,
	`age` int NOT NULL,
	`clubId` int,
	`yearsExperience` int NOT NULL DEFAULT 0,
	`reputation` int NOT NULL DEFAULT 50,
	`contractStartYear` int NOT NULL,
	`contractEndYear` int NOT NULL,
	`salary` decimal(10,2) NOT NULL DEFAULT '0',
	`totalMatches` int NOT NULL DEFAULT 0,
	`wins` int NOT NULL DEFAULT 0,
	`draws` int NOT NULL DEFAULT 0,
	`losses` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `managers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `match_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fixtureId` int NOT NULL,
	`minute` int NOT NULL,
	`eventType` enum('goal','own_goal','assist','yellow_card','red_card','substitution','injury') NOT NULL,
	`playerId` int NOT NULL,
	`assistPlayerId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `match_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `match_lineups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fixtureId` int NOT NULL,
	`playerId` int NOT NULL,
	`clubId` int NOT NULL,
	`position` varchar(10) NOT NULL,
	`shirtNumber` int NOT NULL,
	`isSubstitute` boolean NOT NULL DEFAULT false,
	`minutesPlayed` int NOT NULL DEFAULT 0,
	`rating` float,
	`goals` int NOT NULL DEFAULT 0,
	`assists` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `match_lineups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `player_appearance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`playerId` int NOT NULL,
	`skinTone` varchar(50) NOT NULL DEFAULT 'medium',
	`hairStyle` varchar(100) NOT NULL DEFAULT 'short',
	`hairColor` varchar(7) NOT NULL DEFAULT '#000000',
	`facialHair` varchar(100) NOT NULL DEFAULT 'none',
	`kitNumber` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `player_appearance_id` PRIMARY KEY(`id`),
	CONSTRAINT `player_appearance_playerId_unique` UNIQUE(`playerId`)
);
--> statement-breakpoint
CREATE TABLE `player_development` (
	`id` int AUTO_INCREMENT NOT NULL,
	`playerId` int NOT NULL,
	`season` int NOT NULL,
	`week` int NOT NULL,
	`overallRating` int NOT NULL,
	`pace` int NOT NULL,
	`shooting` int NOT NULL,
	`passing` int NOT NULL,
	`dribbling` int NOT NULL,
	`defense` int NOT NULL,
	`physical` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `player_development_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(255) NOT NULL,
	`lastName` varchar(255) NOT NULL,
	`position` enum('GK','CB','LB','RB','LWB','RWB','CM','CAM','CDM','LM','RM','CF','ST','LW','RW') NOT NULL,
	`age` int NOT NULL,
	`nationality` varchar(255) NOT NULL,
	`clubId` int,
	`height` int NOT NULL DEFAULT 180,
	`weight` int NOT NULL DEFAULT 75,
	`pace` int NOT NULL DEFAULT 75,
	`shooting` int NOT NULL DEFAULT 75,
	`passing` int NOT NULL DEFAULT 75,
	`dribbling` int NOT NULL DEFAULT 75,
	`defense` int NOT NULL DEFAULT 75,
	`physical` int NOT NULL DEFAULT 75,
	`overallRating` int NOT NULL DEFAULT 75,
	`potential` int NOT NULL DEFAULT 80,
	`form` int NOT NULL DEFAULT 50,
	`morale` int NOT NULL DEFAULT 50,
	`injury` varchar(255),
	`injuryWeeks` int NOT NULL DEFAULT 0,
	`contractStartYear` int NOT NULL,
	`contractEndYear` int NOT NULL,
	`salary` decimal(10,2) NOT NULL DEFAULT '0',
	`appearances` int NOT NULL DEFAULT 0,
	`goals` int NOT NULL DEFAULT 0,
	`assists` int NOT NULL DEFAULT 0,
	`isYouthPlayer` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `players_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scout_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`playerId` int NOT NULL,
	`scoutId` int,
	`season` int NOT NULL,
	`assessment` text,
	`recommendedPrice` decimal(12,2),
	`potentialRating` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scout_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `season_objectives` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clubId` int NOT NULL,
	`season` int NOT NULL,
	`leaguePosition` int,
	`domesticCupTarget` varchar(100),
	`internationalCupTarget` varchar(100),
	`completed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `season_objectives_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `training_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`playerId` int NOT NULL,
	`clubId` int NOT NULL,
	`season` int NOT NULL,
	`week` int NOT NULL,
	`focusAttribute` varchar(50) NOT NULL,
	`improvementAmount` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `training_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transfer_offers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`playerId` int NOT NULL,
	`fromClubId` int NOT NULL,
	`toClubId` int NOT NULL,
	`season` int NOT NULL,
	`offerAmount` decimal(12,2) NOT NULL,
	`status` enum('pending','accepted','rejected','expired') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transfer_offers_id` PRIMARY KEY(`id`)
);
