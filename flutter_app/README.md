# FC Career Mode Mobile Edition

This directory is the canonical Flutter application for FC Career Mode Mobile Edition. It contains the production app, pure-Dart career engine, assets, platform runners, and tests.

## Development

Use a Flutter SDK compatible with the Dart constraint in `pubspec.yaml`:

```bash
flutter pub get
flutter format --set-exit-if-changed lib test
flutter analyze
flutter test
flutter run
```

Build an Android release with:

```bash
flutter build apk --release
```

## Structure

The domain engine lives under `lib/src/engine/` and has no Flutter UI dependency. Career state and seeded application data live under `lib/src/state/`. Flutter screens and shared visual components live under `lib/src/ui/`. The dashboard uses Riverpod to expose career state and trigger match simulation and youth-academy actions.

## Testing

The test suite includes widget coverage for the seeded dashboard and unit coverage for match simulation invariants. Before submitting changes, run `flutter analyze`, `flutter test`, and a debug build for the target platform.

## Offline behavior

The current application does not require a backend or network connection to launch or simulate the seeded career. Future persistence should be added behind the state-controller boundary rather than coupling storage concerns to widgets or engine models.
