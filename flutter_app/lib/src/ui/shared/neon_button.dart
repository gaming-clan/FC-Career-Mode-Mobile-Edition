import 'package:flutter/material.dart';

import '../../core/theme/colors.dart';

class NeonButton extends StatelessWidget {
  final VoidCallback onPressed;
  final String label;
  final bool expanded;

  const NeonButton({
    super.key,
    required this.onPressed,
    required this.label,
    this.expanded = false,
  });

  @override
  Widget build(BuildContext context) {
    final button = ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.electricLime,
        foregroundColor: AppColors.deepNavy,
        elevation: 0,
        shadowColor: AppColors.electricLime.withOpacity(0.35),
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
      ),
      child: Text(
        label,
        style: const TextStyle(
          fontWeight: FontWeight.w700,
          letterSpacing: 0.8,
        ),
      ),
    );

    return expanded
        ? SizedBox(width: double.infinity, child: button)
        : button;
  }
}
