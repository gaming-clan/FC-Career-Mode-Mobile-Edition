import { ScrollView, Text, View, TouchableOpacity, StyleSheet, PressableProps } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();

  const gameModes = [
    {
      id: "manager",
      title: "Manager Career",
      description: "Lead a club to glory. Handle transfers, tactics, and finances.",
    },
    {
      id: "player",
      title: "Player Career",
      description: "Rise from prospect to legend. Train, perform, and earn glory.",
    },
    {
      id: "sporting_director",
      title: "Sporting Director",
      description: "Build a winning club. Scout, negotiate, and plan strategy.",
    },
    {
      id: "create_a_club",
      title: "Create-a-Club",
      description: "Start from scratch. Build your club identity and rise.",
    },
  ];

  const handleModePress = (modeId: string) => {
    if (modeId === "manager") router.push("/modes/manager");
    else if (modeId === "player") router.push("/modes/player");
    else if (modeId === "sporting_director") router.push("/modes/sporting_director");
    else if (modeId === "create_a_club") router.push("/modes/create_a_club");
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-primary px-6 py-8 gap-2" style={{ backgroundColor: colors.primary }}>
          <Text className="text-4xl font-bold text-background">Football Manager</Text>
          <Text className="text-base text-background opacity-90">
            Your journey in football starts here
          </Text>
        </View>

        <View className="flex-1 px-4 py-6 gap-4">
          {gameModes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              onPress={() => handleModePress(mode.id)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
              className="bg-surface rounded-2xl p-4 border border-border"
            >
              <View>
                <Text className="text-lg font-semibold text-foreground">{mode.title}</Text>
                <Text className="text-sm text-muted mt-1 leading-relaxed">{mode.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View className="px-6 py-4 border-t border-border">
          <Text className="text-xs text-muted text-center leading-relaxed">
            Choose your path and experience the depth of football management.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
