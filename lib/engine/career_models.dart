import 'match_models.dart';

class CareerPlayer {
  final int id;
  final String firstName;
  final String lastName;
  final int age;
  final String position;
  final int overallRating;
  final int potential;
  final int pace;
  final int shooting;
  final int passing;
  final int dribbling;
  final int defense;
  final int physical;
  final int morale;
  final int form;
  final int contractEndYear;
  final int injuryWeeks;
  final bool isYouthPlayer;

  const CareerPlayer({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.age,
    required this.position,
    required this.overallRating,
    required this.potential,
    required this.pace,
    required this.shooting,
    required this.passing,
    required this.dribbling,
    required this.defense,
    required this.physical,
    required this.morale,
    required this.form,
    required this.contractEndYear,
    required this.injuryWeeks,
    required this.isYouthPlayer,
  });

  CareerPlayer copyWith({
    int? id,
    String? firstName,
    String? lastName,
    int? age,
    String? position,
    int? overallRating,
    int? potential,
    int? pace,
    int? shooting,
    int? passing,
    int? dribbling,
    int? defense,
    int? physical,
    int? morale,
    int? form,
    int? contractEndYear,
    int? injuryWeeks,
    bool? isYouthPlayer,
  }) {
    return CareerPlayer(
      id: id ?? this.id,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      age: age ?? this.age,
      position: position ?? this.position,
      overallRating: overallRating ?? this.overallRating,
      potential: potential ?? this.potential,
      pace: pace ?? this.pace,
      shooting: shooting ?? this.shooting,
      passing: passing ?? this.passing,
      dribbling: dribbling ?? this.dribbling,
      defense: defense ?? this.defense,
      physical: physical ?? this.physical,
      morale: morale ?? this.morale,
      form: form ?? this.form,
      contractEndYear: contractEndYear ?? this.contractEndYear,
      injuryWeeks: injuryWeeks ?? this.injuryWeeks,
      isYouthPlayer: isYouthPlayer ?? this.isYouthPlayer,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'firstName': firstName,
      'lastName': lastName,
      'age': age,
      'position': position,
      'overallRating': overallRating,
      'potential': potential,
      'pace': pace,
      'shooting': shooting,
      'passing': passing,
      'dribbling': dribbling,
      'defense': defense,
      'physical': physical,
      'morale': morale,
      'form': form,
      'contractEndYear': contractEndYear,
      'injuryWeeks': injuryWeeks,
      'isYouthPlayer': isYouthPlayer,
    };
  }

  factory CareerPlayer.fromJson(Map<String, dynamic> json) {
    return CareerPlayer(
      id: json['id'] as int,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      age: json['age'] as int,
      position: json['position'] as String,
      overallRating: json['overallRating'] as int,
      potential: json['potential'] as int,
      pace: json['pace'] as int,
      shooting: json['shooting'] as int,
      passing: json['passing'] as int,
      dribbling: json['dribbling'] as int,
      defense: json['defense'] as int,
      physical: json['physical'] as int,
      morale: json['morale'] as int,
      form: json['form'] as int,
      contractEndYear: json['contractEndYear'] as int,
      injuryWeeks: json['injuryWeeks'] as int,
      isYouthPlayer: json['isYouthPlayer'] as bool,
    );
  }
}

class CareerClub {
  final int id;
  final String name;
  final String country;
  final String division;
  final double budget;
  final double weeklyWages;
  final List<CareerPlayer> players;
  final ClubManager manager;

  CareerClub({
    required this.id,
    required this.name,
    required this.country,
    required this.division,
    required this.budget,
    required this.weeklyWages,
    required List<CareerPlayer> players,
    required this.manager,
  }) : players = List.unmodifiable(players);

