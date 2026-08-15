import 'dart:math';

import 'match_models.dart';

class MatchPrediction {
  final int homeGoals;
  final int awayGoals;
  final List<MatchEvent> events;
  final MatchResultStats stats;
  final ManOfMatch manOfMatch;
  final MatchDuration duration;

  MatchPrediction({
    required this.homeGoals,
    required this.awayGoals,
    required this.events,
    required this.stats,
    required this.manOfMatch,
    required this.duration,
  });
}

class MatchSimulator {
  final Random _random;

  MatchSimulator([Random? random]) : _random = random ?? Random.secure();

  double _teamPower(TeamSetup team) {
    if (team.players.isEmpty) {
      throw ArgumentError.value(
        team.clubName,
        'team.players',
        'A team must contain at least one player',
      );
    }

    final double averageRating =
        team.players.fold<int>(0, (sum, player) => sum + player.overallRating) /
            team.players.length;
    final double formationFactor = team.formation.defenders * 0.05 +
        team.formation.midfielders * 0.08 +
        team.formation.forwards * 0.1;
    final double moraleFactor = 1 + team.morale / 100.0;
    return averageRating * moraleFactor + formationFactor * 6.0;
  }

  MatchPrediction simulate(TeamSetup home, TeamSetup away) {
    if (home.players.isEmpty || away.players.isEmpty) {
      throw ArgumentError('Both teams must contain at least one player');
    }

    final double homePower = _teamPower(home);
    final double awayPower = _teamPower(away);
    final double homeAttacking = homePower * 0.55 + _random.nextDouble() * 5;
    final double awayAttacking = awayPower * 0.45 + _random.nextDouble() * 5;
    final double homeExpectedGoals = max(0.3, (homeAttacking - awayPower * 0.3) / 6.0 + 1.0);
    final double awayExpectedGoals = max(0.1, (awayAttacking - homePower * 0.28) / 6.0 + 0.8);
    final int homeGoals = _rollGoals(homeExpectedGoals);
    final int awayGoals = _rollGoals(awayExpectedGoals);

    final int homePossession = 45 + _random.nextInt(11);
    final stats = MatchResultStats(
      home: MatchStatistics(
        team: home.clubName,
        possession: homePossession,
        shots: 6 + _random.nextInt(11),
        shotsOnTarget: 2 + _random.nextInt(7),
        passes: 320 + _random.nextInt(181),
        passAccuracy: 70 + _random.nextInt(21),
        tackles: 8 + _random.nextInt(10),
        interceptions: 4 + _random.nextInt(8),
        fouls: 8 + _random.nextInt(8),
        cards: Cards(yellow: _random.nextInt(3), red: _random.nextInt(2)),
        injuries: _random.nextInt(2),
      ),
      away: MatchStatistics(
        team: away.clubName,
        possession: 100 - homePossession,
        shots: 5 + _random.nextInt(10),
        shotsOnTarget: 1 + _random.nextInt(6),
        passes: 280 + _random.nextInt(151),
        passAccuracy: 65 + _random.nextInt(21),
        tackles: 7 + _random.nextInt(11),
        interceptions: 3 + _random.nextInt(8),
        fouls: 9 + _random.nextInt(9),
        cards: Cards(yellow: _random.nextInt(3), red: _random.nextInt(2)),
        injuries: _random.nextInt(2),
      ),
    );

    final manOfMatch = ManOfMatch(
      playerId: home.players.first.id,
      name: home.players.first.name,
      team: home.clubName,
      rating: 7 + _random.nextInt(3),
    );

    final events = _buildEvents(home, away, homeGoals, awayGoals);
    final duration = MatchDuration.ft;

    return MatchPrediction(
      homeGoals: homeGoals,
      awayGoals: awayGoals,
      events: events,
      stats: stats,
      manOfMatch: manOfMatch,
      duration: duration,
    );
  }

  int _rollGoals(double expectedGoals) {
    final double base = expectedGoals.clamp(0.0, 5.0);
    final int whole = base.floor();
    final double remainder = base - whole;
    return whole + (_random.nextDouble() < remainder ? 1 : 0);
  }

  List<MatchEvent> _buildEvents(TeamSetup home, TeamSetup away, int homeGoals, int awayGoals) {
    final List<MatchEvent> events = [];
    int minute = 5;
    for (var i = 0; i < homeGoals + awayGoals; i++) {
      final bool isHome = i < homeGoals;
      final TeamSetup team = isHome ? home : away;
      final TeamPlayer player = team.players[_random.nextInt(team.players.length)];
      events.add(MatchEvent(
        minute: minute,
        type: MatchEventType.goal,
        playerId: player.id,
        playerName: player.name,
        position: player.position,
        description: '${player.name} scores for ${team.clubName}',
        impact: 10,
      ));
      minute = min(90, minute + 7 + _random.nextInt(10));
    }
    return events;
  }
}
