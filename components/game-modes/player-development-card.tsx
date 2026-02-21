/**
 * Player Development Card Component
 * Shows player progression, potential, and development trajectory
 */

import { View, Text, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface PlayerDevelopmentCardProps {
  playerName: string;
  position: string;
  age: number;
  currentRating: number;
  potential: number;
  form: number;
  morale: number;
  onPress?: () => void;
}

export function PlayerDevelopmentCard({
  playerName,
  position,
  age,
  currentRating,
  potential,
  form,
  morale,
  onPress,
}: PlayerDevelopmentCardProps) {
  const colors = useColors();

  // Calculate development percentage
  const developmentPercentage = ((currentRating - 40) / (potential - 40)) * 100;

  // Determine development stage
  let developmentStage = "Developing";
  if (age < 23) developmentStage = "Young Prospect";
  else if (age < 28) developmentStage = "Peak Years";
  else if (age < 32) developmentStage = "Experienced";
  else developmentStage = "Veteran";

  // Color based on form/morale
  const formColor = form > 70 ? colors.success : form > 50 ? colors.warning : colors.error;
  const moraleColor = morale > 70 ? colors.success : morale > 50 ? colors.warning : colors.error;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
      className="bg-surface rounded-lg p-4 border border-border gap-3"
    >
      {/* Header */}
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">{playerName}</Text>
          <View className="flex-row gap-2 mt-1">
            <Text className="text-xs text-muted">{position}</Text>
            <Text className="text-xs text-muted">Age {age}</Text>
          </View>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-primary" style={{ color: colors.primary }}>
            {currentRating}
          </Text>
          <Text className="text-xs text-muted">Rating</Text>
        </View>
      </View>

      {/* Development Progress */}
      <View className="gap-2">
        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-muted">Development Progress</Text>
          <Text className="text-xs font-semibold text-foreground">{developmentPercentage.toFixed(0)}%</Text>
        </View>
        <View className="h-2 bg-border rounded-full overflow-hidden">
          <View
            className="h-full bg-primary rounded-full"
            style={{
              width: `${Math.min(developmentPercentage, 100)}%`,
              backgroundColor: colors.primary,
            }}
          />
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-muted">Potential: {potential}</Text>
          <Text className="text-xs text-muted">{developmentStage}</Text>
        </View>
      </View>

      {/* Form & Morale */}
      <View className="flex-row gap-3">
        <View className="flex-1 bg-background rounded-lg p-2 items-center">
          <Text className="text-xs text-muted mb-1">Form</Text>
          <View className="flex-row items-center gap-1">
            <View className="h-1.5 flex-1 bg-border rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${form}%`,
                  backgroundColor: formColor,
                }}
              />
            </View>
            <Text className="text-xs font-semibold text-foreground w-8">{form}</Text>
          </View>
        </View>
        <View className="flex-1 bg-background rounded-lg p-2 items-center">
          <Text className="text-xs text-muted mb-1">Morale</Text>
          <View className="flex-row items-center gap-1">
            <View className="h-1.5 flex-1 bg-border rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${morale}%`,
                  backgroundColor: moraleColor,
                }}
              />
            </View>
            <Text className="text-xs font-semibold text-foreground w-8">{morale}</Text>
          </View>
        </View>
      </View>

      {/* Development Recommendation */}
      <View className="bg-primary bg-opacity-10 rounded-lg p-2" style={{ backgroundColor: `${colors.primary}20` }}>
        <Text className="text-xs text-foreground">
          {developmentPercentage < 50
            ? "🚀 High potential - Prioritize development"
            : developmentPercentage < 80
              ? "📈 On track - Continue regular training"
              : "⭐ Near peak - Maintain performance"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
