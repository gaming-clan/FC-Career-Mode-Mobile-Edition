import 'dart:math';

import 'package:fc_career_mode/src/engine/match_models.dart';
import 'package:fc_career_mode/src/engine/match_simulation.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  final formation = const Formation(
    formationCode: '4-3-3',
    defenders: 4,
    midfielders: 3,
    forwards: 3,
    style: 'Balanced',
    pressing: 'Mid block',
    buildUp: 'Short passing',
  );

  TeamSetup team(String name, {List<TeamPlayer>? players}) {
    return TeamSetup(
      clubId: name.hashCode,
      clubName: name,
      players:
          players ??
          const [
            TeamPlayer(
              id: 1,
              name: 'Test Player',
              position: 'ST',
              overallRating: 80,
            ),
          ],
      formation: formation,
      morale: 75,
    );
  }

  test('rejects teams with no players before simulation', () {
    final simulator = MatchSimulator(Random(1));

    expect(
      () => simulator.simulate(team('Home', players: const []), team('Away')),
      throwsArgumentError,
    );
  });

  test('keeps possession balanced and events within regulation time', () {
    final prediction = MatchSimulator(
      Random(1),
    ).simulate(team('Home'), team('Away'));

    expect(
      prediction.stats.home.possession + prediction.stats.away.possession,
      100,
    );
    expect(
      prediction.events.length,
      prediction.homeGoals + prediction.awayGoals,
    );
    expect(
      prediction.events.every(
        (event) => event.minute >= 1 && event.minute <= 90,
      ),
      isTrue,
    );
  });
}
