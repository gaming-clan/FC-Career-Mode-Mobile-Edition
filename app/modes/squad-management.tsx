import * as React from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { SquadCard } from "@/components/game-modes/squad-card";

export default function SquadManagementScreen() {
  const router = useRouter();
  const colors = useColors();
  const [selectedFormation, setSelectedFormation] = React.useState("4-3-3");

  const mockSquad = [
    { id: 1, name: "David De Gea", position: "GK", rating: 89, age: 33 },
    { id: 2, name: "Lisandro Martinez", position: "CB", rating: 85, age: 24 },
    { id: 3, name: "Harry Maguire", position: "CB", rating: 82, age: 30 },
    { id: 4, name: "Aaron Wan-Bissaka", position: "RB", rating: 80, age: 26 },
    { id: 5, name: "Luke Shaw", position: "LB", rating: 81, age: 28 },
    { id: 6, name: "Scott McTominay", position: "CM", rating: 81, age: 27 },
    { id: 7, name: "Bruno Fernandes", position: "CM", rating: 91, age: 29 },
    { id: 8, name: "Antony", position: "RW", rating: 82, age: 23 },
    { id: 9, name: "Marcus Rashford", position: "LW", rating: 85, age: 26 },
    { id: 10, name: "Cristiano Ronaldo", position: "ST", rating: 89, age: 38 },
    { id: 11, name: "Jadon Sancho", position: "RW", rating: 80, age: 24 },
  ];

  const formations = [
    { id: "4-3-3", label: "4-3-3 (Balanced)" },
    { id: "4-2-3-1", label: "4-2-3-1 (Defensive)" },
    { id: "3-5-2", label: "3-5-2 (Attacking)" },
    { id: "5-3-2", label: "5-3-2 (Very Defensive)" },
  ];

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-primary px-6 py-6 gap-1" style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base text-background mb-2">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-background">Squad Management</Text>
          <Text className="text-sm text-background opacity-90">Set your formation and lineup</Text>
        </View>

        <View className="px-4 py-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Formation</Text>
          <View className="gap-2">
            {formations.map((formation) => (
              <TouchableOpacity
                key={formation.id}
                onPress={() => setSelectedFormation(formation.id)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
                className="p-3 rounded-lg border"
                style={{
                  backgroundColor:
                    selectedFormation === formation.id ? colors.primary : colors.surface,
                  borderColor: selectedFormation === formation.id ? colors.primary : colors.border,
                  borderWidth: 1,
                }}
              >
                <Text
                  className="font-semibold"
                  style={{
                    color:
                      selectedFormation === formation.id ? colors.background : colors.foreground,
                  }}
                >
                  {formation.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="px-4 py-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Squad ({mockSquad.length})</Text>
          <View className="gap-2">
            {mockSquad.map((player) => (
              <SquadCard
                key={player.id}
                playerName={player.name}
                position={player.position}
                rating={player.rating}
                age={player.age}
                onPress={() => {}}
              />
            ))}
          </View>
        </View>

        <View className="px-4 py-4 gap-3">
          <TouchableOpacity
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              backgroundColor: colors.primary,
            })}
            className="rounded-lg py-3 items-center"
          >
            <Text className="text-base font-semibold text-background">Save Formation</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
