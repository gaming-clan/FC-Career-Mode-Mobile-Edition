# FC Career Mode Mobile Edition

FC Career Mode Mobile Edition is an offline football-management simulation built with **Flutter and Dart**. The application targets Android first and uses a pure-Dart game engine so match simulation, career progression, squad data, and season statistics remain independent from the Flutter presentation layer.

> The React Native/TypeScript implementation has been removed from the active repository. `fc_career_mode/` is now the sole application project.

## Current capabilities

The migrated application currently provides a functional career dashboard with seeded club data, an 11-player squad, league fixtures, match simulation, season statistics, league-table updates, youth-academy intake, budget and squad summaries, and a dark stadium-inspired design system. The engine also includes reusable modules for player statistics, squad management, club finances, season progression, and simulation data models.

| Area | Flutter implementation |
|---|---|
| Application entry point | `fc_career_mode/lib/main.dart` |
| Career state | `fc_career_mode/lib/src/state/career_state.dart` |
| Career engine | `fc_career_mode/lib/src/engine/career_engine.dart` |
| Match simulation | `fc_career_mode/lib/src/engine/match_simulation.dart` |
| Domain models | `fc_career_mode/lib/src/engine/` |
| UI | `fc_career_mode/lib/src/ui/` |
| Tests | `fc_career_mode/test/` |
| Assets | `fc_career_mode/assets/images/` |

## Requirements

Install Flutter with a Dart SDK compatible with the version declared in `fc_career_mode/pubspec.yaml`. Android development additionally requires Android Studio, an Android SDK, and either an emulator or a USB-connected device. The application is offline-first and does not require a server, database service, JavaScript runtime, or network connection during gameplay.

## Getting started

Clone the repository and enter the Flutter project:

```bash
git clone https://github.com/gaming-clan/FC-Career-Mode-Mobile-Edition.git
cd FC-Career-Mode-Mobile-Edition/fc_career_mode
flutter pub get
flutter analyze
flutter test
```

To run the application on a connected device or emulator:

```bash
flutter devices
flutter run
```

To create a release APK:

```bash
flutter build apk --release
```

The generated APK is written under `build/app/outputs/flutter-apk/`. For a smaller architecture-specific distribution, use `flutter build apk --split-per-abi --release`.

## Architecture

The project follows a strict separation between domain logic and presentation. The engine in `lib/src/engine/` contains serializable models and deterministic or injectable simulation logic. `CareerEngine` owns career transitions, while `MatchSimulator` handles match outcomes. Riverpod state in `lib/src/state/` exposes the active career to Flutter widgets without coupling the engine to UI code.

The initial career is intentionally seeded in `CareerController` so the application is immediately playable after installation. Persistence can be added behind the same controller boundary without changing the engine or dashboard contracts.

## Verification

Run the complete Flutter verification set before submitting changes:

```bash
cd fc_career_mode
flutter format --set-exit-if-changed lib test
flutter analyze
flutter test
flutter build apk --debug
```

The test suite covers dashboard rendering and match-simulation invariants, including rejection of empty rosters, possession totals, goal-event counts, and regulation-time event bounds.

## Repository hygiene

The repository contains only the Flutter application as an active build target. Generated folders such as `fc_career_mode/.dart_tool/`, `fc_career_mode/build/`, and platform-specific generated files should remain ignored by Git. Do not reintroduce JavaScript or Expo tooling unless the project requirements explicitly change.

## License

This project is licensed under the GNU General Public License v3.0. See [LICENSE](LICENSE) for the complete license text.
