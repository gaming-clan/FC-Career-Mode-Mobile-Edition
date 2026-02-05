import * as React from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import {
  generateSeasonObjectives,
  calculateJobSecurity,
  calculateBoardConfidence,
  calculatePressureLevel,
  getManagerJobStatus,
  type BoardExpectation,
} from "@/lib/board-expectations";

export default function BoardExpectationsScreen() {
  const router = useRouter();
  const colors = useColors();

  const [boardExpectation] = React.useState<BoardExpectation>(() => {
    const objectives = generateSeasonObjectives(2024, "medium", 8);
    return {
      seasonYear: 2024,
      difficulty: "medium",
      objectives,
      jobSecurity: 65,
      managerRating: 7.5,
      boardConfidence: 72,
      pressureLevel: 35,
    };
  });

  const jobStatus = getManagerJobStatus(boardExpectation.jobSecurity);
  const completedObjectives = boardExpectation.objectives.filter((o) => o.completed).length;

  const getObjectiveColor = (progress: number) => {
    if (progress >= 100) return colors.success;
    if (progress >= 50) return colors.warning;
    return colors.error;
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-primary px-6 py-6 gap-1" style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base text-background mb-2">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-background">Board Expectations</Text>
          <Text className="text-sm text-background opacity-90">Season {boardExpectation.seasonYear}</Text>
        </View>

        <View className="px-4 py-6 gap-6">
          {/* Job Status */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-4">
            <Text className="text-lg font-semibold text-foreground">Manager Status</Text>

            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Job Security</Text>
                <Text className="text-sm font-semibold text-foreground">{boardExpectation.jobSecurity}%</Text>
              </View>
              <View className="w-full h-2 bg-border rounded-full overflow-hidden">
                <View
                  className="h-full"
                  style={{
                    backgroundColor:
                      boardExpectation.jobSecurity >= 60
                        ? colors.success
                        : boardExpectation.jobSecurity >= 40
                          ? colors.warning
                          : colors.error,
                    width: `${boardExpectation.jobSecurity}%`,
                  }}
                />
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Status</Text>
                <View
                  className="px-3 py-1 rounded-full"
                  style={{
                    backgroundColor:
                      boardExpectation.jobSecurity >= 60
                        ? colors.success
                        : boardExpectation.jobSecurity >= 40
                          ? colors.warning
                          : colors.error,
                  }}
                >
                  <Text className="text-xs font-bold text-background">{jobStatus}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Board Metrics */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Board Metrics</Text>

            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Manager Rating</Text>
                <Text className="text-sm font-semibold text-foreground">{boardExpectation.managerRating}/10</Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Board Confidence</Text>
                <Text className="text-sm font-semibold text-foreground">{boardExpectation.boardConfidence}%</Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Pressure Level</Text>
                <Text className="text-sm font-semibold text-foreground">{boardExpectation.pressureLevel}%</Text>
              </View>
            </View>
          </View>

          {/* Season Objectives */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-foreground">Season Objectives</Text>
              <Text className="text-xs font-semibold text-muted">
                {completedObjectives}/{boardExpectation.objectives.length}
              </Text>
            </View>

            <View className="gap-3">
              {boardExpectation.objectives.map((objective) => (
                <View key={objective.id} className="gap-2">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-foreground">{objective.title}</Text>
                      <Text className="text-xs text-muted">{objective.description}</Text>
                    </View>
                    <View
                      className="px-2 py-1 rounded"
                      style={{
                        backgroundColor:
                          objective.difficulty === "hard"
                            ? colors.error
                            : objective.difficulty === "medium"
                              ? colors.warning
                              : colors.success,
                      }}
                    >
                      <Text className="text-xs font-bold text-background capitalize">
                        {objective.difficulty}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <View className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                      <View
                        className="h-full"
                        style={{
                          backgroundColor: getObjectiveColor(objective.progress),
                          width: `${Math.min(100, objective.progress)}%`,
                        }}
                      />
                    </View>
                    <Text className="text-xs font-semibold text-foreground w-10 text-right">
                      {Math.round(objective.progress)}%
                    </Text>
                  </View>

                  <View className="flex-row justify-between">
                    <Text className="text-xs text-muted">
                      {objective.current}/{objective.target}
                    </Text>
                    <Text className="text-xs font-semibold text-success">
                      +${(objective.reward / 1000).toFixed(0)}K
                    </Text>
                  </View>
                </View>
              ))}
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
