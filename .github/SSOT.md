# 🗺️ Single Source of Truth (SSOT) - FC Career Mode Flutter

## 1. Përmbledhja e Arkitekturës
Ky projekt është një portim i plotë i **FC Career Mode Mobile Edition** nga React Native/TypeScript në **Flutter/Dart**.
Arkitektura bazohet në ndarjen strikte mes **Game Engine** (Logjika pure matematike/Dart) dhe **Presentation Layer** (UI/Flutter).

## 2. Stack-u Teknologjik i Ri
- **UI Framework:** Flutter (Target: Android/iOS Portrait 9:16).
- **Gjuha:** Dart 3.x (Strikt me Null Safety).
- **State Management:** `flutter_riverpod` (Për menaxhimin e gjendjes globale `CareerGameState`).
- **Storage/DB:** `isar` ose `sqflite` (Për ruajtjen lokale të karrierës dhe databazës së lojtarëve).
- **Design System:** Tema "Stadium Night" me efekte të thella *Glassmorphism*.

## 3. Struktura Zyrtare e Direktorive (Flutter)
```text
lib/
├── core/
│   ├── theme/          # Ngjyrat, tipografia (Stadium Night)
│   └── constants/      # game_balance.dart (Të gjitha variablat e balancës së lojës)
├── data/
│   ├── models/         # Player, Club, Fixture, MatchSetup (Modelet Dart)
│   └── database/       # Lidhja me Isar/SQLite
├── engine/             # *ZEMRA E LOJËS* (Asnjë varësi nga Flutter UI këtu)
│   ├── player_stats.dart
│   ├── match_simulation.dart
│   ├── club_squad_management.dart
│   └── career_engine.dart
├── state/              # Providers të Riverpod
│   └── game_state_provider.dart
└── ui/
    ├── shared/         # GlassCard, NeonButton, StatBar
    └── screens/        # Dashboard, Squad, LiveMatch, TransferMarket