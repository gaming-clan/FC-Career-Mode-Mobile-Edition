/**
 * Tactics Manager Screen
 * Manage team tactics and advanced tactical systems
 */

import * as React from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import {
  GEGENPRESSING,
  TIKI_TAKA,
  FALSE_NINE,
  INVERTED_FULLBACKS,
  WING_BACKS,
  isSquadSuitableForTactic,
  getTacticRecommendations,
} from "@/lib/advanced-tactics";

export default function TacticsManagerScreen() {
  const router = useRouter();
  const colors = useColors();
  const [selectedTactic, setSelectedTactic] = React.useState(GEGENPRESSING);

  // Mock squad data
  const squad = [
    { position: "ST", pace: 88, passing: 75, dribbling: 82, defense: 40, stamina: 80 },
    { position: "CM", pace: 80, passing: 85, dribbling: 78, defense: 72, stamina: 88 },
    { position: "CB", pace: 75, passing: 78, dribbling: 60, defense: 88, stamina: 82 },
    { position: "GK", pace: 70, passing: 72, dribbling: 50, defense: 85, stamina: 78 },
  ];

  const allTactics = [GEGENPRESSING, TIKI_TAKA, FALSE_NINE, INVERTED_FULLBACKS, WING_BACKS];
  const recommendations = getTacticRecommendations(squad);

  const checkSuitability = (tactic: any) => {
    return isSquadSuitableForTactic(squad, tactic);
  };

  const getTacticColor = (tactic: any) => {
    const suitability = checkSuitability(tactic);
    if (suitability.suitable) return colors.success;
    if (suitability.suitabilityScore > 40) return colors.warning;
    return colors.error;
  };

  const renderTacticCard = (tactic: any) => {
    const suitability = checkSuitability(tactic);

    return (
      <TouchableOpacity
        key={tactic.name}
        onPress={() => setSelectedTactic(tactic)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
        className={`bg-surface rounded-lg p-4 border mb-3 ${
          selectedTactic.name === tactic.name ? "border-primary" : "border-border"
        }`}
        style={{
          borderColor: selectedTactic.name === tactic.name ? colors.primary : colors.border,
          borderWidth: 2,
        }}
      >
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground">{tactic.displayName}</Text>
            <Text className="text-xs text-muted mt-1">{tactic.description}</Text>
          </View>
          <View
            className="px-2 py-1 rounded-lg"
            style={{
              backgroundColor: `${getTacticColor(tactic)}20`,
            }}
          >
            <Text
              className="text-xs font-semibold"
              style={{
                color: getTacticColor(tactic),
              }}
            >
              {suitability.suitable ? "✓ Suitable" : `${suitability.suitabilityScore}%`}
            </Text>
          </View>
        </View>

        {!suitability.suitable && suitability.missingAttributes.length > 0 && (
          <View className="bg-background rounded-lg p-2 mt-2">
            <Text className="text-xs text-muted">Missing attributes:</Text>
            {suitability.missingAttributes.map((attr, idx) => (
              <Text key={idx} className="text-xs text-error">
                • {attr}
              </Text>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="bg-primary px-6 py-6 gap-1" style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base text-background mb-2">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-background">Tactics Manager</Text>
          <Text className="text-sm text-background opacity-90">Configure your team's tactics</Text>
        </View>

        <View className="px-4 py-6 gap-6">
          {/* Current Tactic */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Current Tactic</Text>
            <View
              className="rounded-lg px-4 py-3"
              style={{
                backgroundColor: `${colors.primary}20`,
              }}
            >
              <Text className="text-base font-bold text-primary" style={{ color: colors.primary }}>
                {selectedTactic.displayName}
              </Text>
            </View>
          </View>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <View className="bg-primary bg-opacity-10 rounded-lg p-4 gap-3" style={{ backgroundColor: `${colors.success}20` }}>
              <Text className="text-lg font-semibold text-foreground">Recommended Tactics</Text>
              {recommendations.slice(0, 2).map((rec, idx) => (
                <View key={idx} className="flex-row justify-between items-center">
                  <Text className="text-sm text-foreground">{rec.tactic.displayName}</Text>
                  <Text className="text-sm font-semibold text-success" style={{ color: colors.success }}>
                    {rec.suitabilityScore}%
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Available Tactics */}
          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">Available Tactics</Text>
            {allTactics.map(renderTacticCard)}
          </View>

          {/* Selected Tactic Details */}
          {selectedTactic && (
            <View className="bg-surface rounded-lg p-4 border border-border gap-3">
              <Text className="text-lg font-semibold text-foreground">Tactic Details</Text>

              <View className="gap-2">
                <Text className="text-sm text-muted">Required Formations:</Text>
                <Text className="text-sm text-foreground">
                  {selectedTactic.requiredFormations.join(", ")}
                </Text>
              </View>

              <View className="gap-2">
                <Text className="text-sm text-muted">Required Attributes:</Text>
                <View className="gap-1">
                  {Object.entries(selectedTactic.requiredPlayerAttributes).map(([attr, value]) => (
                    <View key={attr} className="flex-row justify-between items-center">
                      <Text className="text-xs text-muted capitalize">{attr}</Text>
                      <Text className="text-xs font-semibold text-foreground">{value}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className="gap-2">
                <Text className="text-sm text-muted">Match Impact:</Text>
                <View className="gap-1">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-muted">Possession</Text>
                    <Text className="text-xs font-semibold text-foreground">
                      {selectedTactic.matchImpact.possession > 0 ? "+" : ""}
                      {selectedTactic.matchImpact.possession}%
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-muted">Pressure</Text>
                    <Text className="text-xs font-semibold text-foreground">
                      {selectedTactic.matchImpact.pressureIntensity}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-muted">Injury Risk</Text>
                    <Text className="text-xs font-semibold text-error" style={{ color: colors.error }}>
                      {(selectedTactic.matchImpact.injuryRisk * 100).toFixed(1)}%
                    </Text>
                  </View>
                </View>
              </View>
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
              <Text className="text-base font-semibold text-background">
                Apply {selectedTactic.displayName}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              })}
              className="rounded-lg py-3 items-center"
              onPress={() => router.back()}
            >
              <Text className="text-base font-semibold text-foreground">Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
