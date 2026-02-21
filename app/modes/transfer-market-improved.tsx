/**
 * Improved Transfer Market Screen
 * Browse, search, and negotiate transfers with AI clubs
 */

import * as React from "react";
import { ScrollView, Text, View, TouchableOpacity, TextInput, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { useGameState } from "@/lib/game-state-context";
import {
  generateTransferMarket,
  filterPlayersByPosition,
  filterPlayersByBudget,
  filterPlayersByRating,
  searchPlayers,
  makeTransferOffer,
  getAINegotiationResponse,
  generateCounterOffer,
  type TransferPlayer,
} from "@/lib/transfer-market";

export default function ImprovedTransferMarketScreen() {
  const router = useRouter();
  const colors = useColors();
  const { gameState } = useGameState();

  const [allPlayers, setAllPlayers] = React.useState<TransferPlayer[]>([]);
  const [filteredPlayers, setFilteredPlayers] = React.useState<TransferPlayer[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedPosition, setSelectedPosition] = React.useState<string | null>(null);
  const [minRating, setMinRating] = React.useState(70);
  const [selectedPlayer, setSelectedPlayer] = React.useState<TransferPlayer | null>(null);
  const [offerPrice, setOfferPrice] = React.useState("");
  const [negotiationStatus, setNegotiationStatus] = React.useState<string | null>(null);

  // Initialize transfer market
  React.useEffect(() => {
    const players = generateTransferMarket(100);
    setAllPlayers(players);
    setFilteredPlayers(players);
  }, []);

  // Filter players
  React.useEffect(() => {
    let filtered = allPlayers;

    if (searchQuery) {
      filtered = searchPlayers(filtered, searchQuery);
    }

    if (selectedPosition) {
      filtered = filterPlayersByPosition(filtered, selectedPosition);
    }

    filtered = filterPlayersByRating(filtered, minRating);

    if (gameState?.playerClub.budget) {
      filtered = filterPlayersByBudget(filtered, gameState.playerClub.budget);
    }

    setFilteredPlayers(filtered);
  }, [searchQuery, selectedPosition, minRating, allPlayers, gameState?.playerClub.budget]);

  const positions = ["ST", "LW", "RW", "CAM", "CM", "CDM", "LB", "RB", "CB", "GK"];

  const handleMakeOffer = () => {
    if (!selectedPlayer || !offerPrice) return;

    const offer = makeTransferOffer(selectedPlayer, gameState?.playerClub.name || "Your Club", parseInt(offerPrice));
    const response = getAINegotiationResponse(offer);

    if (response === "accept") {
      setNegotiationStatus(`✅ ${selectedPlayer.name} transfer accepted!`);
    } else if (response === "reject") {
      setNegotiationStatus(`❌ Offer rejected. Try again with a higher bid.`);
    } else {
      const counter = generateCounterOffer(offer);
      setNegotiationStatus(`💬 Counter offer: £${counter.toLocaleString()}`);
    }
  };

  const renderPlayerCard = (player: TransferPlayer) => (
    <TouchableOpacity
      key={player.id}
      onPress={() => {
        setSelectedPlayer(player);
        setOfferPrice(Math.round(player.marketValue * 0.8).toString());
      }}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
      className={`bg-surface rounded-lg p-4 border mb-3 ${
        selectedPlayer?.id === player.id ? "border-primary" : "border-border"
      }`}
      style={{
        borderColor: selectedPlayer?.id === player.id ? colors.primary : colors.border,
        borderWidth: 2,
      }}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">{player.name}</Text>
          <View className="flex-row gap-2 mt-1">
            <Text className="text-xs text-muted">{player.position}</Text>
            <Text className="text-xs text-muted">Age {player.age}</Text>
            <Text className="text-xs text-muted">{player.nationality}</Text>
          </View>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-primary" style={{ color: colors.primary }}>
            {player.rating}
          </Text>
          <Text className="text-xs text-muted">Rating</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm text-muted">{player.club}</Text>
        <Text className="text-sm font-semibold text-foreground">
          £{(player.marketValue / 1000000).toFixed(1)}M
        </Text>
      </View>

      <View className="bg-background rounded-lg p-2">
        <Text className="text-xs text-muted">Asking Price: £{(player.askingPrice / 1000000).toFixed(1)}M</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="bg-primary px-6 py-6 gap-1" style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base text-background mb-2">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-background">Transfer Market</Text>
          <Text className="text-sm text-background opacity-90">Browse and negotiate transfers</Text>
        </View>

        <View className="px-4 py-6 gap-6">
          {/* Budget Info */}
          {gameState && (
            <View className="bg-surface rounded-lg p-4 border border-border gap-2">
              <Text className="text-sm text-muted">Available Budget</Text>
              <Text className="text-2xl font-bold text-foreground">
                £{(gameState.playerClub.budget / 1000000).toFixed(1)}M
              </Text>
            </View>
          )}

          {/* Search */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Search Players</Text>
            <TextInput
              placeholder="Player name, club, or nationality..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="bg-surface rounded-lg px-4 py-3 border border-border text-foreground"
              style={{
                borderColor: colors.border,
                color: colors.foreground,
              }}
            />
          </View>

          {/* Position Filter */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Position</Text>
            <View className="flex-row flex-wrap gap-2">
              <TouchableOpacity
                onPress={() => setSelectedPosition(null)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
                className="px-3 py-2 rounded-lg border"
                style={{
                  backgroundColor: !selectedPosition ? colors.primary : colors.surface,
                  borderColor: !selectedPosition ? colors.primary : colors.border,
                  borderWidth: 1,
                }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{
                    color: !selectedPosition ? colors.background : colors.foreground,
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
                  })}
                  className="px-3 py-2 rounded-lg border"
                  style={{
                    backgroundColor: selectedPosition === pos ? colors.primary : colors.surface,
                    borderColor: selectedPosition === pos ? colors.primary : colors.border,
                    borderWidth: 1,
                  }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{
                      color: selectedPosition === pos ? colors.background : colors.foreground,
                    }}
                  >
                    {pos}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Rating Filter */}
          <View className="gap-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-semibold text-foreground">Minimum Rating</Text>
              <Text className="text-sm font-semibold text-primary" style={{ color: colors.primary }}>
                {minRating}+
              </Text>
            </View>
            <View className="flex-row gap-2">
              {[70, 75, 80, 85].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  onPress={() => setMinRating(rating)}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                  })}
                  className="flex-1 py-2 rounded-lg border"
                  style={{
                    backgroundColor: minRating === rating ? colors.primary : colors.surface,
                    borderColor: minRating === rating ? colors.primary : colors.border,
                    borderWidth: 1,
                  }}
                >
                  <Text
                    className="text-xs font-semibold text-center"
                    style={{
                      color: minRating === rating ? colors.background : colors.foreground,
                    }}
                  >
                    {rating}+
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Players List */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              Available Players ({filteredPlayers.length})
            </Text>
            {filteredPlayers.map(renderPlayerCard)}
          </View>

          {/* Selected Player Details & Offer */}
          {selectedPlayer && (
            <View className="bg-primary bg-opacity-10 rounded-lg p-4 gap-3" style={{ backgroundColor: `${colors.primary}20` }}>
              <Text className="text-base font-semibold text-foreground">Make an Offer</Text>

              <View className="gap-2">
                <Text className="text-sm text-muted">Offer Amount (£)</Text>
                <TextInput
                  placeholder="Enter offer amount..."
                  placeholderTextColor={colors.muted}
                  value={offerPrice}
                  onChangeText={setOfferPrice}
                  keyboardType="number-pad"
                  className="bg-surface rounded-lg px-4 py-3 border border-border text-foreground"
                  style={{
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                />
                <Text className="text-xs text-muted">
                  Market Value: £{(selectedPlayer.marketValue / 1000000).toFixed(1)}M
                </Text>
              </View>

              {negotiationStatus && (
                <View className="bg-background rounded-lg p-3">
                  <Text className="text-sm text-foreground">{negotiationStatus}</Text>
                </View>
              )}

              <TouchableOpacity
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: colors.primary,
                })}
                className="rounded-lg py-3 items-center"
                onPress={handleMakeOffer}
              >
                <Text className="text-base font-semibold text-background">
                  {negotiationStatus ? "Make Counter Offer" : "Make Offer"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
