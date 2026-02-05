import * as React from "react";
import { ScrollView, Text, View, TouchableOpacity, TextInput, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import {
  generateTransferMarket,
  filterPlayersByPosition,
  filterPlayersByBudget,
  searchPlayers,
  type TransferPlayer,
} from "@/lib/transfer-market";

export default function TransfersScreen() {
  const router = useRouter();
  const colors = useColors();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedPosition, setSelectedPosition] = React.useState<string | null>(null);
  const [players] = React.useState(() => generateTransferMarket(50));
  const [budget] = React.useState(35000000);

  const positions = ["ST", "LW", "RW", "CAM", "CM", "CDM", "LB", "RB", "CB", "GK"];

  let filteredPlayers = players;

  if (searchQuery) {
    filteredPlayers = searchPlayers(filteredPlayers, searchQuery);
  }

  if (selectedPosition) {
    filteredPlayers = filterPlayersByPosition(filteredPlayers, selectedPosition);
  }

  filteredPlayers = filterPlayersByBudget(filteredPlayers, budget);

  const renderPlayerCard = ({ item }: { item: TransferPlayer }) => (
    <TouchableOpacity
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
      className="bg-surface rounded-lg p-4 border border-border mb-3"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">{item.name}</Text>
          <Text className="text-xs text-muted">{item.club}</Text>
        </View>
        <View className="bg-primary px-2 py-1 rounded" style={{ backgroundColor: colors.primary }}>
          <Text className="text-xs font-bold text-background">{item.position}</Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-2 gap-2">
        <View className="flex-1">
          <Text className="text-xs text-muted">Rating</Text>
          <Text className="text-sm font-semibold text-foreground">{item.rating}/100</Text>
        </View>
        <View className="flex-1">
          <Text className="text-xs text-muted">Age</Text>
          <Text className="text-sm font-semibold text-foreground">{item.age}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-xs text-muted">Market Value</Text>
          <Text className="text-sm font-semibold text-foreground">
            ${(item.marketValue / 1000000).toFixed(1)}M
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
          backgroundColor: colors.primary,
        })}
        className="rounded py-2 items-center"
      >
        <Text className="text-sm font-semibold text-background">Make Offer</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-primary px-6 py-6 gap-1" style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base text-background mb-2">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-background">Transfer Market</Text>
          <Text className="text-sm text-background opacity-90">
            Budget: ${(budget / 1000000).toFixed(1)}M
          </Text>
        </View>

        <View className="px-4 py-4 gap-4">
          {/* Search Bar */}
          <TextInput
            placeholder="Search players, clubs..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            style={{ color: colors.foreground }}
          />

          {/* Position Filter */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Position</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setSelectedPosition(null)}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor:
                      selectedPosition === null ? colors.primary : colors.surface,
                  })}
                  className="px-4 py-2 rounded-full border border-border"
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color:
                        selectedPosition === null ? colors.background : colors.foreground,
                    }}
                  >
                    All
                  </Text>
                </TouchableOpacity>

                {positions.map((pos) => (
                  <TouchableOpacity
                    key={pos}
                    onPress={() => setSelectedPosition(pos)}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.7 : 1,
                      backgroundColor:
                        selectedPosition === pos ? colors.primary : colors.surface,
                    })}
                    className="px-4 py-2 rounded-full border border-border"
                  >
                    <Text
                      className="text-sm font-semibold"
                      style={{
                        color:
                          selectedPosition === pos ? colors.background : colors.foreground,
                      }}
                    >
                      {pos}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Players List */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              Available Players ({filteredPlayers.length})
            </Text>

            {filteredPlayers.length > 0 ? (
              <FlatList
                data={filteredPlayers}
                renderItem={renderPlayerCard}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            ) : (
              <View className="bg-surface rounded-lg p-6 items-center">
                <Text className="text-sm text-muted">No players found matching your criteria</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
