import { View, Text, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface MatchCardProps {
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  date: string;
  status: "upcoming" | "completed" | "live";
  onPress?: () => void;
}

export function MatchCard({
  homeTeam,
  awayTeam,
  homeGoals,
  awayGoals,
  date,
  status,
  onPress,
}: MatchCardProps) {
  const colors = useColors();
  const isCompleted = status === "completed";
  const isLive = status === "live";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
      className="bg-surface rounded-lg p-4 border border-border"
    >
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xs text-muted">{date}</Text>
        <View
          className="px-2 py-1 rounded-full"
          style={{
            backgroundColor: isLive ? colors.warning : isCompleted ? colors.success : colors.border,
          }}
        >
          <Text className="text-xs font-semibold text-background">
            {isLive ? "LIVE" : isCompleted ? "FT" : "VS"}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground">{homeTeam}</Text>
        </View>
        <View className="items-center px-4">
          <Text className="text-2xl font-bold text-foreground">
            {homeGoals} - {awayGoals}
          </Text>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-sm font-semibold text-foreground">{awayTeam}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
