import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'src/core/theme/app_theme.dart';
import 'src/ui/screens/dashboard_screen.dart';

void main() {
  runApp(const ProviderScope(child: FCCareerModeApp()));
}

class FCCareerModeApp extends StatelessWidget {
  const FCCareerModeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'FC Career Mode',
      theme: AppTheme.stadiumNightTheme(),
      home: const DashboardScreen(),
    );
  }
}
