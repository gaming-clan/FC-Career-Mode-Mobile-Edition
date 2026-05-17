enum MatchEventType { goal, assist, tackle, pass, miss, save, injury, yellow, red, substitution }

extension MatchEventTypeExtensions on MatchEventType {
  String get name {
    return switch (this) {
      MatchEventType.goal => 'goal',
      MatchEventType.assist => 'assist',
      MatchEventType.tackle => 'tackle',
      MatchEventType.pass => 'pass',
      MatchEventType.miss => 'miss',
      MatchEventType.save => 'save',
      MatchEventType.injury => 'injury',
      MatchEventType.yellow => 'yellow',
      MatchEventType.red => 'red',
      MatchEventType.substitution => 'substitution',
    };
  }

  static MatchEventType fromString(String value) {
    return switch (value) {
      'goal' => MatchEventType.goal,
      'assist' => MatchEventType.assist,
      'tackle' => MatchEventType.tackle,
      'pass' => MatchEventType.pass,
      'miss' => MatchEventType.miss,
      'save' => MatchEventType.save,
      'injury' => MatchEventType.injury,
      'yellow' => MatchEventType.yellow,
      'red' => MatchEventType.red,
      'substitution' => MatchEventType.substitution,
      _ => throw ArgumentError('Unknown MatchEventType: $value'),
    };
  }
}

class MatchEvent {
  final int minute;
  final MatchEventType type;
  final int playerId;
  final String playerName;
  final String position;
  final String description;
  final int impact;

  const MatchEvent({
    required this.minute,
    required this.type,
    required this.playerId,
    required this.playerName,
    required this.position,
    required this.description,
    required this.impact,
  });

  MatchEvent copyWith({
    int? minute,
    MatchEventType? type,
    int? playerId,
    String? playerName,
    String? position,
    String? description,
    int? impact,
  }) {
    return MatchEvent(
      minute: minute ?? this.minute,
      type: type ?? this.type,
      playerId: playerId ?? this.playerId,
      playerName: playerName ?? this.playerName,
      position: position ?? this.position,
      description: description ?? this.description,
      impact: impact ?? this.impact,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'minute': minute,
      'type': type.name,
      'playerId': playerId,
      'playerName': playerName,
      'position': position,
      'description': description,
      'impact': impact,
    };
  }

  factory MatchEvent.fromJson(Map<String, dynamic> json) {
    return MatchEvent(
      minute: json['minute'] as int,
      type: MatchEventTypeExtensions.fromString(json['type'] as String),
      playerId: json['playerId'] as int,
      playerName: json['playerName'] as String,
      position: json['position'] as String,
      description: json['description'] as String,
      impact: json['impact'] as int,
    );
  }
}

class MatchStatistics {
  final String team;
  final int possession;
  final int shots;
  final int shotsOnTarget;
  final int passes;
  final int passAccuracy;
  final int tackles;
  final int interceptions;
  final int fouls;
  final Cards cards;
  final int injuries;

  const MatchStatistics({
    required this.team,
    required this.possession,
    required this.shots,
    required this.shotsOnTarget,
    required this.passes,
    required this.passAccuracy,
    required this.tackles,
    required this.interceptions,
    required this.fouls,
    required this.cards,
    required this.injuries,
  });

  MatchStatistics copyWith({
    String? team,
    int? possession,
    int? shots,
    int? shotsOnTarget,
    int? passes,
    int? passAccuracy,
    int? tackles,
    int? interceptions,
    int? fouls,
    Cards? cards,
    int? injuries,
  }) {
    return MatchStatistics(
      team: team ?? this.team,
      possession: possession ?? this.possession,
      shots: shots ?? this.shots,
      shotsOnTarget: shotsOnTarget ?? this.shotsOnTarget,
      passes: passes ?? this.passes,
      passAccuracy: passAccuracy ?? this.passAccuracy,
      tackles: tackles ?? this.tackles,
      interceptions: interceptions ?? this.interceptions,
      fouls: fouls ?? this.fouls,
      cards: cards ?? this.cards,
      injuries: injuries ?? this.injuries,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'team': team,
      'possession': possession,
      'shots': shots,
      'shotsOnTarget': shotsOnTarget,
      'passes': passes,
      'passAccuracy': passAccuracy,
      'tackles': tackles,
      'interceptions': interceptions,
      'fouls': fouls,
      'cards': cards.toJson(),
      'injuries': injuries,
    };
  }

