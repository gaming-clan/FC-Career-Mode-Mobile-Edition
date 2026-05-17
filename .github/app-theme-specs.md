# 🎨 Specifikimet e Temës: Stadium Night

## 1. Filozofia e Dizajnit
FC Career Mode përdor stilin **Stadium Night** me elemente **Glassmorphism**. Synimi është krijimi i një atmosfere të tensionuar, profesionale dhe premium, që imiton ndjesinë e të qenit në një stadium futbolli natën, nën dritat e prozhektorëve.

## 2. Paleta e Ngjyrave (Hex)
| Kategoria | Ngjyra | Kodi | Roli |
| :--- | :--- | :--- | :--- |
| **Background** | Deep Navy | `#051426` | Sfondi global i aplikacionit, qielli i natës |
| **Surface** | Slate Gray | `#122033` | Kartat kryesore, kontejnerët e moduleve |
| **Surface High**| Light Slate| `#273649` | Elementet interaktive mbi surface |
| **Primary** | Electric Lime| `#a4d64c` | Akcenti kryesor, Butonat CTA, Forma pozitive |
| **Tertiary** | Cyan / Sky | `#7bd0ff` | Të dhënat sekondare, Navigimi |
| **Text High** | Pure White | `#d5e3fd` | Teksti kryesor i lexueshëm |
| **Text Low** | Muted Silver | `#909097` | Teksti dytësor, etiketat (labels) |
| **Error/Alert**| Coral Red | `#ffb4ab` | Lëndimet, Humbjet, Buxheti kritik |

## 3. Tipografia (Shtresa Google Fonts)
- **Headlines (`Archivo Narrow`):** Përdoret për titujt kryesorë dhe emrat e lojtarëve. Shkallëzim i ngushtë për të emuluar tabelat e stadiumit (`W600`, `W700`).
- **Body (`Inter`):** Përdoret për tekstet shpjeguese, lajmet e klubit dhe navigimin (`W400`).
- **Data/Stats (`JetBrains Mono`):** Përdoret STRICTLY për numrat: Atributet e lojtarëve, buxheti, koha e ndeshjes (`W500`, `W700`). Kjo garanton që numrat të jenë monospaced dhe të rreshtohen saktë.

## 4. Komponentët Shared (Specifikat)
### A. GlassCard (Karta e Lojtarëve/Takimeve)
- **Background:** Slate Gray me opacitet 40-60%.
- **Blur:** 12px (përdor `BackdropFilter` në Flutter).
- **Border:** 1px solid, opacitet 10% i bardhë.
- **Radius:** 8px ose 12px për kontejnerë të mëdhenj.

### B. Action Button (Auto-Pick, Play Match)
- **Background:** Electric Lime (`#a4d64c`).
- **Text:** Deep Navy (`#051426`), `Archivo Narrow W700`.
- **Elevation:** 0, por në hover/active shtohet një shadow me ngjyrë lime 30-40% opacitet për efekt neon.

### C. Stat Bars
- **Track:** Sfond i errët `surfaceHighest`.
- **Fill:** Ngjyrat sipas gjendjes (Lime për të mirë, Cyan për mesatare, Red për të dobët). Rrumbullakim i plotë (`StadiumBorder`).