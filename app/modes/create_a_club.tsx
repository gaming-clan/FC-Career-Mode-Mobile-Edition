import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";

export default function CreateAClubModeScreen() {
  const router = useRouter();
  const colors = useColors();

  const menuItems = [
    { id: "club_setup", label: "Club Setup", icon: "🏢" },
    { id: "branding", label: "Branding & Colors", icon: "🎨" },
    { id: "stadium", label: "Stadium Management", icon: "🏟️" },
    { id: "league", label: "League Selection", icon: "📍" },
    { id: "squad", label: "Build Squad", icon: "👥" },
    { id: "finances", label: "Initial Budget", icon: "💰" },
  ];

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-primary px-6 py-6 gap-1" style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base text-background mb-2">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-background">Create-a-Club</Text>
          <Text className="text-sm text-background opacity-90">Build From Scratch</Text>
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
            <Text className="text-sm font-semibold text-foreground mb-2">Club Status</Text>
            <View className="gap-1">
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">Club Name</Text>
                <Text className="text-xs font-semibold text-foreground">Not Set</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">League</Text>
                <Text className="text-xs font-semibold text-foreground">Not Selected</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">Setup Progress</Text>
                <Text className="text-xs font-semibold text-foreground">0%</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
