import { View, Text, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface TransferCardProps {
  playerName: string;
  fromClub: string;
  toClub: string;
  fee: number;
  status: "pending" | "accepted" | "rejected";
  onPress?: () => void;
}

export function TransferCard({
  playerName,
  fromClub,
  toClub,
  fee,
  status,
  onPress,
}: TransferCardProps) {
  const colors = useColors();

  const statusColor =
    status === "accepted" ? colors.success : status === "rejected" ? colors.error : colors.warning;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
      className="bg-surface rounded-lg p-4 border border-border"
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-base font-semibold text-foreground">{playerName}</Text>
        <View
          className="px-2 py-1 rounded-full"
          style={{ backgroundColor: statusColor }}
        >
          <Text className="text-xs font-semibold text-background capitalize">{status}</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm text-muted">{fromClub}</Text>
        <Text className="text-sm text-muted">→</Text>
        <Text className="text-sm text-muted">{toClub}</Text>
      </View>

      <Text className="text-lg font-bold text-primary" style={{ color: colors.primary }}>
        ${(fee / 1000000).toFixed(1)}M
      </Text>
    </TouchableOpacity>
  );
}
