import * as React from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { simulateMatch, generateMatchReport, type MatchSimulationInput } from "@/lib/match-integration";

export default function MatchReportScreen() {
  const router = useRouter();
  const colors = useColors();

  const mockInput: MatchSimulationInput = {
    homeTeamId: 1,
    awayTeamId: 2,
    homeTeamName: "Your Club",
    awayTeamName: "Opponent",
    homeFormation: "4-3-3",
    awayFormation: "4-2-3-1",
    homeSquadRating: 78,
    awaySquadRating: 75,
    homePlayerCount: 11,
    awayPlayerCount: 11,
  };

  const [result] = React.useState(() => simulateMatch(mockInput));
  const report = generateMatchReport(mockInput, result);

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-primary px-6 py-6 gap-1" style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base text-background mb-2">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-background">Match Report</Text>
          <Text className="text-sm text-background opacity-90">Full time result</Text>
        </View>

        <View className="px-4 py-6 gap-6">
          {/* Score */}
          <View className="bg-surface rounded-lg p-6 border border-border items-center gap-4">
            <View className="flex-row items-center justify-center gap-4">
              <View className="items-center flex-1">
                <Text className="text-sm text-muted mb-1">{mockInput.homeTeamName}</Text>
                <Text className="text-5xl font-bold text-foreground">{result.homeGoals}</Text>
              </View>
              <Text className="text-2xl text-muted">-</Text>
              <View className="items-center flex-1">
                <Text className="text-sm text-muted mb-1">{mockInput.awayTeamName}</Text>
                <Text className="text-5xl font-bold text-foreground">{result.awayGoals}</Text>
              </View>
            </View>

            <View className="w-full h-0.5 bg-border" style={{ backgroundColor: colors.border }} />

            <View className="w-full flex-row justify-between gap-4">
              <View className="flex-1 items-center">
                <Text className="text-xs text-muted mb-1">Team Rating</Text>
                <Text className="text-lg font-semibold text-foreground">
                  {result.homeRating.toFixed(1)}/10
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-xs text-muted mb-1">Possession</Text>
                <Text className="text-lg font-semibold text-foreground">
                  {result.possession.toFixed(0)}%
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-xs text-muted mb-1">Team Rating</Text>
                <Text className="text-lg font-semibold text-foreground">
                  {result.awayRating.toFixed(1)}/10
                </Text>
              </View>
            </View>
          </View>

          {/* Match Stats */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-4">
            <Text className="text-lg font-semibold text-foreground">Match Statistics</Text>

            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Shots</Text>
                <Text className="text-sm font-semibold text-foreground">{result.shots}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Shots on Target</Text>
                <Text className="text-sm font-semibold text-foreground">{result.shotsOnTarget}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Possession</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {result.possession.toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>

          {/* Key Events */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Key Events</Text>

            {result.events.length > 0 ? (
              <View className="gap-2">
                {result.events.map((event, index) => (
                  <View key={index} className="flex-row gap-3 pb-2 border-b border-border">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{
                        backgroundColor:
                          event.type === "goal"
                            ? colors.success
                            : event.type === "yellow_card"
                              ? colors.warning
                              : colors.error,
                      }}
                    >
                      <Text className="text-xs font-bold text-background">{event.minute}'</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-foreground">
                        {event.description}
                      </Text>
                      <Text className="text-xs text-muted">{event.player}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-sm text-muted">No events recorded</Text>
            )}
          </View>

          <TouchableOpacity
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              backgroundColor: colors.primary,
            })}
            className="rounded-lg py-3 items-center"
          >
            <Text className="text-base font-semibold text-background">Back to Fixtures</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
