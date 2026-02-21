/**
 * Staff Management Screen
 * Manage coaching and medical staff
 */

import * as React from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { getStaffRecommendations, calculateTotalStaffCosts } from "@/lib/staff-management";

export default function StaffManagementScreen() {
  const router = useRouter();
  const colors = useColors();

  // Mock staff data
  const coachingStaff = [
    {
      name: "John Smith",
      role: "Manager",
      effectiveness: 78,
      salary: 500000,
      experience: 15,
    },
    {
      name: "Carlos García",
      role: "Attacking Coach",
      effectiveness: 72,
      salary: 120000,
      experience: 8,
    },
    {
      name: "Marco Rossi",
      role: "Defensive Coach",
      effectiveness: 75,
      salary: 120000,
      experience: 10,
    },
  ];

  const medicalStaff = [
    {
      name: "Dr. James Wilson",
      role: "Head Physio",
      effectiveness: 82,
      salary: 120000,
      experience: 12,
    },
    {
      name: "Sarah Johnson",
      role: "Assistant Physio",
      effectiveness: 70,
      salary: 60000,
      experience: 5,
    },
  ];

  const allStaff = [...coachingStaff, ...medicalStaff];
  const totalStaffCosts = calculateTotalStaffCosts(allStaff as any);

  const recommendations = getStaffRecommendations(allStaff as any, [], 500000);

  const renderStaffCard = (staff: any) => (
    <View key={staff.name} className="bg-surface rounded-lg p-4 border border-border mb-3">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">{staff.name}</Text>
          <Text className="text-sm text-muted">{staff.role}</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-primary" style={{ color: colors.primary }}>
            {staff.effectiveness}
          </Text>
          <Text className="text-xs text-muted">Effectiveness</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm text-muted">{staff.experience} years experience</Text>
        <Text className="text-sm font-semibold text-foreground">
          £{(staff.salary / 1000).toFixed(0)}k/year
        </Text>
      </View>

      <View className="h-2 bg-border rounded-full overflow-hidden">
        <View
          className="h-full bg-primary rounded-full"
          style={{
            width: `${staff.effectiveness}%`,
            backgroundColor: colors.primary,
          }}
        />
      </View>
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
          <Text className="text-3xl font-bold text-background">Staff Management</Text>
          <Text className="text-sm text-background opacity-90">Manage your coaching and medical team</Text>
        </View>

        <View className="px-4 py-6 gap-6">
          {/* Staff Costs */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Annual Staff Costs</Text>
            <Text className="text-3xl font-bold text-error" style={{ color: colors.error }}>
              £{(totalStaffCosts / 1000000).toFixed(1)}M
            </Text>
            <Text className="text-sm text-muted">
              {allStaff.length} staff members
            </Text>
          </View>

          {/* Coaching Staff */}
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <View
                className="w-1 h-6 rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
              <Text className="text-lg font-semibold text-foreground">
                Coaching Staff ({coachingStaff.length})
              </Text>
            </View>
            {coachingStaff.map(renderStaffCard)}
          </View>

          {/* Medical Staff */}
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <View
                className="w-1 h-6 rounded-full"
                style={{ backgroundColor: colors.success }}
              />
              <Text className="text-lg font-semibold text-foreground">
                Medical Staff ({medicalStaff.length})
              </Text>
            </View>
            {medicalStaff.map(renderStaffCard)}
          </View>

          {/* Staff Recommendations */}
          {recommendations.length > 0 && (
            <View className="bg-primary bg-opacity-10 rounded-lg p-4 gap-3" style={{ backgroundColor: `${colors.warning}20` }}>
              <Text className="text-lg font-semibold text-foreground">Recommended Hires</Text>
              {recommendations.map((rec, idx) => (
                <View key={idx} className="gap-1">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm font-semibold text-foreground capitalize">
                      {rec.role.replace(/_/g, " ")}
                    </Text>
                    <Text
                      className="text-xs font-semibold px-2 py-1 rounded-lg"
                      style={{
                        backgroundColor:
                          rec.priority === "critical"
                            ? `${colors.error}30`
                            : rec.priority === "high"
                              ? `${colors.warning}30`
                              : `${colors.muted}30`,
                        color:
                          rec.priority === "critical"
                            ? colors.error
                            : rec.priority === "high"
                              ? colors.warning
                              : colors.muted,
                      }}
                    >
                      {rec.priority.toUpperCase()}
                    </Text>
                  </View>
                  <Text className="text-xs text-muted">{rec.expectedBenefit}</Text>
                  <Text className="text-xs text-muted">
                    Estimated cost: £{(rec.estimatedCost / 1000).toFixed(0)}k/year
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Staff Development */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Staff Development</Text>
            <Text className="text-sm text-muted mb-2">
              Invest in staff training to improve their effectiveness
            </Text>

            <View className="gap-2">
              <TouchableOpacity
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                })}
                className="rounded-lg py-2 px-3 flex-row justify-between items-center"
              >
                <Text className="text-sm text-foreground">Coaching Workshop</Text>
                <Text className="text-sm font-semibold text-muted">£50k</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                })}
                className="rounded-lg py-2 px-3 flex-row justify-between items-center"
              >
                <Text className="text-sm text-foreground">Medical Certification</Text>
                <Text className="text-sm font-semibold text-muted">£30k</Text>
              </TouchableOpacity>
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
              <Text className="text-base font-semibold text-background">Hire New Staff</Text>
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
