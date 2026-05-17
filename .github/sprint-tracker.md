# 🏃 Sprint Tracker: Flutter Rewrite

## Sprint 1: Portimi i Game Engine (Dart) - IN PROGRESS
Qëllimi: Të përkthehet e gjithë logjika e TypeScript në Dart.
- [ ] Përkthimi i Modeleve (Player, Club, Fixture, MatchSetup).
- [ ] Portimi i `player-stats.ts` (Kalkulimet e formës, rritjes, vlerës).
- [ ] Portimi i `match-simulation.ts` (Logjika xG, eventet e ndeshjes).
- [ ] Portimi i `career-engine.ts` (Progresi ditor, mbarimi i sezonit).
- [ ] Shkrimi i Unit Tests në Dart për të verifikuar që motori jep të njëjtat rezultate si ai TS.

## Sprint 2: Baza e UI dhe Theme
Qëllimi: Setup i strukturës vizuale "Stadium Night".
- [ ] Krijimi i `theme.dart` dhe `colors.dart`.
- [ ] Ndërtimi i Shared Widgets (`GlassCard`, `NeonButton`, `StatBar`).
- [ ] Ndërtimi i `TopAppBar` dhe `BottomNavBar` me ikonat Material.

## Sprint 3: Implementimi i Ekraneve Kryesore
Qëllimi: Lidhja e Data/Engine me Flutter UI.
- [ ] Ndërtimi i `Home Menu` (Continue Career, New Game).
- [ ] Ndërtimi i `Manager Dashboard` (Lajmet, Fiksturat).
- [ ] Ndërtimi i `Squad Management` (Karta e L. Martinez, De Bruyne etj.).
- [ ] Ndërtimi i `Live Match Day` (Simulimi vizual me kohë reale).

## Sprint 4: State Management & Persistence
- [ ] Lidhja e Riverpod për të menaxhuar `CareerGameState`.
- [ ] Integrimi i SQLite/Isar për të ruajtur Save Files lokalisht.