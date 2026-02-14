import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList } from "react-native";
import { Container, Button, Card, Avatar } from "@/components/ui";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors, spacing, typography, borderRadius, shadows, iconSize } from "@/constants/design";
import { db, Player, Club } from "@/lib/db";
import { Ionicons } from "@expo/vector-icons";

export default function SquadManagementScreen() {
  const router = useRouter();
  const { saveId } = useLocalSearchParams<{ saveId: string }>();
  const [squad, setSquad] = useState<Player[]>([]);
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (saveId) {
      loadSquad();
    }
  }, [saveId]);

  const loadSquad = async () => {
    setLoading(true);
    try {
      const save = await db.saves.get(saveId!);
      if (save?.clubId) {
        const clubData = await db.clubs.get(save.clubId);
        setClub(clubData);
        const players = await db.players.listByClub(save.clubId);
        setSquad(players.sort((a, b) => b.rating - a.rating));
      }
    } catch (error) {
      console.error("Error loading squad:", error);
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
            <View style={styles.playerMeta}>
              <Text style={styles.metaText}>{item.position}</Text>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.metaText}>{item.age} years</Text>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.metaText}>{item.nationality}</Text>
            </View>
          </View>
        </View>
        <View style={styles.playerStats}>
          <View style={styles.statMini}>
            <Text style={styles.statLabel}>PAC</Text>
            <Text style={styles.statValue}>{item.pace}</Text>
          </View>
          <View style={styles.statMini}>
            <Text style={styles.statLabel}>SHO</Text>
            <Text style={styles.statValue}>{item.shooting}</Text>
          </View>
          <View style={styles.statMini}>
            <Text style={styles.statLabel}>PAS</Text>
            <Text style={styles.statValue}>{item.passing}</Text>
          </View>
          <View style={styles.statMini}>
            <Text style={styles.statLabel}>DRI</Text>
            <Text style={styles.statValue}>{item.dribbling}</Text>
          </View>
          <View style={styles.statMini}>
            <Text style={styles.statLabel}>DEF</Text>
            <Text style={styles.statValue}>{item.defending}</Text>
          </View>
          <View style={styles.statMini}>
            <Text style={styles.statLabel}>PHY</Text>
            <Text style={styles.statValue}>{item.physical}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <Container safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Squad Management</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={squad}
          renderItem={renderPlayer}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={() => (
            <View style={styles.listHeader}>
              <Text style={styles.squadCount}>{squad.length} Players in Senior Squad</Text>
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
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  listContent: {
    padding: spacing.md,
  },
  listHeader: {
    marginBottom: spacing.md,
  },
  squadCount: {
    ...typography.caption,
    color: colors.textSecondary,
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
    marginBottom: spacing.sm,
  },
  ratingBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  ratingText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  playerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...typography.tiny,
    color: colors.textSecondary,
  },
  bullet: {
    marginHorizontal: 4,
    color: colors.textTertiary,
  },
  playerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statMini: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.textTertiary,
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
  },
});
