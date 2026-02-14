import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList } from "react-native";
import { Container, Button, Card, Input } from "@/components/ui";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors, spacing, typography, borderRadius, shadows } from "@/constants/design";
import { db, Player } from "@/lib/db";
import { Ionicons } from "@expo/vector-icons";

export default function TransferMarketScreen() {
  const router = useRouter();
  const { saveId } = useLocalSearchParams<{ saveId: string }>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await db.players.search(searchQuery);
      setPlayers(results);
    } catch (error) {
      console.error("Error searching players:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPlayer = ({ item }: { item: Player }) => (
    <Card style={styles.playerCard}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.playerMain}>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{item.name}</Text>
            <Text style={styles.metaText}>{item.position} • {item.age} years • {item.nationality}</Text>
          </View>
          <View style={styles.valueInfo}>
            <Text style={styles.valueText}>£{(item.value / 1000000).toFixed(1)}M</Text>
            <Text style={styles.wageText}>£{(item.wage / 1000).toFixed(0)}k p/w</Text>
          </View>
        </View>
        <Button 
          variant="outline" 
          size="sm" 
          style={styles.actionButton}
          onPress={() => {}}
        >
          Approach to Sign
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <Container safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Transfer Market</Text>
      </View>

      <View style={styles.searchBar}>
        <Input
          placeholder="Search players by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          leftIcon={<Ionicons name="search" size={20} color={colors.textTertiary} />}
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={players}
          renderItem={renderPlayer}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No players found matching your search</Text>
            </View>
          )}
        />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  listContent: {
    padding: spacing.md,
  },
  playerCard: {
    marginBottom: spacing.sm,
  },
  cardContent: {
    padding: spacing.sm,
  },
  playerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  ratingBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  ratingText: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  metaText: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 2,
  },
  valueInfo: {
    alignItems: 'flex-end',
  },
  valueText: {
    ...typography.captionBold,
    color: colors.accent,
  },
  wageText: {
    ...typography.tiny,
    color: colors.textTertiary,
  },
  actionButton: {
    width: '100%',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