  CareerClub copyWith({
    int? id,
    String? name,
    String? country,
    String? division,
    double? budget,
    double? weeklyWages,
    List<CareerPlayer>? players,
    ClubManager? manager,
  }) {
    return CareerClub(
      id: id ?? this.id,
      name: name ?? this.name,
      country: country ?? this.country,
      division: division ?? this.division,
      budget: budget ?? this.budget,
      weeklyWages: weeklyWages ?? this.weeklyWages,
      players: players ?? this.players,
      manager: manager ?? this.manager,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'country': country,
      'division': division,
      'budget': budget,
      'weeklyWages': weeklyWages,
      'players': players.map((player) => player.toJson()).toList(),
      'manager': manager.toJson(),
    };
  }

  factory CareerClub.fromJson(Map<String, dynamic> json) {
    return CareerClub(
      id: json['id'] as int,
      name: json['name'] as String,
      country: json['country'] as String,
      division: json['division'] as String,
      budget: (json['budget'] as num).toDouble(),
      weeklyWages: (json['weeklyWages'] as num).toDouble(),
      players: (json['players'] as List<dynamic>)
          .map((item) => CareerPlayer.fromJson(item as Map<String, dynamic>))
          .toList(),
      manager: ClubManager.fromJson(json['manager'] as Map<String, dynamic>),
    );
  }
}

class ClubManager {
  final String name;
  final int experience;
  final int reputation;

  const ClubManager({
    required this.name,
    required this.experience,
    required this.reputation,
  });

  ClubManager copyWith({
    String? name,
    int? experience,
    int? reputation,
  }) {
    return ClubManager(
      name: name ?? this.name,
      experience: experience ?? this.experience,
      reputation: reputation ?? this.reputation,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'experience': experience,
      'reputation': reputation,
    };
  }

  factory ClubManager.fromJson(Map<String, dynamic> json) {
    return ClubManager(
      name: json['name'] as String,
      experience: json['experience'] as int,
      reputation: json['reputation'] as int,
    );
  }
}

class LeagueTableEntry {
  final int clubId;
  final String clubName;
  final int played;
  final int won;
  final int drawn;
  final int lost;
  final int goalsFor;
  final int goalsAgainst;
  final int goalDifference;
  final int points;
  final double average;

  const LeagueTableEntry({
    required this.clubId,
    required this.clubName,
    required this.played,
    required this.won,
    required this.drawn,
    required this.lost,
    required this.goalsFor,
    required this.goalsAgainst,
    required this.goalDifference,
    required this.points,
    required this.average,
  });

  LeagueTableEntry copyWith({
    int? clubId,
    String? clubName,
    int? played,
    int? won,
    int? drawn,
    int? lost,
    int? goalsFor,
    int? goalsAgainst,
    int? goalDifference,
    int? points,
    double? average,
  }) {
    return LeagueTableEntry(
      clubId: clubId ?? this.clubId,
      clubName: clubName ?? this.clubName,
      played: played ?? this.played,
      won: won ?? this.won,
      drawn: drawn ?? this.drawn,
      lost: lost ?? this.lost,
      goalsFor: goalsFor ?? this.goalsFor,
      goalsAgainst: goalsAgainst ?? this.goalsAgainst,
      goalDifference: goalDifference ?? this.goalDifference,
      points: points ?? this.points,
      average: average ?? this.average,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'clubId': clubId,
      'clubName': clubName,
      'played': played,
      'won': won,
      'drawn': drawn,
      'lost': lost,
      'goalsFor': goalsFor,
      'goalsAgainst': goalsAgainst,
      'goalDifference': goalDifference,
      'points': points,
      'average': average,
    };
  }

  factory LeagueTableEntry.fromJson(Map<String, dynamic> json) {
    return LeagueTableEntry(
      clubId: json['clubId'] as int,
      clubName: json['clubName'] as String,
      played: json['played'] as int,
      won: json['won'] as int,
      drawn: json['drawn'] as int,
      lost: json['lost'] as int,
      goalsFor: json['goalsFor'] as int,
      goalsAgainst: json['goalsAgainst'] as int,
      goalDifference: json['goalDifference'] as int,
      points: json['points'] as int,
      average: (json['average'] as num).toDouble(),
    );
  }
}

