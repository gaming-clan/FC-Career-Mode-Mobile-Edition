# Software Specification Document (SSD)
## FC Career Mode — Mobile Edition (Flutter Version)

---

| Fusha | Detajet |
|---|---|
| **Platforma** | Flutter (Android, iOS - Portrait Only) |
| **Gjuha e Kodimit**| Dart 3.x |
| **Tema e UI** | Stadium Night (Dark/Neon) |

---

## 1. Përmbledhje
**FC Career Mode** është një simulim i plotë, thellësisht strategjik dhe offline i menaxhimit të futbollit për pajisjet celulare. Kalimi nga React Native në Flutter siguron performancë vizuale të lartë prej 60fps gjatë simulimeve të ndeshjes dhe animacioneve UI.

## 2. Arkitektura e Engine-it (Dart Port)
Motori origjinal konsiston në 4 skedarë thelbësorë që do të jenë nën-modulet e `lib/engine/`:
- **`player_stats.dart`**: Algoritmet e rritjes sipas moshës (Ages 16-23 rapid, 33+ decline), format, llogaritja e xG për secilin pozicion.
- **`match_simulation.dart`**: Algoritmi core. Duhet të ekzekutojë ciklin "Posedim -> Shans xG -> Randomness i gjuajtjes -> Event (Goal, Miss, Save, Foul)".
- **`club_squad_management.dart`**: Logjika për promovimet e akademisë, balancën e moshës, transferimet bazike.
- **`career_engine.dart`**: Sistemi i kohës. Rritja e javëve (`advanceMatchday`), dhe simulimi i fund-sezonit (`endSeason`).

## 3. Specifikimet e Ekraneve Kryesore (Flutter UI)

### 3.1 Manager Dashboard (`DashboardScreen`)
- **Header:** Emri i Menaxherit, Logoja, Ora e ndeshjes së radhës.
- **Karta "Next Match":** Imazh sfondi stadiumi i errët, Logos e dy klubeve. Buton masiv "PLAY MATCH" me Electric Lime ngjyrë.
- **Mini-Stats:** Pozicioni në ligë, Forma e fundit (5 topa jeshilë/kuq), Top Shënuesi.

### 3.2 Squad Management (`SquadScreen`)
- Ekran për të menaxhuar formacionin (P.sh. 4-3-3 Attacking).
- **Lista e Lojtarëve:** Karta individuale `GlassCard`. 
  - Të shfaqë formën (FIT dhe MOR bar).
  - Indikatorë specifikë (L. Martinez "Excellent Form", K. De Bruyne "Fatigue Alert").
- Buton floating "AUTO-PICK" për rregullim të shpejtë të lodhjes.

### 3.3 Live Match Simulation (`LiveMatchScreen`)
- Ekrani më kritik i lojës, duhet të ndihet "i gjallë".
- **Koka e Ekranit:** Koha që ecën (Timer widget nga Riverpod). Rezultati i madh në mes.
- **Progress Bars (Fl_Chart):** Vizualizim i Posedimit të Topit (p.sh. 62% - 38%). Vizualizim i xG.
- **Event Log:** Ticker poshtë që shfaq komente (p.sh., "Salah thyen krahun, gjuajtje e jashtëzakonshme...").
- **Veprimet In-Game:** Butona për ndërrime ("Make Sub") dhe ndryshim mentaliteti ("Mentality").

### 3.4 Sporting Director (`DirectorScreen`)
- Përfaqëson pamjen "Macro" të lojës.
- Analiza financiare (Buxheti, Pagat, Të ardhurat). Përdor `LinearProgressIndicator` për thellësinë e buxhetit.
- Synimet e Bordit ("Sign U23", "Expand Stadium").
- Sistemi OCR/Skautimit.

## 4. Menaxhimi i Gjendjes (State)
```dart
class CareerGameState {
  final Club playerClub;
  final List<Fixture> fixtures;
  final List<Player> squad;
  final SeasonStats stats;
  // ...etj
}