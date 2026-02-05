import * as React from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";

interface FinancialData {
  totalBudget: number;
  spent: number;
  available: number;
  monthlyRevenue: number;
  monthlyWages: number;
  monthlyProfit: number;
  transferBudget: number;
  transferSpent: number;
  transferAvailable: number;
}

export default function FinancialScreen() {
  const router = useRouter();
  const colors = useColors();

  const [financial] = React.useState<FinancialData>({
    totalBudget: 100000000,
    spent: 45000000,
    available: 55000000,
    monthlyRevenue: 2500000,
    monthlyWages: 1800000,
    monthlyProfit: 700000,
    transferBudget: 50000000,
    transferSpent: 15000000,
    transferAvailable: 35000000,
  });

  const budgetUsagePercent = (financial.spent / financial.totalBudget) * 100;
  const transferUsagePercent = (financial.transferSpent / financial.transferBudget) * 100;

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-primary px-6 py-6 gap-1" style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base text-background mb-2">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-background">Financial Dashboard</Text>
          <Text className="text-sm text-background opacity-90">Budget & Revenue Overview</Text>
        </View>

        <View className="px-4 py-6 gap-6">
          {/* Budget Overview */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-4">
            <Text className="text-lg font-semibold text-foreground">Annual Budget</Text>

            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Total Budget</Text>
                <Text className="text-sm font-semibold text-foreground">
                  ${(financial.totalBudget / 1000000).toFixed(1)}M
                </Text>
              </View>

              <View className="w-full h-2 bg-border rounded-full overflow-hidden">
                <View
                  className="h-full"
                  style={{
                    backgroundColor: colors.primary,
                    width: `${budgetUsagePercent}%`,
                  }}
                />
              </View>

              <View className="flex-row justify-between">
                <View>
                  <Text className="text-xs text-muted">Spent</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    ${(financial.spent / 1000000).toFixed(1)}M
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-xs text-muted">Available</Text>
                  <Text className="text-sm font-semibold text-success">
                    ${(financial.available / 1000000).toFixed(1)}M
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Monthly Overview */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-4">
            <Text className="text-lg font-semibold text-foreground">Monthly Overview</Text>

            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-xs text-muted">Revenue</Text>
                  <Text className="text-base font-semibold text-success">
                    +${(financial.monthlyRevenue / 1000000).toFixed(1)}M
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-xs text-muted">Wages</Text>
                  <Text className="text-base font-semibold text-error">
                    -${(financial.monthlyWages / 1000000).toFixed(1)}M
                  </Text>
                </View>
              </View>

              <View
                className="h-0.5 bg-border"
                style={{ backgroundColor: colors.border }}
              />

              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Monthly Profit</Text>
                <Text className="text-base font-semibold text-success">
                  ${(financial.monthlyProfit / 1000000).toFixed(1)}M
                </Text>
              </View>
            </View>
          </View>

          {/* Transfer Budget */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-4">
            <Text className="text-lg font-semibold text-foreground">Transfer Budget</Text>

            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Total Transfer Budget</Text>
                <Text className="text-sm font-semibold text-foreground">
                  ${(financial.transferBudget / 1000000).toFixed(1)}M
                </Text>
              </View>

              <View className="w-full h-2 bg-border rounded-full overflow-hidden">
                <View
                  className="h-full"
                  style={{
                    backgroundColor: colors.warning,
                    width: `${transferUsagePercent}%`,
                  }}
                />
              </View>

              <View className="flex-row justify-between">
                <View>
                  <Text className="text-xs text-muted">Spent</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    ${(financial.transferSpent / 1000000).toFixed(1)}M
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-xs text-muted">Available</Text>
                  <Text className="text-sm font-semibold text-success">
                    ${(financial.transferAvailable / 1000000).toFixed(1)}M
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Financial Breakdown */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Income Sources</Text>

            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Ticket Sales</Text>
                <Text className="text-sm font-semibold text-foreground">$800K</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Sponsorship</Text>
                <Text className="text-sm font-semibold text-foreground">$1.2M</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Broadcasting Rights</Text>
                <Text className="text-sm font-semibold text-foreground">$500K</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              backgroundColor: colors.primary,
            })}
            className="rounded-lg py-3 items-center"
          >
            <Text className="text-base font-semibold text-background">View Detailed Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
