import * as React from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { LeagueTable } from "@/components/game-modes/league-table";
import { initializeSeason } from "@/lib/season-progression";

export default function StandingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const [season] = React.useState(() => initializeSeason(2024, 20));

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-primary px-6 py-6 gap-1" style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base text-background mb-2">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-background">League Standings</Text>
          <Text className="text-sm text-background opacity-90">
            Season {season.year} • {season.totalWeeks} Matches
          </Text>
        </View>

        <View className="px-4 py-6">
          <LeagueTable
            standings={season.standings.map((s) => ({
              position: s.position,
              clubName: s.clubName,
              played: s.played,
              wins: s.wins,
              draws: s.draws,
              losses: s.losses,
              goalsFor: s.goalsFor,
              goalsAgainst: s.goalsAgainst,
              points: s.points,
              isUserClub: s.clubId === 1,
            }))}
          />
        </View>

        <View className="px-4 py-6 gap-3">
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-3">Legend</Text>
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <View className="w-4 h-4 rounded" style={{ backgroundColor: colors.primary }} />
                <Text className="text-xs text-muted">Your Club</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="w-4 h-4 rounded" style={{ backgroundColor: colors.success }} />
                <Text className="text-xs text-muted">Champions League</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="w-4 h-4 rounded" style={{ backgroundColor: colors.warning }} />
                <Text className="text-xs text-muted">Europa League</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="w-4 h-4 rounded" style={{ backgroundColor: colors.error }} />
                <Text className="text-xs text-muted">Relegation</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
