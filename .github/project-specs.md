# ⚙️ Specifikimet e Projektit (Flutter Migration)

## 1. Mjedisi i Zhvillimit
- **Flutter Version:** `3.24.x` (ose versioni yt aktual `3.41`).
- **Dart SDK:** `^3.5.x`.
- **Namespace:** `com.fcmanager.app`.
- **Target Platform:** Mobile (Android & iOS). Kthyer në portrait-only (9:16).

## 2. Arkitektura (Domain-Driven Design)
Meqenëse logjika origjinale e lojës (Game Engine) është në TypeScript, kodi në Flutter do të ndahet strikt në:
- `lib/engine/`: Portimi 1:1 i gjithë TS engine në Dart pure (Pa asnjë varësi nga Flutter UI).
- `lib/data/`: Databaza lokale për ruajtjen e saves.
- `lib/ui/`: Komponentët dhe ekranet e ndërtuara me Flutter.

## 3. Varësitë Kryesore (Dependencies)
- `flutter_riverpod: ^2.5.1` (Për State Management, thelbësore për një lojë komplekse me shumë state).
- `sqflite` ose `isar` (Për zëvendësimin e Drizzle ORM dhe ruajtjen e lojës offline).
- `google_fonts: ^6.2.1` (Për Archivo Narrow, Inter, JetBrains Mono).
- `glassmorphism: ^3.0.0` (Ose implementim manual me `BackdropFilter`).
- `fl_chart: ^0.68.0` (Për analizën financiare dhe zhvillimin e lojtarëve).

## 4. Rregullat e Git Workflow
- Branch-i kryesor: `main` (Vetëm versione të qëndrueshme).
- Branch-i i zhvillimit: `develop`.
- Commits convention: `feat:`, `fix:`, `chore:`, `engine:`.