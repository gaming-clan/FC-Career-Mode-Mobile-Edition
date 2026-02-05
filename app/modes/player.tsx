import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";

export default function PlayerModeScreen() {
  const router = useRouter();
  const colors = useColors();

  const menuItems = [
    { id: "profile", label: "Player Profile", icon: "👤" },
    { id: "training", label: "Training & Development", icon: "📈" },
    { id: "matches", label: "Match Performance", icon: "⚽" },
    { id: "career", label: "Career Stats", icon: "🏆" },
    { id: "transfers", label: "Transfer Offers", icon: "💼" },
    { id: "contracts", label: "Contract Management", icon: "📝" },
  ];

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-primary px-6 py-6 gap-1" style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base text-background mb-2">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-background">Player Career</Text>
          <Text className="text-sm text-background opacity-90">Age 22 • Striker</Text>
        </View>

        <View className="px-4 py-6 gap-3">
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {}}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
              className="bg-surface rounded-xl p-4 border border-border flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">{item.icon}</Text>
                <Text className="text-base font-semibold text-foreground">{item.label}</Text>
              </View>
              <Text className="text-muted">→</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="px-4 py-4 gap-3">
          <View className="bg-surface rounded-xl p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-3">Attributes</Text>
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-muted">Pace</Text>
                <View className="flex-1 mx-2 bg-border rounded-full h-2" />
                <Text className="text-xs font-semibold text-foreground">87</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-muted">Shooting</Text>
                <View className="flex-1 mx-2 bg-border rounded-full h-2" />
                <Text className="text-xs font-semibold text-foreground">92</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-muted">Passing</Text>
                <View className="flex-1 mx-2 bg-border rounded-full h-2" />
                <Text className="text-xs font-semibold text-foreground">78</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