class SeasonStats {
  final int year;
  final int matchesPlayed;
  final int wins;
  final int draws;
  final int losses;
  final int goalsFor;
  final int goalsAgainst;
  final int leaguePosition;
  final int pointsTotal;
  final BestPlayer bestPlayer;
  final TopScorer topScorer;
  final int winStreak;
  final int currentForm;

  const SeasonStats({
    required this.year,
    required this.matchesPlayed,
    required this.wins,
    required this.draws,
    required this.losses,
    required this.goalsFor,
    required this.goalsAgainst,
    required this.leaguePosition,
    required this.pointsTotal,
    required this.bestPlayer,
    required this.topScorer,
    required this.winStreak,
    required this.currentForm,
  });

  SeasonStats copyWith({
    int? year,
    int? matchesPlayed,
    int? wins,
    int? draws,
    int? losses,
    int? goalsFor,
    int? goalsAgainst,
    int? leaguePosition,
    int? pointsTotal,
    BestPlayer? bestPlayer,
    TopScorer? topScorer,
    int? winStreak,
    int? currentForm,
  }) {
    return SeasonStats(
      year: year ?? this.year,
      matchesPlayed: matchesPlayed ?? this.matchesPlayed,
      wins: wins ?? this.wins,
      draws: draws ?? this.draws,
      losses: losses ?? this.losses,
      goalsFor: goalsFor ?? this.goalsFor,
      goalsAgainst: goalsAgainst ?? this.goalsAgainst,
      leaguePosition: leaguePosition ?? this.leaguePosition,
      pointsTotal: pointsTotal ?? this.pointsTotal,
      bestPlayer: bestPlayer ?? this.bestPlayer,
      topScorer: topScorer ?? this.topScorer,
      winStreak: winStreak ?? this.winStreak,
      currentForm: currentForm ?? this.currentForm,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'year': year,
      'matchesPlayed': matchesPlayed,
      'wins': wins,
      'draws': draws,
      'losses': losses,
      'goalsFor': goalsFor,
      'goalsAgainst': goalsAgainst,
      'leaguePosition': leaguePosition,
      'pointsTotal': pointsTotal,
      'bestPlayer': bestPlayer.toJson(),
      'topScorer': topScorer.toJson(),
      'winStreak': winStreak,
      'currentForm': currentForm,
    };
  }

  factory SeasonStats.fromJson(Map<String, dynamic> json) {
    return SeasonStats(
      year: json['year'] as int,
      matchesPlayed: json['matchesPlayed'] as int,
      wins: json['wins'] as int,
      draws: json['draws'] as int,
      losses: json['losses'] as int,
      goalsFor: json['goalsFor'] as int,
      goalsAgainst: json['goalsAgainst'] as int,
      leaguePosition: json['leaguePosition'] as int,
      pointsTotal: json['pointsTotal'] as int,
      bestPlayer: BestPlayer.fromJson(json['bestPlayer'] as Map<String, dynamic>),
      topScorer: TopScorer.fromJson(json['topScorer'] as Map<String, dynamic>),
      winStreak: json['winStreak'] as int,
      currentForm: json['currentForm'] as int,
    );
  }
}

class BestPlayer {
  final String name;
  final int rating;

  const BestPlayer({
    required this.name,
    required this.rating,
  });

  BestPlayer copyWith({
    String? name,
    int? rating,
  }) {
    return BestPlayer(
      name: name ?? this.name,
      rating: rating ?? this.rating,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'rating': rating,
    };
  }

  factory BestPlayer.fromJson(Map<String, dynamic> json) {
    return BestPlayer(
      name: json['name'] as String,
      rating: json['rating'] as int,
    );
  }
}

class TopScorer {
  final String name;
  final int goals;

  const TopScorer({
    required this.name,
    required this.goals,
  });

  TopScorer copyWith({
    String? name,
    int? goals,
  }) {
    return TopScorer(
      name: name ?? this.name,
      goals: goals ?? this.goals,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'goals': goals,
    };
  }

