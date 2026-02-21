/**
 * Youth Academy Management Screen
 * Manage youth players, promotions, and academy facilities
 */

import * as React from "react";
import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { useGameState } from "@/lib/game-state-context";
import { identifyYouthPromotionCandidates } from "@/lib/club-squad-management";

export default function YouthAcademyScreen() {
  const router = useRouter();
  const colors = useColors();
  const { gameState } = useGameState();

  if (!gameState) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <Text className="text-foreground">No active career</Text>
      </ScreenContainer>
    );
  }

  // Get youth players
  const youthPlayers = gameState.squad.filter((p) => p.isYouthPlayer);
  
  // Get promotion candidates
  const seniorAverage = gameState.squad
    .filter((p) => !p.isYouthPlayer)
    .reduce((acc, p) => acc + p.overallRating, 0) / Math.max(1, gameState.squad.filter((p) => !p.isYouthPlayer).length);

  const promotionCandidates = identifyYouthPromotionCandidates(gameState.squad, seniorAverage);

  // Separate by readiness
  const readyForPromotion = promotionCandidates.filter((p) => p.recommendation === "ready");
  const closeToReady = promotionCandidates.filter((p) => p.recommendation === "close");
  const developing = promotionCandidates.filter((p) => p.recommendation === "developing");

  const renderPlayerCard = (player: any) => (
    <View key={player.playerId} className="bg-surface rounded-lg p-4 border border-border mb-3">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">{player.name}</Text>
          <View className="flex-row gap-2 mt-1">
            <Text className="text-xs text-muted">{player.position}</Text>
            <Text className="text-xs text-muted">Age {player.age}</Text>
          </View>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-primary" style={{ color: colors.primary }}>
            {player.overallRating}
          </Text>
          <Text className="text-xs text-muted">Rating</Text>
        </View>
      </View>

      {/* Readiness Score */}
      <View className="gap-2 mb-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-muted">Readiness</Text>
          <Text className="text-xs font-semibold text-foreground">{player.readinessScore}%</Text>
        </View>
        <View className="h-2 bg-border rounded-full overflow-hidden">
          <View
            className="h-full bg-primary rounded-full"
            style={{
              width: `${player.readinessScore}%`,
              backgroundColor:
                player.recommendation === "ready"
                  ? colors.success
                  : player.recommendation === "close"
                    ? colors.warning
                    : colors.muted,
            }}
          />
        </View>
      </View>

      {/* Recommendation Badge */}
      <View
        className="rounded-lg px-3 py-2 items-center"
        style={{
          backgroundColor:
            player.recommendation === "ready"
              ? `${colors.success}20`
              : player.recommendation === "close"
                ? `${colors.warning}20`
                : `${colors.muted}20`,
        }}
      >
        <Text
          className="text-xs font-semibold"
          style={{
            color:
              player.recommendation === "ready"
                ? colors.success
                : player.recommendation === "close"
                  ? colors.warning
                  : colors.muted,
          }}
        >
          {player.recommendation === "ready"
            ? "✅ Ready for First Team"
            : player.recommendation === "close"
              ? "⏳ Close to Ready"
              : player.recommendation === "developing"
                ? "📈 Still Developing"
                : "👶 Too Young"}
        </Text>
      </View>

      {player.recommendation === "ready" && (
        <TouchableOpacity
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
            backgroundColor: colors.success,
          })}
          className="rounded-lg py-2 items-center mt-3"
        >
          <Text className="text-sm font-semibold text-background">Promote to First Team</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="bg-primary px-6 py-6 gap-1" style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base text-background mb-2">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-background">Youth Academy</Text>
          <Text className="text-sm text-background opacity-90">Develop young talent</Text>
        </View>

        <View className="px-4 py-6 gap-6">
          {/* Academy Facilities */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Academy Facilities</Text>
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-muted">Facility Level</Text>
              <View className="flex-row gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <View
                    key={i}
                    className="w-6 h-6 rounded-full"
                    style={{
                      backgroundColor:
                        i < gameState.youth.facilities ? colors.primary : colors.border,
                    }}
                  />
                ))}
              </View>
            </View>
            <Text className="text-xs text-muted">
              Level {gameState.youth.facilities}/5 - Affects youth player development speed
            </Text>
          </View>

          {/* Youth Squad Overview */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-2">
            <Text className="text-lg font-semibold text-foreground">Youth Squad</Text>
            <Text className="text-sm text-muted">
              Total Players: {youthPlayers.length}
            </Text>
            <Text className="text-sm text-muted">
              Average Age: {(youthPlayers.reduce((acc, p) => acc + p.age, 0) / Math.max(1, youthPlayers.length)).toFixed(1)}
            </Text>
            <Text className="text-sm text-muted">
              Average Rating: {(youthPlayers.reduce((acc, p) => acc + p.overallRating, 0) / Math.max(1, youthPlayers.length)).toFixed(1)}
            </Text>
          </View>

          {/* Ready for Promotion */}
          {readyForPromotion.length > 0 && (
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <View
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: colors.success }}
                />
                <Text className="text-lg font-semibold text-foreground">
                  Ready for Promotion ({readyForPromotion.length})
                </Text>
              </View>
              {readyForPromotion.map(renderPlayerCard)}
            </View>
          )}

          {/* Close to Ready */}
          {closeToReady.length > 0 && (
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <View
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: colors.warning }}
                />
                <Text className="text-lg font-semibold text-foreground">
                  Close to Ready ({closeToReady.length})
                </Text>
              </View>
              {closeToReady.map(renderPlayerCard)}
            </View>
          )}

          {/* Still Developing */}
          {developing.length > 0 && (
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <View
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: colors.muted }}
                />
                <Text className="text-lg font-semibold text-foreground">
                  Still Developing ({developing.length})
                </Text>
              </View>
              {developing.slice(0, 5).map(renderPlayerCard)}
              {developing.length > 5 && (
                <Text className="text-sm text-muted text-center py-4">
                  +{developing.length - 5} more players
                </Text>
              )}
            </View>
          )}

          {/* Empty State */}
          {youthPlayers.length === 0 && (
            <View className="bg-surface rounded-lg p-6 border border-border items-center gap-2">
              <Text className="text-lg font-semibold text-foreground">No Youth Players</Text>
              <Text className="text-sm text-muted">Recruit young talent to build your academy</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                backgroundColor: colors.primary,
              })}
              className="rounded-lg py-3 items-center"
            >
              <Text className="text-base font-semibold text-background">Upgrade Facilities</Text>
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
              <Text className="text-base font-semibold text-foreground">Back to Squad</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
