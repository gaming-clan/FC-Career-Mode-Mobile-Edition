/**
 * Improved Match Report Screen
 * Integrates with the unified game engine and real game state
 */

import * as React from "react";
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { useGameState } from "@/lib/game-state-context";
import { playCareerMatch } from "@/lib/game-engine-unified";
import type { UnifiedMatchResult } from "@/lib/game-engine-unified";

export default function ImprovedMatchReportScreen() {
  const router = useRouter();
  const colors = useColors();
  const { gameState, updateGameState } = useGameState();

  const [matchResult, setMatchResult] = React.useState<UnifiedMatchResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Simulate a match when component mounts
  React.useEffect(() => {
    if (!gameState) return;

    const simulateMatch = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get the next upcoming fixture
        const upcomingFixture = gameState.fixtures.find((f) => !f.played);
        if (!upcomingFixture) {
          setError("No upcoming fixtures");
          return;
        }

        // Determine if player club is home or away
        const isHome = upcomingFixture.homeClubId === gameState.playerClub.id;
        const homeSquad = isHome ? gameState.squad : [];
        const awaySquad = !isHome ? gameState.squad : [];

        // For now, use player squad for both teams (in a real app, fetch opponent squad from DB)
        const result = playCareerMatch(
          gameState,
          upcomingFixture.id,
          homeSquad,
          awaySquad,
          {
            code: "4-3-3",
            style: "balanced",
            defenders: 4,
            midfielders: 3,
            forwards: 3,
            pressing: "medium",
            buildUp: "mixed",
          },
          {
            code: "4-3-3",
            style: "balanced",
            defenders: 4,
            midfielders: 3,
            forwards: 3,
            pressing: "medium",
            buildUp: "mixed",
          },
          isHome
        );

        setMatchResult(result.result);
        updateGameState(result.updatedGameState);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to simulate match");
      } finally {
        setIsLoading(false);
      }
    };

    simulateMatch();
  }, [gameState, updateGameState]);

  if (isLoading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-foreground mt-4">Simulating match...</Text>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer className="flex items-center justify-center p-4">
        <Text className="text-error text-lg font-semibold mb-4">Error</Text>
        <Text className="text-foreground text-center mb-6">{error}</Text>
        <TouchableOpacity
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
            backgroundColor: colors.primary,
          })}
          className="rounded-lg py-3 px-6 items-center"
          onPress={() => router.back()}
        >
          <Text className="text-base font-semibold text-background">Go Back</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  if (!matchResult) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <Text className="text-foreground">No match data available</Text>
      </ScreenContainer>
    );
  }

  const homeWon = matchResult.homeScore > matchResult.awayScore;
  const awayWon = matchResult.awayScore > matchResult.homeScore;
  const isDraw = matchResult.homeScore === matchResult.awayScore;

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="bg-primary px-6 py-6 gap-1" style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base text-background mb-2">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-background">Match Report</Text>
          <Text className="text-sm text-background opacity-90">Full time result</Text>
        </View>

        <View className="px-4 py-6 gap-6">
          {/* Score Card */}
          <View className="bg-surface rounded-lg p-6 border border-border items-center gap-4">
            <View className="flex-row items-center justify-center gap-4">
              <View className="items-center flex-1">
                <Text className="text-sm text-muted mb-1">{matchResult.homeTeamName}</Text>
                <Text className="text-5xl font-bold text-foreground">{matchResult.homeScore}</Text>
              </View>
              <Text className="text-2xl text-muted">-</Text>
              <View className="items-center flex-1">
                <Text className="text-sm text-muted mb-1">{matchResult.awayTeamName}</Text>
                <Text className="text-5xl font-bold text-foreground">{matchResult.awayScore}</Text>
              </View>
            </View>

            <View className="w-full h-0.5 bg-border" style={{ backgroundColor: colors.border }} />

            {/* Result Status */}
            <View className="w-full">
              <Text
                className="text-center text-lg font-semibold"
                style={{
                  color: homeWon
                    ? colors.success
                    : awayWon
                      ? colors.error
                      : colors.warning,
                }}
              >
                {homeWon ? "Home Win" : awayWon ? "Away Win" : "Draw"}
              </Text>
            </View>

            {/* Team Stats */}
            <View className="w-full flex-row justify-between gap-4">
              <View className="flex-1 items-center">
                <Text className="text-xs text-muted mb-1">Team Rating</Text>
                <Text className="text-lg font-semibold text-foreground">
                  {matchResult.manOfMatch.team === "home" ? matchResult.manOfMatch.rating.toFixed(1) : "7.0"}/10
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-xs text-muted mb-1">Possession</Text>
                <Text className="text-lg font-semibold text-foreground">
                  {matchResult.stats.home.possession.toFixed(0)}%
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-xs text-muted mb-1">Team Rating</Text>
                <Text className="text-lg font-semibold text-foreground">
                  {matchResult.manOfMatch.team === "away" ? matchResult.manOfMatch.rating.toFixed(1) : "7.0"}/10
                </Text>
              </View>
            </View>
          </View>

          {/* Match Statistics */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-4">
            <Text className="text-lg font-semibold text-foreground">Match Statistics</Text>

            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Shots</Text>
                <View className="flex-row gap-2">
                  <Text className="text-sm font-semibold text-foreground">{matchResult.stats.home.shots}</Text>
                  <Text className="text-sm text-muted">-</Text>
                  <Text className="text-sm font-semibold text-foreground">{matchResult.stats.away.shots}</Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Shots on Target</Text>
                <View className="flex-row gap-2">
                  <Text className="text-sm font-semibold text-foreground">{matchResult.stats.home.shotsOnTarget}</Text>
                  <Text className="text-sm text-muted">-</Text>
                  <Text className="text-sm font-semibold text-foreground">{matchResult.stats.away.shotsOnTarget}</Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Possession</Text>
                <View className="flex-row gap-2">
                  <Text className="text-sm font-semibold text-foreground">
                    {matchResult.stats.home.possession.toFixed(1)}%
                  </Text>
                  <Text className="text-sm text-muted">-</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {matchResult.stats.away.possession.toFixed(1)}%
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Pass Accuracy</Text>
                <View className="flex-row gap-2">
                  <Text className="text-sm font-semibold text-foreground">
                    {matchResult.stats.home.passAccuracy.toFixed(1)}%
                  </Text>
                  <Text className="text-sm text-muted">-</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {matchResult.stats.away.passAccuracy.toFixed(1)}%
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Tackles</Text>
                <View className="flex-row gap-2">
                  <Text className="text-sm font-semibold text-foreground">{matchResult.stats.home.tackles}</Text>
                  <Text className="text-sm text-muted">-</Text>
                  <Text className="text-sm font-semibold text-foreground">{matchResult.stats.away.tackles}</Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Fouls</Text>
                <View className="flex-row gap-2">
                  <Text className="text-sm font-semibold text-foreground">{matchResult.stats.home.fouls}</Text>
                  <Text className="text-sm text-muted">-</Text>
                  <Text className="text-sm font-semibold text-foreground">{matchResult.stats.away.fouls}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Man of the Match */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Man of the Match</Text>
            <View className="flex-row items-center gap-3">
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-lg font-bold text-background">⭐</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">{matchResult.manOfMatch.name}</Text>
                <Text className="text-sm text-muted">
                  {matchResult.manOfMatch.rating.toFixed(1)}/10 ({matchResult.manOfMatch.team === "home" ? "Home" : "Away"})
                </Text>
              </View>
            </View>
          </View>

          {/* Key Events */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Key Events</Text>

            {matchResult.events.length > 0 ? (
              <View className="gap-2">
                {matchResult.events.slice(0, 10).map((event, index) => (
                  <View key={index} className="flex-row gap-3 pb-2 border-b border-border">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{
                        backgroundColor:
                          event.type === "goal"
                            ? colors.success
                            : event.type === "yellow"
                              ? colors.warning
                              : event.type === "red"
                                ? colors.error
                                : colors.muted,
                      }}
                    >
                      <Text className="text-xs font-bold text-background">{event.minute}'</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-foreground">
                        {event.description}
                      </Text>
                      <Text className="text-xs text-muted">{event.playerName}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-sm text-muted">No events recorded</Text>
            )}
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                backgroundColor: colors.primary,
              })}
              className="rounded-lg py-3 items-center"
              onPress={() => router.push("/modes/fixtures")}
            >
              <Text className="text-base font-semibold text-background">Back to Fixtures</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              })}
              className="rounded-lg py-3 items-center"
              onPress={() => router.push("/modes/squad-management")}
            >
              <Text className="text-base font-semibold text-foreground">View Squad</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
