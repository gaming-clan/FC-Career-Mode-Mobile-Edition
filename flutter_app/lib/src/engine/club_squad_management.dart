class SquadStats {
  final int totalPlayers;
  final double averageAge;
  final double averageRating;
  final List<int> formation;
  final Map<String, int> positionCoverage;
  final int injuredPlayers;
  final int homegrowPlayers;
  final int foreignPlayers;

  SquadStats({
    required this.totalPlayers,
    required this.averageAge,
    required this.averageRating,
    required List<int> formation,
    required Map<String, int> positionCoverage,
    required this.injuredPlayers,
    required this.homegrowPlayers,
    required this.foreignPlayers,
  }) : formation = List.unmodifiable(formation),
       positionCoverage = Map.unmodifiable(positionCoverage);

  SquadStats copyWith({
    int? totalPlayers,
    double? averageAge,
    double? averageRating,
    List<int>? formation,
    Map<String, int>? positionCoverage,
    int? injuredPlayers,
    int? homegrowPlayers,
    int? foreignPlayers,
  }) {
    return SquadStats(
      totalPlayers: totalPlayers ?? this.totalPlayers,
      averageAge: averageAge ?? this.averageAge,
      averageRating: averageRating ?? this.averageRating,
      formation: formation ?? this.formation,
      positionCoverage: positionCoverage ?? this.positionCoverage,
      injuredPlayers: injuredPlayers ?? this.injuredPlayers,
      homegrowPlayers: homegrowPlayers ?? this.homegrowPlayers,
      foreignPlayers: foreignPlayers ?? this.foreignPlayers,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'totalPlayers': totalPlayers,
      'averageAge': averageAge,
      'averageRating': averageRating,
      'formation': formation,
      'positionCoverage': positionCoverage,
      'injuredPlayers': injuredPlayers,
      'homegrowPlayers': homegrowPlayers,
      'foreignPlayers': foreignPlayers,
    };
  }

  factory SquadStats.fromJson(Map<String, dynamic> json) {
    return SquadStats(
      totalPlayers: json['totalPlayers'] as int,
      averageAge: (json['averageAge'] as num).toDouble(),
      averageRating: (json['averageRating'] as num).toDouble(),
      formation: List<int>.from(json['formation'] as List<dynamic>),
      positionCoverage: Map<String, int>.from(
        json['positionCoverage'] as Map<String, dynamic>,
      ),
      injuredPlayers: json['injuredPlayers'] as int,
      homegrowPlayers: json['homegrowPlayers'] as int,
      foreignPlayers: json['foreignPlayers'] as int,
    );
  }
}

class ClubFinancials {
  final double budget;
  final double weeklyWages;
  final double monthlyRevenue;
  final int stadiumCapacity;
  final int attendancePerMatch;
  final double ticketPrice;
  final double sponsorshipDeals;
  final double merchandiseSales;
  final double competitionPrizePool;

  const ClubFinancials({
    required this.budget,
    required this.weeklyWages,
    required this.monthlyRevenue,
    required this.stadiumCapacity,
    required this.attendancePerMatch,
    required this.ticketPrice,
    required this.sponsorshipDeals,
    required this.merchandiseSales,
    required this.competitionPrizePool,
  });

  ClubFinancials copyWith({
    double? budget,
    double? weeklyWages,
    double? monthlyRevenue,
    int? stadiumCapacity,
    int? attendancePerMatch,
    double? ticketPrice,
    double? sponsorshipDeals,
    double? merchandiseSales,
    double? competitionPrizePool,
  }) {
    return ClubFinancials(
      budget: budget ?? this.budget,
      weeklyWages: weeklyWages ?? this.weeklyWages,
      monthlyRevenue: monthlyRevenue ?? this.monthlyRevenue,
      stadiumCapacity: stadiumCapacity ?? this.stadiumCapacity,
      attendancePerMatch: attendancePerMatch ?? this.attendancePerMatch,
      ticketPrice: ticketPrice ?? this.ticketPrice,
      sponsorshipDeals: sponsorshipDeals ?? this.sponsorshipDeals,
      merchandiseSales: merchandiseSales ?? this.merchandiseSales,
      competitionPrizePool: competitionPrizePool ?? this.competitionPrizePool,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'budget': budget,
      'weeklyWages': weeklyWages,
      'monthlyRevenue': monthlyRevenue,
      'stadiumCapacity': stadiumCapacity,
      'attendancePerMatch': attendancePerMatch,
      'ticketPrice': ticketPrice,
      'sponsorshipDeals': sponsorshipDeals,
      'merchandiseSales': merchandiseSales,
      'competitionPrizePool': competitionPrizePool,
    };
  }

  factory ClubFinancials.fromJson(Map<String, dynamic> json) {
    return ClubFinancials(
      budget: (json['budget'] as num).toDouble(),
      weeklyWages: (json['weeklyWages'] as num).toDouble(),
      monthlyRevenue: (json['monthlyRevenue'] as num).toDouble(),
      stadiumCapacity: json['stadiumCapacity'] as int,
      attendancePerMatch: json['attendancePerMatch'] as int,
      ticketPrice: (json['ticketPrice'] as num).toDouble(),
      sponsorshipDeals: (json['sponsorshipDeals'] as num).toDouble(),
      merchandiseSales: (json['merchandiseSales'] as num).toDouble(),
      competitionPrizePool: (json['competitionPrizePool'] as num).toDouble(),
    );
  }
}

class YouthPlayerPromotion {
  final int playerId;
  final String name;
  final int age;
  final int overallRating;
  final String position;
  final int readinessScore;
  final String recommendation;

  const YouthPlayerPromotion({
    required this.playerId,
    required this.name,
    required this.age,
    required this.overallRating,
    required this.position,
    required this.readinessScore,
    required this.recommendation,
  });

  YouthPlayerPromotion copyWith({
    int? playerId,
    String? name,
    int? age,
    int? overallRating,
    String? position,
    int? readinessScore,
    String? recommendation,
  }) {
    return YouthPlayerPromotion(
      playerId: playerId ?? this.playerId,
      name: name ?? this.name,
      age: age ?? this.age,
      overallRating: overallRating ?? this.overallRating,
      position: position ?? this.position,
      readinessScore: readinessScore ?? this.readinessScore,
      recommendation: recommendation ?? this.recommendation,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'playerId': playerId,
      'name': name,
      'age': age,
      'overallRating': overallRating,
      'position': position,
      'readinessScore': readinessScore,
      'recommendation': recommendation,
    };
  }

  factory YouthPlayerPromotion.fromJson(Map<String, dynamic> json) {
    return YouthPlayerPromotion(
      playerId: json['playerId'] as int,
      name: json['name'] as String,
      age: json['age'] as int,
      overallRating: json['overallRating'] as int,
      position: json['position'] as String,
      readinessScore: json['readinessScore'] as int,
      recommendation: json['recommendation'] as String,
    );
  }
}
