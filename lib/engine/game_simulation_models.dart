class SimulationPlayer {
  final int id;
  final String firstName;
  final String lastName;
  final String position;
  final int overallRating;
  final int form;
  final int age;
  final int potential;
  final int contractEndYear;

  const SimulationPlayer({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.position,
    required this.overallRating,
    required this.form,
    required this.age,
    required this.potential,
    required this.contractEndYear,
  });

  SimulationPlayer copyWith({
    int? id,
    String? firstName,
    String? lastName,
    String? position,
    int? overallRating,
    int? form,
    int? age,
    int? potential,
    int? contractEndYear,
  }) {
    return SimulationPlayer(
      id: id ?? this.id,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      position: position ?? this.position,
      overallRating: overallRating ?? this.overallRating,
      form: form ?? this.form,
      age: age ?? this.age,
      potential: potential ?? this.potential,
      contractEndYear: contractEndYear ?? this.contractEndYear,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'firstName': firstName,
      'lastName': lastName,
      'position': position,
      'overallRating': overallRating,
      'form': form,
      'age': age,
      'potential': potential,
      'contractEndYear': contractEndYear,
    };
  }

  factory SimulationPlayer.fromJson(Map<String, dynamic> json) {
    return SimulationPlayer(
      id: json['id'] as int,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      position: json['position'] as String,
      overallRating: json['overallRating'] as int,
      form: json['form'] as int,
      age: json['age'] as int,
      potential: json['potential'] as int,
      contractEndYear: json['contractEndYear'] as int,
    );
  }
}

class SimulationClub {
  final int id;
  final String name;
  final int overallRating;

  const SimulationClub({
    required this.id,
    required this.name,
    required this.overallRating,
  });

  SimulationClub copyWith({
    int? id,
    String? name,
    int? overallRating,
  }) {
    return SimulationClub(
      id: id ?? this.id,
      name: name ?? this.name,
      overallRating: overallRating ?? this.overallRating,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'overallRating': overallRating,
    };
  }

  factory SimulationClub.fromJson(Map<String, dynamic> json) {
    return SimulationClub(
      id: json['id'] as int,
      name: json['name'] as String,
      overallRating: json['overallRating'] as int,
    );
  }
}

class SimulationMatchEvent {
  final int minute;
  final SimulationMatchEventType type;
  final int playerId;
  final int? assistPlayerId;
  final String description;

  const SimulationMatchEvent({
    required this.minute,
    required this.type,
    required this.playerId,
    this.assistPlayerId,
    required this.description,
  });

  SimulationMatchEvent copyWith({
    int? minute,
    SimulationMatchEventType? type,
    int? playerId,
    int? assistPlayerId,
    String? description,
  }) {
    return SimulationMatchEvent(
      minute: minute ?? this.minute,
      type: type ?? this.type,
      playerId: playerId ?? this.playerId,
      assistPlayerId: assistPlayerId ?? this.assistPlayerId,
      description: description ?? this.description,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'minute': minute,
      'type': type.name,
      'playerId': playerId,
      'assistPlayerId': assistPlayerId,
      'description': description,
    };
  }

  factory SimulationMatchEvent.fromJson(Map<String, dynamic> json) {
    return SimulationMatchEvent(
      minute: json['minute'] as int,
      type: SimulationMatchEventTypeExtensions.fromString(json['type'] as String),
      playerId: json['playerId'] as int,
      assistPlayerId: json['assistPlayerId'] as int?,
      description: json['description'] as String,
    );
  }
}

enum SimulationMatchEventType { goal, assist, yellowCard, redCard, substitution, injury }

extension SimulationMatchEventTypeExtensions on SimulationMatchEventType {
  String get name {
    return switch (this) {
      SimulationMatchEventType.goal => 'goal',
      SimulationMatchEventType.assist => 'assist',
      SimulationMatchEventType.yellowCard => 'yellow_card',
      SimulationMatchEventType.redCard => 'red_card',
      SimulationMatchEventType.substitution => 'substitution',
      SimulationMatchEventType.injury => 'injury',
    };
  }

  static SimulationMatchEventType fromString(String value) {
    return switch (value) {
      'goal' => SimulationMatchEventType.goal,
      'assist' => SimulationMatchEventType.assist,
      'yellow_card' => SimulationMatchEventType.yellowCard,
      'red_card' => SimulationMatchEventType.redCard,
      'substitution' => SimulationMatchEventType.substitution,
      'injury' => SimulationMatchEventType.injury,
      _ => throw ArgumentError('Unknown SimulationMatchEventType: $value'),
    };
  }
}

class SimulationMatchResult {
  final int homeGoals;
  final int awayGoals;
  final List<SimulationMatchEvent> events;
  final Map<int, double> homePlayerRatings;
  final Map<int, double> awayPlayerRatings;

  SimulationMatchResult({
    required this.homeGoals,
    required this.awayGoals,
    required List<SimulationMatchEvent> events,
    required Map<int, double> homePlayerRatings,
    required Map<int, double> awayPlayerRatings,
  })  : events = List.unmodifiable(events),
        homePlayerRatings = Map.unmodifiable(homePlayerRatings),
        awayPlayerRatings = Map.unmodifiable(awayPlayerRatings);

  SimulationMatchResult copyWith({
    int? homeGoals,
    int? awayGoals,
    List<SimulationMatchEvent>? events,
    Map<int, double>? homePlayerRatings,
    Map<int, double>? awayPlayerRatings,
  }) {
    return SimulationMatchResult(
      homeGoals: homeGoals ?? this.homeGoals,
      awayGoals: awayGoals ?? this.awayGoals,
      events: events ?? this.events,
      homePlayerRatings: homePlayerRatings ?? this.homePlayerRatings,
      awayPlayerRatings: awayPlayerRatings ?? this.awayPlayerRatings,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'homeGoals': homeGoals,
      'awayGoals': awayGoals,
      'events': events.map((event) => event.toJson()).toList(),
      'homePlayerRatings': homePlayerRatings.map((key, value) => MapEntry(key.toString(), value)),
      'awayPlayerRatings': awayPlayerRatings.map((key, value) => MapEntry(key.toString(), value)),
    };
  }

  factory SimulationMatchResult.fromJson(Map<String, dynamic> json) {
    return SimulationMatchResult(
      homeGoals: json['homeGoals'] as int,
      awayGoals: json['awayGoals'] as int,
      events: (json['events'] as List<dynamic>)
          .map((item) => SimulationMatchEvent.fromJson(item as Map<String, dynamic>))
          .toList(),
      homePlayerRatings: (json['homePlayerRatings'] as Map<String, dynamic>).map(
        (key, value) => MapEntry(int.parse(key), (value as num).toDouble()),
      ),
      awayPlayerRatings: (json['awayPlayerRatings'] as Map<String, dynamic>).map(
        (key, value) => MapEntry(int.parse(key), (value as num).toDouble()),
      ),
    );
  }
}

class SimulationPlayerMarketValue {
  final int playerId;
  final double marketValue;

  const SimulationPlayerMarketValue({
    required this.playerId,
    required this.marketValue,
  });
}