  factory TopScorer.fromJson(Map<String, dynamic> json) {
    return TopScorer(
      name: json['name'] as String,
      goals: json['goals'] as int,
    );
  }
}

class Fixture {
  final int id;
  final int matchday;
  final int homeClubId;
  final String homeClubName;
  final int awayClubId;
  final String awayClubName;
  final bool played;
  final MatchScore? result;
  final String? homeFormation;
  final String? awayFormation;

  const Fixture({
    required this.id,
    required this.matchday,
    required this.homeClubId,
    required this.homeClubName,
    required this.awayClubId,
    required this.awayClubName,
    required this.played,
    this.result,
    this.homeFormation,
    this.awayFormation,
  });

  Fixture copyWith({
    int? id,
    int? matchday,
    int? homeClubId,
    String? homeClubName,
    int? awayClubId,
    String? awayClubName,
    bool? played,
    MatchScore? result,
    String? homeFormation,
    String? awayFormation,
  }) {
    return Fixture(
      id: id ?? this.id,
      matchday: matchday ?? this.matchday,
      homeClubId: homeClubId ?? this.homeClubId,
      homeClubName: homeClubName ?? this.homeClubName,
      awayClubId: awayClubId ?? this.awayClubId,
      awayClubName: awayClubName ?? this.awayClubName,
      played: played ?? this.played,
      result: result ?? this.result,
      homeFormation: homeFormation ?? this.homeFormation,
      awayFormation: awayFormation ?? this.awayFormation,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'matchday': matchday,
      'homeClubId': homeClubId,
      'homeClubName': homeClubName,
      'awayClubId': awayClubId,
      'awayClubName': awayClubName,
      'played': played,
      'result': result?.toJson(),
      'homeFormation': homeFormation,
      'awayFormation': awayFormation,
    };
  }

  factory Fixture.fromJson(Map<String, dynamic> json) {
    return Fixture(
      id: json['id'] as int,
      matchday: json['matchday'] as int,
      homeClubId: json['homeClubId'] as int,
      homeClubName: json['homeClubName'] as String,
      awayClubId: json['awayClubId'] as int,
      awayClubName: json['awayClubName'] as String,
      played: json['played'] as bool,
      result: json['result'] != null ? MatchScore.fromJson(json['result'] as Map<String, dynamic>) : null,
      homeFormation: json['homeFormation'] as String?,
      awayFormation: json['awayFormation'] as String?,
    );
  }
}

class MatchScore {
  final int homeScore;
  final int awayScore;

  const MatchScore({
    required this.homeScore,
    required this.awayScore,
  });

  MatchScore copyWith({
    int? homeScore,
    int? awayScore,
  }) {
    return MatchScore(
      homeScore: homeScore ?? this.homeScore,
      awayScore: awayScore ?? this.awayScore,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'homeScore': homeScore,
      'awayScore': awayScore,
    };
  }

  factory MatchScore.fromJson(Map<String, dynamic> json) {
    return MatchScore(
      homeScore: json['homeScore'] as int,
      awayScore: json['awayScore'] as int,
    );
  }
}

class YouthGroup {
  final List<CareerPlayer> players;
  final int facilities;

  YouthGroup({
    required List<CareerPlayer> players,
    required this.facilities,
  }) : players = List.unmodifiable(players);

  YouthGroup copyWith({
    List<CareerPlayer>? players,
    int? facilities,
  }) {
    return YouthGroup(
      players: players ?? this.players,
      facilities: facilities ?? this.facilities,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'players': players.map((player) => player.toJson()).toList(),
      'facilities': facilities,
    };
  }

  factory YouthGroup.fromJson(Map<String, dynamic> json) {
    return YouthGroup(
      players: (json['players'] as List<dynamic>)
          .map((item) => CareerPlayer.fromJson(item as Map<String, dynamic>))
          .toList(),
      facilities: json['facilities'] as int,
    );
  }
}

