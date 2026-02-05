import { View, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface FinanceCardProps {
  label: string;
  amount: number;
  type: "income" | "expense" | "balance";
}

export function FinanceCard({ label, amount, type }: FinanceCardProps) {
  const colors = useColors();

  const textColor =
    type === "income" ? colors.success : type === "expense" ? colors.error : colors.primary;
  const sign = type === "expense" ? "-" : type === "income" ? "+" : "";

  return (
    <View className="bg-surface rounded-lg p-4 border border-border mb-3">
      <Text className="text-sm text-muted mb-1">{label}</Text>
      <Text className="text-2xl font-bold" style={{ color: textColor }}>
        {sign}${(amount / 1000000).toFixed(1)}M
      </Text>
    </View>
  );
}
