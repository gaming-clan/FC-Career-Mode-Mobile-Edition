This project uses Expo (managed workflow). Below are the recommended ways to build an APK you can install on an Android device.

Prerequisites
- Node.js and your package manager (pnpm / npm / yarn).
- Android SDK + platform tools (for local builds / `adb` installs).
- Expo account (required for EAS builds).
- `eas-cli` for EAS builds.

Option A — Build using EAS (recommended)
1. Install EAS CLI:

```bash
npm install -g eas-cli
# or pnpm add -g eas-cli
```

2. Login to Expo (follow prompts):

```bash
eas login
```

3. Configure credentials (first-time only):

```bash
eas build:configure
```

4. Start an Android APK build (preview profile):

```bash
eas build -p android --profile preview
```

5. When build finishes you'll get a URL to download the `.apk` (or `.aab`). Install it on your phone or share the link.

Notes:
- `eas.json` is included in the repo with `production` and `preview` profiles producing an `apk`.
- EAS Build runs in Expo servers and handles signing for you (you can also provide keystore).
- This repository workflow expects a repository secret named `TEST_ROBOT` containing a valid Expo token (set in GitHub → Settings → Secrets → Actions).

Option B — Run on a connected Android device (debug/run)
Requires Android SDK + ADB and a connected device or emulator.

```bash
# start metro and install+run on device (must have Android toolchain)
pnpm install
pnpm dev:metro
# in another terminal
expo run:android
```

Option C — Local native build (advanced)
You can `eject` / prebuild and run Gradle locally, but this requires full Android Studio setup.

Quick adb install after obtaining an APK

```bash
# install or replace existing app
adb install -r path/to/app-release.apk
```

If you want, I can:
- Prepare further EAS settings (keystore, release channels).
- Attempt to run a remote EAS build from this environment if you provide Expo account credentials (not recommended to paste secrets here — use an interactive session or CI secrets).

Which option do you want me to prepare next? If you want me to trigger a remote EAS build, I can guide you to securely provide the credentials or run the commands locally for you.