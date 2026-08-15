import 'dart:math';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../engine/engine.dart';

final careerControllerProvider =
    NotifierProvider<CareerController, CareerGameState>(CareerController.new);

class CareerController extends Notifier<CareerGameState> {
  final CareerEngine _engine = CareerEngine(MatchSimulator(Random(42)));

  @override
  CareerGameState build() => _createDefaultState();

  void playNextFixture() {
    Fixture? fixture;
    for (final candidate in state.fixtures) {
      if (!candidate.played) {
        fixture = candidate;
        break;
      }
    }
    if (fixture == null) return;

    final playerClub = state.playerClub;
    final homePlayers = fixture.homeClubId == playerClub.id
        ? playerClub.players
        : _opponentPlayers(fixture.homeClubName);
    final awayPlayers = fixture.awayClubId == playerClub.id
        ? playerClub.players
        : _opponentPlayers(fixture.awayClubName);

    final formation = const Formation(
      formationCode: '4-3-3',
      defenders: 4,
      midfielders: 3,
      forwards: 3,
      style: 'Balanced',
      pressing: 'Mid block',
      buildUp: 'Short passing',
    );
    final home = TeamSetup(
      clubId: fixture.homeClubId,
      clubName: fixture.homeClubName,
      players: _teamPlayers(homePlayers),
      formation: formation,
      morale: 78,
    );
    final away = TeamSetup(
      clubId: fixture.awayClubId,
      clubName: fixture.awayClubName,
      players: _teamPlayers(awayPlayers),
      formation: formation,
      morale: 74,
    );

    state = _engine.playFixture(state, fixture, home, away);
  }

  void addYouthIntake() {
    final intake = _engine.generateYouthIntake(
      count: 3,
      startingId: 1000 + state.youth.players.length,
      random: Random(state.currentMatchday),
    );
    state = state.copyWith(
      youth: state.youth.copyWith(players: [...state.youth.players, ...intake]),
    );
  }

  CareerGameState _createDefaultState() {
    final squad = List<CareerPlayer>.generate(11, (index) {
      final positions = <String>[
        'GK',
        'DEF',
        'DEF',
        'DEF',
        'DEF',
        'MID',
        'MID',
        'MID',
        'FWD',
        'FWD',
        'FWD',
      ];
      return CareerPlayer(
        id: index + 1,
        firstName: index == 10 ? 'Leo' : 'FC',
        lastName: index == 10 ? 'Martinez' : 'Player ${index + 1}',
        age: 21 + (index % 8),
        position: positions[index],
        overallRating: 74 + (index % 8),
        potential: 82 + (index % 12),
        pace: 65 + (index % 25),
        shooting: 60 + (index % 30),
        passing: 65 + (index % 25),
        dribbling: 62 + (index % 28),
        defense: 55 + (index % 35),
        physical: 60 + (index % 30),
        morale: 82,
        form: 72,
        contractEndYear: DateTime.now().year + 3,
        injuryWeeks: 0,
        isYouthPlayer: false,
      );
    });

    final club = CareerClub(
      id: 1,
      name: 'FC Elite',
      country: 'England',
      division: 'Premier Division',
      budget: 12000000,
      weeklyWages: 185000,
      players: squad,
      manager: const ClubManager(
        name: 'Alex Morgan',
        experience: 12,
        reputation: 78,
      ),
    );
    final opponentNames = <String>[
      'Northbridge United',
      'Riverside City',
      'Capital Athletic',
      'Westport FC',
    ];
    final clubs = [
      club,
      ...opponentNames.asMap().entries.map(
        (entry) => CareerClub(
          id: entry.key + 2,
          name: entry.value,
          country: 'England',
          division: 'Premier Division',
          budget: 8000000,
          weeklyWages: 140000,
          players: squad,
          manager: const ClubManager(
            name: 'AI Manager',
            experience: 8,
            reputation: 65,
          ),
        ),
      ),
    ];
    final fixtures = List<Fixture>.generate(8, (index) {
      final home = clubs[index % clubs.length];
      final away = clubs[(index + 1) % clubs.length];
      return Fixture(
        id: index + 1,
        matchday: index + 1,
        homeClubId: home.id,
        homeClubName: home.name,
        awayClubId: away.id,
        awayClubName: away.name,
        played: false,
        result: null,
        homeFormation: '4-3-3',
        awayFormation: '4-3-3',
      );
    });

    return _engine.initializeCareer(
      playerClub: club,
      leagueClubs: clubs,
      fixtures: fixtures,
      youth: YouthGroup(players: const [], facilities: 62),
    );
  }

  List<TeamPlayer> _teamPlayers(List<CareerPlayer> players) {
    return players
        .map(
          (player) => TeamPlayer(
            id: player.id,
            name: '${player.firstName} ${player.lastName}',
            position: player.position,
            overallRating: player.overallRating,
          ),
        )
        .toList();
  }

  List<CareerPlayer> _opponentPlayers(String clubName) {
    return List<CareerPlayer>.generate(11, (index) {
      final positions = <String>[
        'GK',
        'DEF',
        'DEF',
        'DEF',
        'DEF',
        'MID',
        'MID',
        'MID',
        'FWD',
        'FWD',
        'FWD',
      ];
      return CareerPlayer(
        id: 5000 + clubName.hashCode.abs() % 500 + index,
        firstName: clubName.split(' ').first,
        lastName: 'Player ${index + 1}',
        age: 22 + (index % 7),
        position: positions[index],
        overallRating: 68 + (index % 9),
        potential: 78,
        pace: 62,
        shooting: 62,
        passing: 62,
        dribbling: 62,
        defense: 62,
        physical: 62,
        morale: 70,
        form: 65,
        contractEndYear: DateTime.now().year + 2,
        injuryWeeks: 0,
        isYouthPlayer: false,
      );
    });
  }
}
