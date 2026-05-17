class SeasonFixture {
  final int id;
  final int homeTeamId;
  final int awayTeamId;
  final String homeTeamName;
  final String awayTeamName;
  final int? homeGoals;
  final int? awayGoals;
  final String date;
  final String status;

  const SeasonFixture({
    required this.id,
    required this.homeTeamId,
    required this.awayTeamId,
    required this.homeTeamName,
    required this.awayTeamName,
    required this.homeGoals,
    required this.awayGoals,
    required this.date,
    required this.status,
  });

  SeasonFixture copyWith({
    int? id,
    int? homeTeamId,
    int? awayTeamId,
    String? homeTeamName,
    String? awayTeamName,
    int? homeGoals,
    int? awayGoals,
    String? date,
    String? status,
  }) {
    return SeasonFixture(
      id: id ?? this.id,
      homeTeamId: homeTeamId ?? this.homeTeamId,
      awayTeamId: awayTeamId ?? this.awayTeamId,
      homeTeamName: homeTeamName ?? this.homeTeamName,
      awayTeamName: awayTeamName ?? this.awayTeamName,
      homeGoals: homeGoals ?? this.homeGoals,
      awayGoals: awayGoals ?? this.awayGoals,
      date: date ?? this.date,
      status: status ?? this.status,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'homeTeamId': homeTeamId,
      'awayTeamId': awayTeamId,
      'homeTeamName': homeTeamName,
      'awayTeamName': awayTeamName,
      'homeGoals': homeGoals,
      'awayGoals': awayGoals,
      'date': date,
      'status': status,
    };
  }

  factory SeasonFixture.fromJson(Map<String, dynamic> json) {
    return SeasonFixture(
      id: json['id'] as int,
      homeTeamId: json['homeTeamId'] as int,
      awayTeamId: json['awayTeamId'] as int,
      homeTeamName: json['homeTeamName'] as String,
      awayTeamName: json['awayTeamName'] as String,
      homeGoals: json['homeGoals'] as int?,
      awayGoals: json['awayGoals'] as int?,
      date: json['date'] as String,
      status: json['status'] as String,
    );
  }
}

class SeasonWeek {
  final int week;
  final List<SeasonFixture> fixtures;
  final bool completed;

  SeasonWeek({
    required this.week,
    required List<SeasonFixture> fixtures,
    required this.completed,
  }) : fixtures = List.unmodifiable(fixtures);

  SeasonWeek copyWith({
    int? week,
    List<SeasonFixture>? fixtures,
    bool? completed,
  }) {
    return SeasonWeek(
      week: week ?? this.week,
      fixtures: fixtures ?? this.fixtures,
      completed: completed ?? this.completed,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'week': week,
      'fixtures': fixtures.map((fixture) => fixture.toJson()).toList(),
      'completed': completed,
    };
  }

  factory SeasonWeek.fromJson(Map<String, dynamic> json) {
    return SeasonWeek(
      week: json['week'] as int,
      fixtures: (json['fixtures'] as List<dynamic>)
          .map((item) => SeasonFixture.fromJson(item as Map<String, dynamic>))
          .toList(),
      completed: json['completed'] as bool,
    );
  }
}

class LeagueStanding {
  final int position;
  final int clubId;
  final String clubName;
  final int played;
  final int wins;
  final int draws;
  final int losses;
  final int goalsFor;
  final int goalsAgainst;
  final int points;

  const LeagueStanding({
    required this.position,
    required this.clubId,
    required this.clubName,
    required this.played,
    required this.wins,
    required this.draws,
    required this.losses,
    required this.goalsFor,
    required this.goalsAgainst,
    required this.points,
  });

  LeagueStanding copyWith({
    int? position,
    int? clubId,
    String? clubName,
    int? played,
    int? wins,
    int? draws,
    int? losses,
    int? goalsFor,
    int? goalsAgainst,
    int? points,
  }) {
    return LeagueStanding(
      position: position ?? this.position,
      clubId: clubId ?? this.clubId,
      clubName: clubName ?? this.clubName,
      played: played ?? this.played,
      wins: wins ?? this.wins,
      draws: draws ?? this.draws,
      losses: losses ?? this.losses,
      goalsFor: goalsFor ?? this.goalsFor,
      goalsAgainst: goalsAgainst ?? this.goalsAgainst,
      points: points ?? this.points,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'position': position,
      'clubId': clubId,
      'clubName': clubName,
      'played': played,
      'wins': wins,
      'draws': draws,
      'losses': losses,
      'goalsFor': goalsFor,
      'goalsAgainst': goalsAgainst,
      'points': points,
    };
  }

  factory LeagueStanding.fromJson(Map<String, dynamic> json) {
    return LeagueStanding(
      position: json['position'] as int,
      clubId: json['clubId'] as int,
      clubName: json['clubName'] as String,
      played: json['played'] as int,
      wins: json['wins'] as int,
      draws: json['draws'] as int,
      losses: json['losses'] as int,
      goalsFor: json['goalsFor'] as int,
      goalsAgainst: json['goalsAgainst'] as int,
      points: json['points'] as int,
    );
  }
}

class Season {
  final int year;
  final int currentWeek;
  final int totalWeeks;
  final List<LeagueStanding> standings;
  final List<SeasonWeek> weeks;

  Season({
    required this.year,
    required this.currentWeek,
    required this.totalWeeks,
    required List<LeagueStanding> standings,
    required List<SeasonWeek> weeks,
  })  : standings = List.unmodifiable(standings),
        weeks = List.unmodifiable(weeks);

  Season copyWith({
    int? year,
    int? currentWeek,
    int? totalWeeks,
    List<LeagueStanding>? standings,
    List<SeasonWeek>? weeks,
  }) {
    return Season(
      year: year ?? this.year,
      currentWeek: currentWeek ?? this.currentWeek,
      totalWeeks: totalWeeks ?? this.totalWeeks,
      standings: standings ?? this.standings,
      weeks: weeks ?? this.weeks,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'year': year,
      'currentWeek': currentWeek,
      'totalWeeks': totalWeeks,
      'standings': standings.map((standing) => standing.toJson()).toList(),
      'weeks': weeks.map((week) => week.toJson()).toList(),
    };
  }

  factory Season.fromJson(Map<String, dynamic> json) {
    return Season(
      year: json['year'] as int,
      currentWeek: json['currentWeek'] as int,
      totalWeeks: json['totalWeeks'] as int,
      standings: (json['standings'] as List<dynamic>)
          .map((item) => LeagueStanding.fromJson(item as Map<String, dynamic>))
          .toList(),
      weeks: (json['weeks'] as List<dynamic>)
          .map((item) => SeasonWeek.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }
}