  factory MatchStatistics.fromJson(Map<String, dynamic> json) {
    return MatchStatistics(
      team: json['team'] as String,
      possession: json['possession'] as int,
      shots: json['shots'] as int,
      shotsOnTarget: json['shotsOnTarget'] as int,
      passes: json['passes'] as int,
      passAccuracy: json['passAccuracy'] as int,
      tackles: json['tackles'] as int,
      interceptions: json['interceptions'] as int,
      fouls: json['fouls'] as int,
      cards: Cards.fromJson(json['cards'] as Map<String, dynamic>),
      injuries: json['injuries'] as int,
    );
  }
}

class Cards {
  final int yellow;
  final int red;

  const Cards({
    required this.yellow,
    required this.red,
  });

  Cards copyWith({
    int? yellow,
    int? red,
  }) {
    return Cards(
      yellow: yellow ?? this.yellow,
      red: red ?? this.red,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'yellow': yellow,
      'red': red,
    };
  }

  factory Cards.fromJson(Map<String, dynamic> json) {
    return Cards(
      yellow: json['yellow'] as int,
      red: json['red'] as int,
    );
  }
}

class Formation {
  final String formationCode;
  final int defenders;
  final int midfielders;
  final int forwards;
  final String style;
  final String pressing;
  final String buildUp;

  const Formation({
    required this.formationCode,
    required this.defenders,
    required this.midfielders,
    required this.forwards,
    required this.style,
    required this.pressing,
    required this.buildUp,
  });

  Formation copyWith({
    String? formationCode,
    int? defenders,
    int? midfielders,
    int? forwards,
    String? style,
    String? pressing,
    String? buildUp,
  }) {
    return Formation(
      formationCode: formationCode ?? this.formationCode,
      defenders: defenders ?? this.defenders,
      midfielders: midfielders ?? this.midfielders,
      forwards: forwards ?? this.forwards,
      style: style ?? this.style,
      pressing: pressing ?? this.pressing,
      buildUp: buildUp ?? this.buildUp,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'formationCode': formationCode,
      'defenders': defenders,
      'midfielders': midfielders,
      'forwards': forwards,
      'style': style,
      'pressing': pressing,
      'buildUp': buildUp,
    };
  }

  factory Formation.fromJson(Map<String, dynamic> json) {
    return Formation(
      formationCode: json['formationCode'] as String,
      defenders: json['defenders'] as int,
      midfielders: json['midfielders'] as int,
      forwards: json['forwards'] as int,
      style: json['style'] as String,
      pressing: json['pressing'] as String,
      buildUp: json['buildUp'] as String,
    );
  }
}

class TeamSetup {
  final int clubId;
  final String clubName;
  final List<TeamPlayer> players;
  final Formation formation;
  final int morale;

  TeamSetup({
    required this.clubId,
    required this.clubName,
    required List<TeamPlayer> players,
    required this.formation,
    required this.morale,
  }) : players = List.unmodifiable(players);

  TeamSetup copyWith({
    int? clubId,
    String? clubName,
    List<TeamPlayer>? players,
    Formation? formation,
    int? morale,
  }) {
    return TeamSetup(
      clubId: clubId ?? this.clubId,
      clubName: clubName ?? this.clubName,
      players: players ?? this.players,
      formation: formation ?? this.formation,
      morale: morale ?? this.morale,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'clubId': clubId,
      'clubName': clubName,
      'players': players.map((player) => player.toJson()).toList(),
      'formation': formation.toJson(),
      'morale': morale,
    };
  }

  factory TeamSetup.fromJson(Map<String, dynamic> json) {
    return TeamSetup(
      clubId: json['clubId'] as int,
      clubName: json['clubName'] as String,
      players: (json['players'] as List<dynamic>)
          .map((item) => TeamPlayer.fromJson(item as Map<String, dynamic>))
          .toList(),
      formation: Formation.fromJson(json['formation'] as Map<String, dynamic>),
      morale: json['morale'] as int,
    );
  }
}

class TeamPlayer {
  final int id;
  final String name;
  final String position;
  final int overallRating;

  const TeamPlayer({
    required this.id,
    required this.name,
    required this.position,
    required this.overallRating,
  });

  TeamPlayer copyWith({
    int? id,
    String? name,
    String? position,
    int? overallRating,
  }) {
    return TeamPlayer(
      id: id ?? this.id,
      name: name ?? this.name,
      position: position ?? this.position,
      overallRating: overallRating ?? this.overallRating,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'position': position,
      'overallRating': overallRating,
    };
  }

