import { View, Text, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface SquadCardProps {
  playerName: string;
  position: string;
  rating: number;
  age: number;
  onPress?: () => void;
}

export function SquadCard({ playerName, position, rating, age, onPress }: SquadCardProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
      className="bg-surface rounded-lg p-3 border border-border flex-row items-center justify-between"
    >
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">{playerName}</Text>
        <View className="flex-row gap-2 mt-1">
          <Text className="text-xs text-muted">{position}</Text>
          <Text className="text-xs text-muted">Age {age}</Text>
        </View>
      </View>
      <View className="items-center">
        <Text className="text-lg font-bold text-primary" style={{ color: colors.primary }}>
          {rating}
        </Text>
        <Text className="text-xs text-muted">Rating</Text>
      </View>
    </TouchableOpacity>
  );
}
