import * as React from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { MatchCard } from "@/components/game-modes/match-card";
import { initializeSeason } from "@/lib/season-progression";

export default function FixturesScreen() {
  const router = useRouter();
  const colors = useColors();
  const [season] = React.useState(() => initializeSeason(2024, 20));

  const currentWeek = season.weeks[season.currentWeek - 1];
  const upcomingFixtures = season.weeks
    .slice(season.currentWeek - 1)
    .flatMap((w) => w.fixtures)
    .slice(0, 5);

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-primary px-6 py-6 gap-1" style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base text-background mb-2">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-background">Fixtures & Results</Text>
          <Text className="text-sm text-background opacity-90">
            Season {season.year} • Week {season.currentWeek}/{season.totalWeeks}
          </Text>
        </View>

        <View className="px-4 py-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-foreground">This Week's Matches</Text>
            <TouchableOpacity
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-xs font-semibold text-background">Advance Week</Text>
            </TouchableOpacity>
          </View>

          <View className="gap-3">
            {currentWeek?.fixtures.slice(0, 3).map((fixture) => (
              <MatchCard
                key={fixture.id}
                homeTeam={fixture.homeTeamName}
                awayTeam={fixture.awayTeamName}
                homeGoals={fixture.homeGoals || 0}
                awayGoals={fixture.awayGoals || 0}
                date={fixture.date}
                status={fixture.status}
                onPress={() => {}}
              />
            ))}
          </View>
        </View>

        <View className="px-4 py-6">
          <Text className="text-lg font-semibold text-foreground mb-4">Upcoming Matches</Text>
          <View className="gap-3">
            {upcomingFixtures.slice(0, 5).map((fixture) => (
              <MatchCard
                key={fixture.id}
                homeTeam={fixture.homeTeamName}
                awayTeam={fixture.awayTeamName}
                homeGoals={fixture.homeGoals || 0}
                awayGoals={fixture.awayGoals || 0}
                date={fixture.date}
                status="upcoming"
                onPress={() => {}}
              />
            ))}
          </View>
        </View>

        <View className="px-4 py-4">
          <TouchableOpacity
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              backgroundColor: colors.primary,
            })}
            className="rounded-lg py-3 items-center"
          >
            <Text className="text-base font-semibold text-background">Simulate Week</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