  factory TeamPlayer.fromJson(Map<String, dynamic> json) {
    return TeamPlayer(
      id: json['id'] as int,
      name: json['name'] as String,
      position: json['position'] as String,
      overallRating: json['overallRating'] as int,
    );
  }
}

enum MatchDuration { ft, aet, pen }

extension MatchDurationExtensions on MatchDuration {
  String get name {
    return switch (this) {
      MatchDuration.ft => 'ft',
      MatchDuration.aet => 'aet',
      MatchDuration.pen => 'pen',
    };
  }

  static MatchDuration fromString(String value) {
    return switch (value) {
      'ft' => MatchDuration.ft,
      'aet' => MatchDuration.aet,
      'pen' => MatchDuration.pen,
      _ => throw ArgumentError('Unknown MatchDuration: $value'),
    };
  }
}

class ManOfMatch {
  final int playerId;
  final String name;
  final String team;
  final int rating;

  const ManOfMatch({
    required this.playerId,
    required this.name,
    required this.team,
    required this.rating,
  });

  ManOfMatch copyWith({
    int? playerId,
    String? name,
    String? team,
    int? rating,
  }) {
    return ManOfMatch(
      playerId: playerId ?? this.playerId,
      name: name ?? this.name,
      team: team ?? this.team,
      rating: rating ?? this.rating,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'playerId': playerId,
      'name': name,
      'team': team,
      'rating': rating,
    };
  }

  factory ManOfMatch.fromJson(Map<String, dynamic> json) {
    return ManOfMatch(
      playerId: json['playerId'] as int,
      name: json['name'] as String,
      team: json['team'] as String,
      rating: json['rating'] as int,
    );
  }
}

class MatchResult {
  final int homeScore;
  final int awayScore;
  final List<MatchEvent> events;
  final MatchResultStats stats;
  final ManOfMatch manOfMatch;
  final MatchDuration duration;

  MatchResult({
    required this.homeScore,
    required this.awayScore,
    required List<MatchEvent> events,
    required this.stats,
    required this.manOfMatch,
    required this.duration,
  }) : events = List.unmodifiable(events);

  MatchResult copyWith({
    int? homeScore,
    int? awayScore,
    List<MatchEvent>? events,
    MatchResultStats? stats,
    ManOfMatch? manOfMatch,
    MatchDuration? duration,
  }) {
    return MatchResult(
      homeScore: homeScore ?? this.homeScore,
      awayScore: awayScore ?? this.awayScore,
      events: events ?? this.events,
      stats: stats ?? this.stats,
      manOfMatch: manOfMatch ?? this.manOfMatch,
      duration: duration ?? this.duration,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'homeScore': homeScore,
      'awayScore': awayScore,
      'events': events.map((event) => event.toJson()).toList(),
      'stats': stats.toJson(),
      'manOfMatch': manOfMatch.toJson(),
      'duration': duration.name,
    };
  }

  factory MatchResult.fromJson(Map<String, dynamic> json) {
    return MatchResult(
      homeScore: json['homeScore'] as int,
      awayScore: json['awayScore'] as int,
      events: (json['events'] as List<dynamic>)
          .map((item) => MatchEvent.fromJson(item as Map<String, dynamic>))
          .toList(),
      stats: MatchResultStats.fromJson(json['stats'] as Map<String, dynamic>),
      manOfMatch: ManOfMatch.fromJson(json['manOfMatch'] as Map<String, dynamic>),
      duration: MatchDurationExtensions.fromString(json['duration'] as String),
    );
  }
}

class MatchResultStats {
  final MatchStatistics home;
  final MatchStatistics away;

  const MatchResultStats({
    required this.home,
    required this.away,
  });

  MatchResultStats copyWith({
    MatchStatistics? home,
    MatchStatistics? away,
  }) {
    return MatchResultStats(
      home: home ?? this.home,
      away: away ?? this.away,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'home': home.toJson(),
      'away': away.toJson(),
    };
  }

  factory MatchResultStats.fromJson(Map<String, dynamic> json) {
    return MatchResultStats(
      home: MatchStatistics.fromJson(json['home'] as Map<String, dynamic>),
      away: MatchStatistics.fromJson(json['away'] as Map<String, dynamic>),
    );
  }
}