class CareerGameState {
  final int currentSeason;
  final int currentMatchday;
  final CareerClub playerClub;
  final List<LeagueTableEntry> leagueTable;
  final List<Fixture> fixtures;
  final SeasonStats seasonStats;
  final List<CareerPlayer> squad;
  final List<MatchResult> recentMatches;
  final List<Object> transferMarketOffers;
  final YouthGroup youth;

  CareerGameState({
    required this.currentSeason,
    required this.currentMatchday,
    required this.playerClub,
    required List<LeagueTableEntry> leagueTable,
    required List<Fixture> fixtures,
    required this.seasonStats,
    required List<CareerPlayer> squad,
    required List<MatchResult> recentMatches,
    required List<Object> transferMarketOffers,
    required this.youth,
  })  : leagueTable = List.unmodifiable(leagueTable),
        fixtures = List.unmodifiable(fixtures),
        squad = List.unmodifiable(squad),
        recentMatches = List.unmodifiable(recentMatches),
        transferMarketOffers = List.unmodifiable(transferMarketOffers);

  CareerGameState copyWith({
    int? currentSeason,
    int? currentMatchday,
    CareerClub? playerClub,
    List<LeagueTableEntry>? leagueTable,
    List<Fixture>? fixtures,
    SeasonStats? seasonStats,
    List<CareerPlayer>? squad,
    List<MatchResult>? recentMatches,
    List<Object>? transferMarketOffers,
    YouthGroup? youth,
  }) {
    return CareerGameState(
      currentSeason: currentSeason ?? this.currentSeason,
      currentMatchday: currentMatchday ?? this.currentMatchday,
      playerClub: playerClub ?? this.playerClub,
      leagueTable: leagueTable ?? this.leagueTable,
      fixtures: fixtures ?? this.fixtures,
      seasonStats: seasonStats ?? this.seasonStats,
      squad: squad ?? this.squad,
      recentMatches: recentMatches ?? this.recentMatches,
      transferMarketOffers: transferMarketOffers ?? this.transferMarketOffers,
      youth: youth ?? this.youth,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'currentSeason': currentSeason,
      'currentMatchday': currentMatchday,
      'playerClub': playerClub.toJson(),
      'leagueTable': leagueTable.map((entry) => entry.toJson()).toList(),
      'fixtures': fixtures.map((fixture) => fixture.toJson()).toList(),
      'seasonStats': seasonStats.toJson(),
      'squad': squad.map((player) => player.toJson()).toList(),
      'recentMatches': recentMatches.map((result) => result.toJson()).toList(),
      'transferMarketOffers': transferMarketOffers,
      'youth': youth.toJson(),
    };
  }

  factory CareerGameState.fromJson(Map<String, dynamic> json) {
    return CareerGameState(
      currentSeason: json['currentSeason'] as int,
      currentMatchday: json['currentMatchday'] as int,
      playerClub: CareerClub.fromJson(json['playerClub'] as Map<String, dynamic>),
      leagueTable: (json['leagueTable'] as List<dynamic>)
          .map((item) => LeagueTableEntry.fromJson(item as Map<String, dynamic>))
          .toList(),
      fixtures: (json['fixtures'] as List<dynamic>)
          .map((item) => Fixture.fromJson(item as Map<String, dynamic>))
          .toList(),
      seasonStats: SeasonStats.fromJson(json['seasonStats'] as Map<String, dynamic>),
      squad: (json['squad'] as List<dynamic>)
          .map((item) => CareerPlayer.fromJson(item as Map<String, dynamic>))
          .toList(),
      recentMatches: (json['recentMatches'] as List<dynamic>)
          .map((item) => MatchResult.fromJson(item as Map<String, dynamic>))
          .toList(),
      transferMarketOffers: List<Object>.from(json['transferMarketOffers'] as List<dynamic>),
      youth: YouthGroup.fromJson(json['youth'] as Map<String, dynamic>),
    );
  }
}
