import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'colors.dart';

class AppTheme {
  static ThemeData stadiumNightTheme() {
    final colorScheme = const ColorScheme.dark(
      surface: AppColors.slateGray,
      primary: AppColors.primary,
      secondary: AppColors.electricLime,
      onPrimary: AppColors.onPrimary,
      onSecondary: AppColors.onElectricLime,
      onSurface: AppColors.textHigh,
      onError: AppColors.textHigh,
      error: AppColors.coralRed,
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: AppColors.deepNavy,
      canvasColor: AppColors.deepNavy,
      primaryTextTheme: GoogleFonts.archivoNarrowTextTheme().apply(
        bodyColor: AppColors.onPrimary,
        displayColor: AppColors.onPrimary,
      ),
      // Stats / Monospaced
      extensions: <ThemeExtension<dynamic>>[],
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.slateGray.withValues(alpha: 0.85),
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.archivoNarrow(
          fontWeight: FontWeight.w700,
          fontSize: 20,
          color: AppColors.textHigh,
        ),
        iconTheme: const IconThemeData(color: AppColors.textHigh),
      ),
      cardTheme: CardThemeData(
        color: AppColors.slateGray.withValues(alpha: 0.5),
        surfaceTintColor: AppColors.slateGray,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.electricLime,
          foregroundColor: AppColors.deepNavy,
          textStyle: GoogleFonts.archivoNarrow(
            fontWeight: FontWeight.w700,
            letterSpacing: 0.8,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.cyanSky,
          textStyle: GoogleFonts.inter(fontWeight: FontWeight.w500),
        ),
      ),
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: AppColors.electricLime,
        foregroundColor: AppColors.deepNavy,
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: AppColors.slateGray.withValues(alpha: 0.9),
      ),
      // Custom text styles for the design system
      textTheme: GoogleFonts.interTextTheme().copyWith(
        headlineLarge: GoogleFonts.archivoNarrow(
          fontSize: 40,
          fontWeight: FontWeight.w700,
          color: AppColors.textHigh,
          height: 44 / 40,
        ),
        headlineMedium: GoogleFonts.archivoNarrow(
          fontSize: 32,
          fontWeight: FontWeight.w700,
          color: AppColors.textHigh,
          height: 36 / 32,
        ),
        titleLarge: GoogleFonts.archivoNarrow(
          fontSize: 24,
          fontWeight: FontWeight.w600,
          color: AppColors.textHigh,
        ),
        bodyLarge: GoogleFonts.inter(
          fontSize: 18,
          fontWeight: FontWeight.w400,
          color: AppColors.textHigh,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w400,
          color: AppColors.textHigh,
        ),
        // Stats use JetBrains Mono
        displaySmall: GoogleFonts.jetBrainsMono(
          fontSize: 24,
          fontWeight: FontWeight.w700,
          color: AppColors.textHigh,
        ),
        labelSmall: GoogleFonts.inter(
          fontSize: 12,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.05,
          color: AppColors.textVariant,
        ),
      ),
    );
  }
}
