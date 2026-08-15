import 'dart:math';

class PlayerStats {
  final int playerId;
  final int stamina;
  final int fitness;
  final int form;
  final int morale;
  final int cleanSheets;
  final int saves;
  final int goals;
  final int assists;
  final int keyPasses;
  final int tackles;
  final int interceptions;
  final int dribbles;
  final int shotAccuracy;
  final int passAccuracy;

  const PlayerStats({
    required this.playerId,
    required this.stamina,
    required this.fitness,
    required this.form,
    required this.morale,
    required this.cleanSheets,
    required this.saves,
    required this.goals,
    required this.assists,
    required this.keyPasses,
    required this.tackles,
    required this.interceptions,
    required this.dribbles,
    required this.shotAccuracy,
    required this.passAccuracy,
  });

  PlayerStats copyWith({
    int? playerId,
    int? stamina,
    int? fitness,
    int? form,
    int? morale,
    int? cleanSheets,
    int? saves,
    int? goals,
    int? assists,
    int? keyPasses,
    int? tackles,
    int? interceptions,
    int? dribbles,
    int? shotAccuracy,
    int? passAccuracy,
  }) {
    return PlayerStats(
      playerId: playerId ?? this.playerId,
      stamina: stamina ?? this.stamina,
      fitness: fitness ?? this.fitness,
      form: form ?? this.form,
      morale: morale ?? this.morale,
      cleanSheets: cleanSheets ?? this.cleanSheets,
      saves: saves ?? this.saves,
      goals: goals ?? this.goals,
      assists: assists ?? this.assists,
      keyPasses: keyPasses ?? this.keyPasses,
      tackles: tackles ?? this.tackles,
      interceptions: interceptions ?? this.interceptions,
      dribbles: dribbles ?? this.dribbles,
      shotAccuracy: shotAccuracy ?? this.shotAccuracy,
      passAccuracy: passAccuracy ?? this.passAccuracy,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'playerId': playerId,
      'stamina': stamina,
      'fitness': fitness,
      'form': form,
      'morale': morale,
      'cleanSheets': cleanSheets,
      'saves': saves,
      'goals': goals,
      'assists': assists,
      'keyPasses': keyPasses,
      'tackles': tackles,
      'interceptions': interceptions,
      'dribbles': dribbles,
      'shotAccuracy': shotAccuracy,
      'passAccuracy': passAccuracy,
    };
  }

  factory PlayerStats.fromJson(Map<String, dynamic> json) {
    return PlayerStats(
      playerId: json['playerId'] as int,
      stamina: json['stamina'] as int,
      fitness: json['fitness'] as int,
      form: json['form'] as int,
      morale: json['morale'] as int,
      cleanSheets: json['cleanSheets'] as int,
      saves: json['saves'] as int,
      goals: json['goals'] as int,
      assists: json['assists'] as int,
      keyPasses: json['keyPasses'] as int,
      tackles: json['tackles'] as int,
      interceptions: json['interceptions'] as int,
      dribbles: json['dribbles'] as int,
      shotAccuracy: json['shotAccuracy'] as int,
      passAccuracy: json['passAccuracy'] as int,
    );
  }
}

class PlayerRating {
  final int playerId;
  final double rating;
  final double influence;

  const PlayerRating({
    required this.playerId,
    required this.rating,
    required this.influence,
  });

  PlayerRating copyWith({int? playerId, double? rating, double? influence}) {
    return PlayerRating(
      playerId: playerId ?? this.playerId,
      rating: rating ?? this.rating,
      influence: influence ?? this.influence,
    );
  }

  Map<String, dynamic> toJson() {
    return {'playerId': playerId, 'rating': rating, 'influence': influence};
  }

  factory PlayerRating.fromJson(Map<String, dynamic> json) {
    return PlayerRating(
      playerId: json['playerId'] as int,
      rating: (json['rating'] as num).toDouble(),
      influence: (json['influence'] as num).toDouble(),
    );
  }
}

class ExpectedGoalModel {
  static double computeExpectedGoals({
    required int shooting,
    required int pace,
    required int positioning,
    required int teamMomentum,
  }) {
    final double shotQuality =
        (shooting * 0.45) + (pace * 0.2) + (positioning * 0.2);
    final double momentumBonus = teamMomentum / 100.0;
    final double xg = shotQuality * 0.008 + momentumBonus * 0.02;
    return xg.clamp(0.01, 0.75);
  }

  static int rollGoals(double xg, Random random) {
    final double expected = max(0.0, xg * 2.5);
    final int goals = random.nextDouble() < expected - expected.floor()
        ? expected.ceil()
        : expected.floor();
    return goals;
  }
}

class MatchFitness {
  static int computeEffectiveFitness({
    required int fitness,
    required int stamina,
    required int minutesPlayed,
    required int fatigueFactor,
  }) {
    final int fatigue = (minutesPlayed / 90.0 * fatigueFactor).round();
    return max(0, min(100, fitness - fatigue + (stamina ~/ 10)));
  }
}

class PlayerProgression {
  static int updateAge({
    required int currentAge,
    required double potential,
    required int currentRating,
    required int seasonExperience,
  }) {
    final double growthRate = potential / 100.0;
    final int delta = (growthRate * seasonExperience / 10.0).round();
    final int agedRating = currentRating + delta;
    return max(1, min(99, agedRating));
  }
}
