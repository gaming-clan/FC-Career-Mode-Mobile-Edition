import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:fc_career_mode/main.dart';

void main() {
  testWidgets('renders the seeded career dashboard', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const ProviderScope(child: FCCareerModeApp()));

    expect(find.text('FC CAREER MODE'), findsOneWidget);
    expect(find.text('FC Elite'), findsOneWidget);
    expect(find.text('NEXT FIXTURE'), findsOneWidget);
    expect(find.text('PLAY MATCH'), findsOneWidget);
  });

  testWidgets('playing a fixture advances the career state', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const ProviderScope(child: FCCareerModeApp()));

    await tester.tap(find.text('PLAY MATCH'));
    await tester.pump();

    expect(find.textContaining('Matchday 2'), findsOneWidget);
    expect(find.text('Record'), findsOneWidget);
    expect(find.text('0-0-0'), findsNothing);
  });
}
