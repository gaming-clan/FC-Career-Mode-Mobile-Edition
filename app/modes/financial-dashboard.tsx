/**
 * Financial Dashboard Screen
 * Displays club finances, revenue streams, and budget management
 */

import * as React from "react";
import { ScrollView, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";

export default function FinancialDashboardScreen() {
  const router = useRouter();
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;

  // Mock financial data
  const finances = {
    totalBudget: 250000000,
    availableFunds: 45000000,
    weeklyWages: 2500000,
    monthlyRevenue: 12000000,
    ticketRevenue: 4500000,
    sponsorshipDeals: 5000000,
    merchandiseSales: 1500000,
    televisionRights: 1000000,
    playerWages: 130000000,
    staffSalaries: 8000000,
    facilityMaintenance: 5000000,
    financialStatus: "good" as const,
  };

  const revenueStreams = [
    { name: "Ticket Sales", amount: finances.ticketRevenue, percentage: 37.5, color: colors.primary },
    { name: "Sponsorships", amount: finances.sponsorshipDeals, percentage: 41.7, color: colors.success },
    { name: "Merchandise", amount: finances.merchandiseSales, percentage: 12.5, color: colors.warning },
    { name: "TV Rights", amount: finances.televisionRights, percentage: 8.3, color: colors.muted },
  ];

  const expenseBreakdown = [
    { name: "Player Wages", amount: finances.playerWages, percentage: 65, color: colors.error },
    { name: "Staff Salaries", amount: finances.staffSalaries, percentage: 4, color: colors.warning },
    { name: "Facilities", amount: finances.facilityMaintenance, percentage: 2.5, color: colors.muted },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return colors.success;
      case "good":
        return colors.primary;
      case "stable":
        return colors.warning;
      case "struggling":
        return colors.error;
      case "critical":
        return colors.error;
      default:
        return colors.muted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "excellent":
        return "Excellent";
      case "good":
        return "Good";
      case "stable":
        return "Stable";
      case "struggling":
        return "Struggling";
      case "critical":
        return "Critical";
      default:
        return "Unknown";
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="bg-primary px-6 py-6 gap-1" style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base text-background mb-2">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-background">Financial Dashboard</Text>
          <Text className="text-sm text-background opacity-90">Manage club finances</Text>
        </View>

        <View className="px-4 py-6 gap-6">
          {/* Financial Status */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Financial Status</Text>
            <View
              className="rounded-lg px-4 py-3 items-center"
              style={{
                backgroundColor: `${getStatusColor(finances.financialStatus)}20`,
              }}
            >
              <Text
                className="text-lg font-bold"
                style={{
                  color: getStatusColor(finances.financialStatus),
                }}
              >
                {getStatusLabel(finances.financialStatus)}
              </Text>
            </View>
          </View>

          {/* Budget Overview */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Budget Overview</Text>

            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Total Budget</Text>
                <Text className="text-sm font-semibold text-foreground">
                  £{(finances.totalBudget / 1000000).toFixed(1)}M
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Available Funds</Text>
                <Text className="text-sm font-semibold text-primary" style={{ color: colors.primary }}>
                  £{(finances.availableFunds / 1000000).toFixed(1)}M
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Weekly Wages</Text>
                <Text className="text-sm font-semibold text-error" style={{ color: colors.error }}>
                  £{(finances.weeklyWages / 1000000).toFixed(1)}M
                </Text>
              </View>

              <View className="h-0.5 bg-border" style={{ backgroundColor: colors.border }} />

              <View className="flex-row justify-between items-center">
                <Text className="text-sm font-semibold text-foreground">Months of Funding</Text>
                <Text className="text-lg font-bold text-primary" style={{ color: colors.primary }}>
                  {(finances.availableFunds / (finances.weeklyWages * 4)).toFixed(1)}
                </Text>
              </View>
            </View>
          </View>

          {/* Monthly Revenue */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Monthly Revenue</Text>
            <Text className="text-3xl font-bold text-success" style={{ color: colors.success }}>
              £{(finances.monthlyRevenue / 1000000).toFixed(1)}M
            </Text>

            <View className="gap-2 mt-2">
              {revenueStreams.map((stream, index) => (
                <View key={index} className="gap-1">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-muted">{stream.name}</Text>
                    <Text className="text-xs font-semibold text-foreground">
                      £{(stream.amount / 1000000).toFixed(1)}M ({stream.percentage.toFixed(1)}%)
                    </Text>
                  </View>
                  <View className="h-2 bg-border rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${stream.percentage}%`,
                        backgroundColor: stream.color,
                      }}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Expense Breakdown */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Monthly Expenses</Text>

            <View className="gap-2">
              {expenseBreakdown.map((expense, index) => (
                <View key={index} className="gap-1">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-muted">{expense.name}</Text>
                    <Text className="text-xs font-semibold text-foreground">
                      £{(expense.amount / 1000000).toFixed(1)}M ({expense.percentage.toFixed(1)}%)
                    </Text>
                  </View>
                  <View className="h-2 bg-border rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${expense.percentage}%`,
                        backgroundColor: expense.color,
                      }}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Financial Recommendations */}
          <View className="bg-primary bg-opacity-10 rounded-lg p-4 gap-3" style={{ backgroundColor: `${colors.primary}20` }}>
            <Text className="text-lg font-semibold text-foreground">Recommendations</Text>

            <View className="gap-2">
              <Text className="text-sm text-foreground">
                💡 Your player wages are 65% of budget. Consider selling underperforming players to free up funds.
              </Text>
              <Text className="text-sm text-foreground">
                💡 Ticket revenue is strong. Consider increasing match-day prices slightly.
              </Text>
              <Text className="text-sm text-foreground">
                💡 Sponsorship deals are your largest revenue source. Negotiate renewal soon.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                backgroundColor: colors.primary,
              })}
              className="rounded-lg py-3 items-center"
            >
              <Text className="text-base font-semibold text-background">View Sponsorship Deals</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              })}
              className="rounded-lg py-3 items-center"
            >
              <Text className="text-base font-semibold text-foreground">Budget Allocation</Text>
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
              <Text className="text-base font-semibold text-foreground">Back to Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
