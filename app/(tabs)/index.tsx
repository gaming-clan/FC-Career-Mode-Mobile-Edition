import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { getAllGameModes } from "@/constants/game-modes";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();

  const gameModes = getAllGameModes();

  const handleModePress = (route: string) => {
    router.push(route);
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
