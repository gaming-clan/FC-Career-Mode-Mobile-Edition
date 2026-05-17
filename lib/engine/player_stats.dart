class PlayerStats {
  final int pace;
  final int shooting;
  final int passing;
  final int dribbling;
  final int defense;
  final int physical;

  const PlayerStats({
    required this.pace,
    required this.shooting,
    required this.passing,
    required this.dribbling,
    required this.defense,
    required this.physical,
  });

  PlayerStats copyWith({
    int? pace,
    int? shooting,
    int? passing,
    int? dribbling,
    int? defense,
    int? physical,
  }) {
    return PlayerStats(
      pace: pace ?? this.pace,
      shooting: shooting ?? this.shooting,
      passing: passing ?? this.passing,
      dribbling: dribbling ?? this.dribbling,
      defense: defense ?? this.defense,
      physical: physical ?? this.physical,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'pace': pace,
      'shooting': shooting,
      'passing': passing,
      'dribbling': dribbling,
      'defense': defense,
      'physical': physical,
    };
  }

  factory PlayerStats.fromJson(Map<String, dynamic> json) {
    return PlayerStats(
      pace: json['pace'] as int,
      shooting: json['shooting'] as int,
      passing: json['passing'] as int,
      dribbling: json['dribbling'] as int,
      defense: json['defense'] as int,
      physical: json['physical'] as int,
    );
  }
}

class PlayerPerformanceRating {
  final int playerId;
  final double matchRating;
  final int goalsScored;
  final int assists;
  final int shotAccuracy;
  final int passAccuracy;
  final int tacklesWon;
  final int formChange;

  const PlayerPerformanceRating({
    required this.playerId,
    required this.matchRating,
    required this.goalsScored,
    required this.assists,
    required this.shotAccuracy,
    required this.passAccuracy,
    required this.tacklesWon,
    required this.formChange,
  });

  PlayerPerformanceRating copyWith({
    int? playerId,
    double? matchRating,
    int? goalsScored,
    int? assists,
    int? shotAccuracy,
    int? passAccuracy,
    int? tacklesWon,
    int? formChange,
  }) {
    return PlayerPerformanceRating(
      playerId: playerId ?? this.playerId,
      matchRating: matchRating ?? this.matchRating,
      goalsScored: goalsScored ?? this.goalsScored,
      assists: assists ?? this.assists,
      shotAccuracy: shotAccuracy ?? this.shotAccuracy,
      passAccuracy: passAccuracy ?? this.passAccuracy,
      tacklesWon: tacklesWon ?? this.tacklesWon,
      formChange: formChange ?? this.formChange,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'playerId': playerId,
      'matchRating': matchRating,
      'goalsScored': goalsScored,
      'assists': assists,
      'shotAccuracy': shotAccuracy,
      'passAccuracy': passAccuracy,
      'tacklesWon': tacklesWon,
      'formChange': formChange,
    };
  }

  factory PlayerPerformanceRating.fromJson(Map<String, dynamic> json) {
    return PlayerPerformanceRating(
      playerId: json['playerId'] as int,
      matchRating: (json['matchRating'] as num).toDouble(),
      goalsScored: json['goalsScored'] as int,
      assists: json['assists'] as int,
      shotAccuracy: json['shotAccuracy'] as int,
      passAccuracy: json['passAccuracy'] as int,
      tacklesWon: json['tacklesWon'] as int,
      formChange: json['formChange'] as int,
    );
  }
}

class ExpectedMatchStats {
  final double expectedGoals;
  final double expectedAssists;
  final int shotAccuracy;
  final int passAccuracy;
  final int tackleSuccess;

  const ExpectedMatchStats({
    required this.expectedGoals,
    required this.expectedAssists,
    required this.shotAccuracy,
    required this.passAccuracy,
    required this.tackleSuccess,
  });

  ExpectedMatchStats copyWith({
    double? expectedGoals,
    double? expectedAssists,
    int? shotAccuracy,
    int? passAccuracy,
    int? tackleSuccess,
  }) {
    return ExpectedMatchStats(
      expectedGoals: expectedGoals ?? this.expectedGoals,
      expectedAssists: expectedAssists ?? this.expectedAssists,
      shotAccuracy: shotAccuracy ?? this.shotAccuracy,
      passAccuracy: passAccuracy ?? this.passAccuracy,
      tackleSuccess: tackleSuccess ?? this.tackleSuccess,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'expectedGoals': expectedGoals,
      'expectedAssists': expectedAssists,
      'shotAccuracy': shotAccuracy,
      'passAccuracy': passAccuracy,
      'tackleSuccess': tackleSuccess,
    };
  }

  factory ExpectedMatchStats.fromJson(Map<String, dynamic> json) {
    return ExpectedMatchStats(
      expectedGoals: (json['expectedGoals'] as num).toDouble(),
      expectedAssists: (json['expectedAssists'] as num).toDouble(),
      shotAccuracy: json['shotAccuracy'] as int,
      passAccuracy: json['passAccuracy'] as int,
      tackleSuccess: json['tackleSuccess'] as int,
    );
  }
}
