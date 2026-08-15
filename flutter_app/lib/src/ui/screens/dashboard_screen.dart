import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/colors.dart';
import '../../engine/engine.dart';
import '../../state/career_state.dart';
import '../shared/glass_card.dart';
import '../shared/neon_button.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(careerControllerProvider);
    final controller = ref.read(careerControllerProvider.notifier);
    final nextFixture = _nextFixture(state);

    return Scaffold(
      appBar: AppBar(
        title: const Text('FC CAREER MODE'),
        actions: [
          IconButton(
            tooltip: 'Youth intake',
            onPressed: controller.addYouthIntake,
            icon: const Icon(Icons.school_outlined),
          ),
        ],
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 18, 16, 28),
          children: [
            _HeroHeader(state: state),
            const SizedBox(height: 16),
            _NextFixtureCard(
              fixture: nextFixture,
              onPlay: nextFixture == null ? null : controller.playNextFixture,
            ),
            const SizedBox(height: 16),
            _SeasonOverview(state: state),
            const SizedBox(height: 16),
            _SquadOverview(state: state),
            const SizedBox(height: 16),
            _YouthOverview(state: state),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: 0,
        onDestinationSelected: (_) {},
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            label: 'Overview',
          ),
          NavigationDestination(
            icon: Icon(Icons.groups_outlined),
            label: 'Squad',
          ),
          NavigationDestination(
            icon: Icon(Icons.swap_horiz),
            label: 'Transfers',
          ),
          NavigationDestination(
            icon: Icon(Icons.calendar_month_outlined),
            label: 'Fixtures',
          ),
        ],
      ),
    );
  }

  Fixture? _nextFixture(CareerGameState state) {
    for (final fixture in state.fixtures) {
      if (!fixture.played) return fixture;
    }
    return null;
  }
}

class _HeroHeader extends StatelessWidget {
  final CareerGameState state;

  const _HeroHeader({required this.state});

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            state.playerClub.name,
            style: Theme.of(context).textTheme.headlineMedium,
          ),
          const SizedBox(height: 4),
          Text(
            '${state.playerClub.division}  •  Season ${state.currentSeason}',
            style: const TextStyle(color: AppColors.textLow),
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              _Metric(label: 'Matchday', value: '${state.currentMatchday}'),
              _Metric(
                label: 'Position',
                value: '${state.seasonStats.leaguePosition}',
              ),
              _Metric(
                label: 'Points',
                value: '${state.seasonStats.pointsTotal}',
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _NextFixtureCard extends StatelessWidget {
  final Fixture? fixture;
  final VoidCallback? onPlay;

  const _NextFixtureCard({required this.fixture, required this.onPlay});

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'NEXT FIXTURE',
            style: TextStyle(
              color: AppColors.cyanSky,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 14),
          if (fixture == null)
            const Text(
              'Season complete',
              style: TextStyle(color: AppColors.textHigh, fontSize: 20),
            )
          else ...[
            Text(
              '${fixture!.homeClubName}  v  ${fixture!.awayClubName}',
              style: const TextStyle(
                color: AppColors.textHigh,
                fontSize: 19,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              'Matchday ${fixture!.matchday}  •  ${fixture!.homeFormation ?? '4-3-3'}',
              style: const TextStyle(color: AppColors.textLow),
            ),
            const SizedBox(height: 16),
            NeonButton(label: 'PLAY MATCH', onPressed: onPlay, expanded: true),
          ],
        ],
      ),
    );
  }
}

class _SeasonOverview extends StatelessWidget {
  final CareerGameState state;

  const _SeasonOverview({required this.state});

  @override
  Widget build(BuildContext context) {
    final stats = state.seasonStats;
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'SEASON OVERVIEW',
            style: TextStyle(
              color: AppColors.cyanSky,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              _Metric(
                label: 'Record',
                value: '${stats.wins}-${stats.draws}-${stats.losses}',
              ),
              _Metric(
                label: 'Goals',
                value: '${stats.goalsFor}:${stats.goalsAgainst}',
              ),
              _Metric(label: 'Form', value: '${stats.currentForm}%'),
            ],
          ),
          const SizedBox(height: 16),
          LinearProgressIndicator(
            value: (stats.currentForm / 100).clamp(0.0, 1.0),
            minHeight: 8,
            color: AppColors.electricLime,
            backgroundColor: AppColors.lightSlate.withValues(alpha: 0.35),
          ),
        ],
      ),
    );
  }
}

class _SquadOverview extends StatelessWidget {
  final CareerGameState state;

  const _SquadOverview({required this.state});

  @override
  Widget build(BuildContext context) {
    final average = state.squad.isEmpty
        ? 0
        : (state.squad
                      .map((player) => player.overallRating)
                      .reduce((a, b) => a + b) /
                  state.squad.length)
              .round();
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'SQUAD',
            style: TextStyle(
              color: AppColors.cyanSky,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              _Metric(label: 'Players', value: '${state.squad.length}'),
              _Metric(label: 'Average OVR', value: '$average'),
              _Metric(
                label: 'Budget',
                value: _formatMoney(state.playerClub.budget),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _YouthOverview extends StatelessWidget {
  final CareerGameState state;

  const _YouthOverview({required this.state});

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      child: Row(
        children: [
          const Icon(
            Icons.school_outlined,
            color: AppColors.electricLime,
            size: 28,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              '${state.youth.players.length} youth players  •  Academy level ${state.youth.facilities}',
              style: const TextStyle(color: AppColors.textHigh),
            ),
          ),
        ],
      ),
    );
  }
}

class _Metric extends StatelessWidget {
  final String label;
  final String value;

  const _Metric({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(color: AppColors.textLow, fontSize: 12),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              color: AppColors.textHigh,
              fontSize: 17,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}

String _formatMoney(double amount) {
  if (amount >= 1000000) return '€${(amount / 1000000).toStringAsFixed(1)}M';
  if (amount >= 1000) return '€${(amount / 1000).toStringAsFixed(0)}K';
  return '€${amount.toStringAsFixed(0)}';
}
