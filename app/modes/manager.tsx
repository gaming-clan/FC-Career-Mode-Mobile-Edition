import * as React from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";

export default function ManagerScreen() {
  const router = useRouter();
  const colors = useColors();

  const menuItems = [
    { title: "Squad Management", icon: "👥", route: "modes/squad-management" },
    { title: "Fixtures & Results", icon: "⚽", route: "modes/fixtures" },
    { title: "League Standings", icon: "📊", route: "modes/standings" },
    { title: "Financial Dashboard", icon: "💰", route: "modes/financial" },
    { title: "Transfer Market", icon: "🔄", route: "modes/transfers" },
  ];

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-primary px-6 py-6 gap-1" style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base text-background mb-2">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-background">Manager Career</Text>
          <Text className="text-sm text-background opacity-90">Lead your club to glory</Text>
        </View>

        <View className="px-4 py-6 gap-3">
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.route}
              onPress={() => router.push(item.route as any)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
              className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between"
            >
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">{item.title}</Text>
              </View>
              <Text className="text-2xl">{item.icon}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="px-4 py-4 gap-3">
          <TouchableOpacity
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              backgroundColor: colors.primary,
            })}
            className="rounded-lg py-3 items-center"
          >
            <Text className="text-base font-semibold text-background">Simulate Week</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            })}
            className="rounded-lg py-3 items-center border"
          >
            <Text className="text-base font-semibold text-foreground">Save Career</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
