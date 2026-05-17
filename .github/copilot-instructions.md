# 🤖 Udhëzime për Copilot / AI Assistant

## 1. Konteksti
Po zhvillojmë "FC Career Mode", një lojë menaxhimi futbolli offline. Projekti po migrohet nga React Native/TypeScript drejt **Flutter/Dart**. 

## 2. Arkitektura & Kthimi i TS në Dart
- **KURRË** mos sugjero kod TypeScript apo React. Jemi strikt në Flutter/Dart.
- Kur të kërkoj të portosh një skedar nga `lib/game-engine.ts`, ktheje në logjikë Dart duke përdorur klasa, enum, dhe factory constructors.
- Ruaj saktësisht formulat matematikore origjinale (p.sh. kalkulimi i xG ose rritja e moshës së lojtarit).

## 3. Rregullat e UI & Dizajnit
- Sfondi i aplikacionit është gjithmonë i errët. Mos sugjero ngjyra të bardha për sfond.
- Përdor objektin `Theme.of(context).colorScheme` për ngjyrat.
- Për numrat (statistikat, koha), përdor gjithmonë fontin `JetBrains Mono` me widget-in `Text`.
- Gjithmonë mbështilli kartat me efektin *Glassmorphism* (Sfond i tejdukshëm me `BackdropFilter` ose ngjyrë me opacitet `0.4`).

## 4. State Management
- Do të përdorim **Riverpod** (`NotifierProvider` ose `StateNotifierProvider`).
- Sigurohu që GameState të jetë i pandryshueshëm (Immutable) dhe të përditësohet duke bërë `copyWith` për të shmangur side-effects gjatë simulimit të ndeshjeve.