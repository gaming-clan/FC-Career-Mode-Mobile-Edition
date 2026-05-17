import 'package:flutter/material.dart';

import '../shared/glass_card.dart';
import '../shared/neon_button.dart';
import '../../core/theme/colors.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('FC Career Mode'),
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.settings),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const GlassCard(
              child: _NextMatchCardContents(),
            ),
            const SizedBox(height: 18),
            const GlassCard(
              child: _MiniStatsSection(),
            ),
            const SizedBox(height: 18),
            const GlassCard(
              child: _RecentActivitySection(),
            ),
            const SizedBox(height: 22),
            NeonButton(
              onPressed: () {},
              label: 'PLAY NEXT MATCH',
              expanded: true,
            ),
          ],
        ),
      ),
    );
  }
}

class _NextMatchCardContents extends StatelessWidget {
  const _NextMatchCardContents();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'Next Match',
                    style: TextStyle(
                      color: AppColors.cyanSky,
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'FC Career vs Thunder City',
                    style: TextStyle(
                      color: AppColors.textHigh,
                      fontWeight: FontWeight.w700,
                      fontSize: 20,
                    ),
                  ),
                ],
              ),
            ),
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: AppColors.electricLime,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(
                Icons.sports_soccer,
                color: AppColors.deepNavy,
              ),
            ),
          ],
        ),
        const SizedBox(height: 18),
        const Text(
          'Tomorrow • 19:45 • Stadium Night League',
          style: TextStyle(
            color: AppColors.textLow,
            fontSize: 13,
          ),
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: const [
            _StatisticTile(label: 'Form', value: 'WWDWW'),
            _StatisticTile(label: 'xG', value: '2.1'),
            _StatisticTile(label: 'Injuries', value: '2'),
          ],
        ),
      ],
    );
  }
}

class _MiniStatsSection extends StatelessWidget {
  const _MiniStatsSection();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Quick Stats',
          style: TextStyle(
            color: AppColors.cyanSky,
            fontWeight: FontWeight.w700,
            fontSize: 14,
          ),
        ),
        const SizedBox(height: 14),
        Row(
          children: const [
            Expanded(child: _ProgressMetric(label: 'Possession', value: '62%', progress: 0.62)),
            SizedBox(width: 12),
            Expanded(child: _ProgressMetric(label: 'Morale', value: '88', progress: 0.88)),
          ],
        ),
        const SizedBox(height: 14),
        Row(
          children: const [
            Expanded(child: _ProgressMetric(label: 'Squad Depth', value: '74', progress: 0.74)),
            SizedBox(width: 12),
            Expanded(child: _ProgressMetric(label: 'Budget', value: '€12M', progress: 0.48)),
          ],
        ),
      ],
    );
  }
}

class _RecentActivitySection extends StatelessWidget {
  const _RecentActivitySection();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Recent Activity',
          style: TextStyle(
            color: AppColors.cyanSky,
            fontWeight: FontWeight.w700,
            fontSize: 14,
          ),
        ),
        const SizedBox(height: 14),
        const _ActivityRow(label: 'Player form improved', value: 'L. Martinez +6'),
        const Divider(color: Colors.white12),
        const _ActivityRow(label: 'New offer received', value: 'Striker target'),
        const Divider(color: Colors.white12),
        const _ActivityRow(label: 'Training upgrade available', value: 'Youth academy'),
      ],
    );
  }
}

class _StatisticTile extends StatelessWidget {
  final String label;
  final String value;

  const _StatisticTile({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: AppColors.textLow,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: const TextStyle(
              color: AppColors.textHigh,
              fontWeight: FontWeight.w700,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }
}

class _ProgressMetric extends StatelessWidget {
  final String label;
  final String value;
  final double progress;

  const _ProgressMetric({
    required this.label,
    required this.value,
    required this.progress,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: AppColors.textLow,
            fontSize: 12,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            color: AppColors.textHigh,
            fontWeight: FontWeight.w700,
            fontSize: 18,
          ),
        ),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: LinearProgressIndicator(
            value: progress,
            color: AppColors.electricLime,
            backgroundColor: AppColors.lightSlate.withOpacity(0.32),
            minHeight: 8,
          ),
        ),
      ],
    );
  }
}

class _ActivityRow extends StatelessWidget {
  final String label;
  final String value;

  const _ActivityRow({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(
              label,
              style: const TextStyle(
                color: AppColors.textHigh,
                fontSize: 14,
              ),
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              color: AppColors.cyanSky,
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
