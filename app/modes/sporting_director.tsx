import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";

export default function SportingDirectorModeScreen() {
  const router = useRouter();
  const colors = useColors();

  const menuItems = [
    { id: "scouting", label: "Scouting Network", icon: "🔍" },
    { id: "recruitment", label: "Recruitment", icon: "👥" },
    { id: "transfers", label: "Transfer Strategy", icon: "🔄" },
    { id: "academy", label: "Youth Academy", icon: "🎓" },
    { id: "analytics", label: "Analytics & Data", icon: "📊" },
    { id: "contracts", label: "Contract Negotiations", icon: "📋" },
  ];

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-primary px-6 py-6 gap-1" style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base text-background mb-2">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-background">Sporting Director</Text>
          <Text className="text-sm text-background opacity-90">Build Your Club</Text>
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
            <Text className="text-sm font-semibold text-foreground mb-2">Squad Overview</Text>
            <View className="gap-1">
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">Total Players</Text>
                <Text className="text-xs font-semibold text-foreground">25</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">Average Age</Text>
                <Text className="text-xs font-semibold text-foreground">26.3</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">Squad Value</Text>
                <Text className="text-xs font-semibold text-foreground">$125M</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
