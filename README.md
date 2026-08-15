# FC Career Mode Mobile Edition

FC Career Mode Mobile Edition is an offline football-management simulation built with **Flutter and Dart**. The application targets Android first and uses a pure-Dart game engine so match simulation, career progression, squad data, and season statistics remain independent from the Flutter presentation layer.

> The React Native/TypeScript implementation has been removed from the active repository. `flutter_app/` is now the sole application project.

## Current capabilities

The migrated application currently provides a functional career dashboard with seeded club data, an 11-player squad, league fixtures, match simulation, season statistics, league-table updates, youth-academy intake, budget and squad summaries, and a dark stadium-inspired design system. The engine also includes reusable modules for player statistics, squad management, club finances, season progression, and simulation data models.

| Area | Flutter implementation |
|---|---|
| Application entry point | `flutter_app/lib/main.dart` |
| Career state | `flutter_app/lib/src/state/career_state.dart` |
| Career engine | `flutter_app/lib/src/engine/career_engine.dart` |
| Match simulation | `flutter_app/lib/src/engine/match_simulation.dart` |
| Domain models | `flutter_app/lib/src/engine/` |
| UI | `flutter_app/lib/src/ui/` |
| Tests | `flutter_app/test/` |
| Assets | `flutter_app/assets/images/` |

## Requirements

Install Flutter with a Dart SDK compatible with the version declared in `flutter_app/pubspec.yaml`. Android development additionally requires Android Studio, an Android SDK, and either an emulator or a USB-connected device. The application is offline-first and does not require a server, database service, JavaScript runtime, or network connection during gameplay.

## Getting started

Clone the repository and enter the Flutter project:

```bash
git clone https://github.com/gaming-clan/FC-Career-Mode-Mobile-Edition.git
cd FC-Career-Mode-Mobile-Edition/flutter_app
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
cd flutter_app
flutter format --set-exit-if-changed lib test
flutter analyze
flutter test
flutter build apk --debug
```

The test suite covers dashboard rendering and match-simulation invariants, including rejection of empty rosters, possession totals, goal-event counts, and regulation-time event bounds.

## Repository hygiene

The repository contains only the Flutter application as an active build target. Generated folders such as `flutter_app/.dart_tool/`, `flutter_app/build/`, and platform-specific generated files should remain ignored by Git. Do not reintroduce JavaScript or Expo tooling unless the project requirements explicitly change.

## License

This project is licensed under the GNU General Public License v3.0. See [LICENSE](LICENSE) for the complete license text.
