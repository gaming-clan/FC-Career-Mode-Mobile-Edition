import 'dart:math';

import 'career_models.dart';
import 'match_models.dart';
import 'match_simulation.dart';

class CareerEngine {
  final MatchSimulator _simulator;

  CareerEngine([MatchSimulator? simulator]) : _simulator = simulator ?? MatchSimulator();

  CareerGameState initializeCareer({
    required CareerClub playerClub,
    required List<CareerClub> leagueClubs,
    required List<Fixture> fixtures,
    required YouthGroup youth,
  }) {
    final leagueTable = leagueClubs.map((club) {
      return LeagueTableEntry(
        clubId: club.id,
        clubName: club.name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        average: 0.0,
      );
    }).toList();

    final squad = playerClub.players;
    final seasonStats = SeasonStats(
      year: DateTime.now().year,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      leaguePosition: 1,
      pointsTotal: 0,
      bestPlayer: BestPlayer(name: '', rating: 0),
      topScorer: TopScorer(name: '', goals: 0),
      winStreak: 0,
      currentForm: 50,
    );

    return CareerGameState(
      currentSeason: seasonStats.year,
      currentMatchday: 1,
      playerClub: playerClub,
      leagueTable: leagueTable,
      fixtures: fixtures,
      seasonStats: seasonStats,
      squad: squad,
      recentMatches: const [],
      transferMarketOffers: const [],
      youth: youth,
    );
  }

  CareerGameState playFixture(CareerGameState state, Fixture fixture, TeamSetup homeTeam, TeamSetup awayTeam) {
    final prediction = _simulator.simulate(homeTeam, awayTeam);
    final playedFixture = fixture.copyWith(
      played: true,
      result: MatchScore(homeScore: prediction.homeGoals, awayScore: prediction.awayGoals),
    );

    final recentMatch = MatchResult(
      homeScore: prediction.homeGoals,
      awayScore: prediction.awayGoals,
      events: prediction.events,
      stats: prediction.stats,
      manOfMatch: prediction.manOfMatch,
      duration: prediction.duration,
    );

    final updatedFixtures = state.fixtures.map((item) => item.id == fixture.id ? playedFixture : item).toList();
    final updatedRecentMatches = [recentMatch, ...state.recentMatches].take(10).toList();
    final updatedMatchday = state.currentMatchday + 1;

    return state.copyWith(
      fixtures: updatedFixtures,
      recentMatches: updatedRecentMatches,
      currentMatchday: updatedMatchday,
      seasonStats: state.seasonStats.copyWith(
        matchesPlayed: state.seasonStats.matchesPlayed + 1,
        goalsFor: state.seasonStats.goalsFor + prediction.homeGoals,
        goalsAgainst: state.seasonStats.goalsAgainst + prediction.awayGoals,
        wins: state.seasonStats.wins + (prediction.homeGoals > prediction.awayGoals ? 1 : 0),
        draws: state.seasonStats.draws + (prediction.homeGoals == prediction.awayGoals ? 1 : 0),
        losses: state.seasonStats.losses + (prediction.homeGoals < prediction.awayGoals ? 1 : 0),
      ),
    );
  }

  List<CareerPlayer> generateYouthIntake({
    required int count,
    required int startingId,
    required Random random,
  }) {
    final List<CareerPlayer> youthPlayers = [];
    for (var i = 0; i < count; i++) {
      final int age = 16 + random.nextInt(3);
      youthPlayers.add(CareerPlayer(
        id: startingId + i,
        firstName: 'Youth',
        lastName: 'Player ${startingId + i}',
        age: age,
        position: ['GK', 'DEF', 'MID', 'FWD'][random.nextInt(4)],
        overallRating: 50 + random.nextInt(20),
        potential: 65 + random.nextInt(30),
        pace: 40 + random.nextInt(60),
        shooting: 35 + random.nextInt(60),
        passing: 35 + random.nextInt(60),
        dribbling: 35 + random.nextInt(60),
        defense: 35 + random.nextInt(60),
        physical: 35 + random.nextInt(60),
        morale: 60 + random.nextInt(40),
        form: 50 + random.nextInt(30),
        contractEndYear: DateTime.now().year + 2,
        injuryWeeks: 0,
        isYouthPlayer: true,
      ));
    }
    return youthPlayers;
  }
}
