# 🛠️ Udhëzuesi i Zhvillimit dhe Git Workflow

Ky dokument përmban rregullat dhe hapat për zhvillimin, migrimin dhe menaxhimin e versionit të FC Career Mode në Flutter.

## 1. Setup i Projektit
1. **Inicimi:** Krijoni projektin me `flutter create fc_career_mode`.
2. **Varësitë Kryesore:** Shtoni në `pubspec.yaml`:
   ```yaml
   dependencies:
     flutter:
       sdk: flutter
     flutter_riverpod: ^2.5.1
     google_fonts: ^6.2.1
     fl_chart: ^0.68.0
     isar: ^3.1.0
     isar_flutter_libs: ^3.1.0