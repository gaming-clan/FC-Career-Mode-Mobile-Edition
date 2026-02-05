import { View, Text, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface TrainingCardProps {
  name: string;
  type: "technical" | "physical" | "tactical" | "mental";
  intensity: "low" | "medium" | "high";
  duration: number;
  playersCount: number;
  onPress?: () => void;
}

export function TrainingCard({
  name,
  type,
  intensity,
  duration,
  playersCount,
  onPress,
}: TrainingCardProps) {
  const colors = useColors();

  const typeEmoji = {
    technical: "⚽",
    physical: "💪",
    tactical: "📊",
    mental: "🧠",
  };

  const intensityColor =
    intensity === "low" ? colors.success : intensity === "medium" ? colors.warning : colors.error;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
      className="bg-surface rounded-lg p-4 border border-border"
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-xl">{typeEmoji[type]}</Text>
          <Text className="text-base font-semibold text-foreground">{name}</Text>
        </View>
        <View
          className="px-2 py-1 rounded-full"
          style={{ backgroundColor: intensityColor }}
        >
          <Text className="text-xs font-semibold text-background capitalize">{intensity}</Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-xs text-muted">{duration} min</Text>
        <Text className="text-xs text-muted">{playersCount} players</Text>
      </View>
    </TouchableOpacity>
  );
}
