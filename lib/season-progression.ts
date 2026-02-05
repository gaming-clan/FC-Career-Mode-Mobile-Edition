export interface SeasonWeek {
  week: number;
  fixtures: Fixture[];
  completed: boolean;
}

export interface Fixture {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  homeTeamName: string;
  awayTeamName: string;
  homeGoals?: number;
  awayGoals?: number;
  date: string;
  status: "upcoming" | "completed" | "live";
}

export interface LeagueStanding {
  position: number;
  clubId: number;
  clubName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface Season {
  year: number;
  currentWeek: number;
  totalWeeks: number;
  standings: LeagueStanding[];
  weeks: SeasonWeek[];
}

export function generateFixtures(clubCount: number): Fixture[] {
  const fixtures: Fixture[] = [];
  let fixtureId = 1;

  const clubs = Array.from({ length: clubCount }, (_, i) => ({
    id: i + 1,
    name: `Team ${i + 1}`,
  }));

  for (let i = 0; i < clubs.length; i++) {
    for (let j = i + 1; j < clubs.length; j++) {
      const homeClub = clubs[i];
      const awayClub = clubs[j];

      fixtures.push({
        id: fixtureId++,
        homeTeamId: homeClub.id,
        awayTeamId: awayClub.id,
        homeTeamName: homeClub.name,
        awayTeamName: awayClub.name,
        date: new Date().toISOString().split("T")[0],
        status: "upcoming",
      });

      fixtures.push({
        id: fixtureId++,
        homeTeamId: awayClub.id,
        awayTeamId: homeClub.id,
        homeTeamName: awayClub.name,
        awayTeamName: homeClub.name,
        date: new Date().toISOString().split("T")[0],
        status: "upcoming",
      });
    }
  }

  return fixtures;
}

export function organizeFixturesByWeek(fixtures: Fixture[], weeksCount: number): SeasonWeek[] {
  const weeks: SeasonWeek[] = [];
  const fixturesPerWeek = Math.ceil(fixtures.length / weeksCount);

  for (let week = 1; week <= weeksCount; week++) {
    const startIndex = (week - 1) * fixturesPerWeek;
    const endIndex = Math.min(week * fixturesPerWeek, fixtures.length);
    const weekFixtures = fixtures.slice(startIndex, endIndex);

    weeks.push({
      week,
      fixtures: weekFixtures,
      completed: false,
    });
  }

  return weeks;
}

export function updateStandings(
  standings: LeagueStanding[],
  homeTeamId: number,
  awayTeamId: number,
  homeGoals: number,
  awayGoals: number
): LeagueStanding[] {
  const newStandings = standings.map((s) => ({ ...s }));

  const homeTeam = newStandings.find((s) => s.clubId === homeTeamId);
  const awayTeam = newStandings.find((s) => s.clubId === awayTeamId);

  if (!homeTeam || !awayTeam) return standings;

  homeTeam.played += 1;
  homeTeam.goalsFor += homeGoals;
  homeTeam.goalsAgainst += awayGoals;

  awayTeam.played += 1;
  awayTeam.goalsFor += awayGoals;
  awayTeam.goalsAgainst += homeGoals;

  if (homeGoals > awayGoals) {
    homeTeam.wins += 1;
    homeTeam.points += 3;
    awayTeam.losses += 1;
  } else if (homeGoals < awayGoals) {
    awayTeam.wins += 1;
    awayTeam.points += 3;
    homeTeam.losses += 1;
  } else {
    homeTeam.draws += 1;
    homeTeam.points += 1;
    awayTeam.draws += 1;
    awayTeam.points += 1;
  }

  newStandings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst);
  });

  return newStandings.map((s, i) => ({
    ...s,
    position: i + 1,
  }));
}

export function advanceWeek(season: Season): Season {
  if (season.currentWeek >= season.totalWeeks) {
    return season;
  }

  const newSeason = { ...season };
  newSeason.currentWeek += 1;
  newSeason.weeks[season.currentWeek - 1].completed = true;

  return newSeason;
}

export function initializeSeason(year: number, clubCount: number): Season {
  const fixtures = generateFixtures(clubCount);
  const weeks = organizeFixturesByWeek(fixtures, 38);

  const standings: LeagueStanding[] = Array.from({ length: clubCount }, (_, i) => ({
    position: i + 1,
    clubId: i + 1,
    clubName: `Team ${i + 1}`,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
  }));

  return {
    year,
    currentWeek: 1,
    totalWeeks: 38,
    standings,
    weeks,
  };
}
