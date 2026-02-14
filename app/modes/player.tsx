import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Container, Button, Card } from "@/components/ui";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors, spacing, typography, borderRadius, shadows } from "@/constants/design";
import { db, Save, Player, Club } from "@/lib/db";
import { Ionicons } from "@expo/vector-icons";

export default function PlayerModeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [save, setSave] = useState<Save | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPlayerData();
    }
  }, [id]);

  const loadPlayerData = async () => {
    setLoading(true);
    try {
      const saveData = await db.saves.get(id!);
      if (!saveData) {
        router.replace("/");
        return;
      }
      setSave(saveData);

      // In player mode, the save usually tracks one specific player
      // For now, let's assume it's Lamine Yamal (p_yamal) if not set
      const playerId = saveData.gameData ? JSON.parse(saveData.gameData).playerId : "p_yamal";
      const playerData = await db.players.get(playerId);
      setPlayer(playerData);

      if (playerData?.clubId) {
        const clubData = await db.clubs.get(playerData.clubId);
        setClub(clubData);
      }
    } catch (error) {
      console.error("Error loading player data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container safeArea style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </Container>
    );
  }

  if (!player || !save) return null;

  const dashboardItems = [
    { title: "Profile", icon: "person", detail: `${player.position} • Age ${player.age}`, route: "modes/player-profile" },
    { title: "Training", icon: "fitness", detail: "Focus: Shooting", route: "modes/training" },
    { title: "Career", icon: "trophy", detail: "0 Goals • 0 Assists", route: "modes/career-stats" },
    { title: "Club", icon: "business", detail: club?.name || "Free Agent", route: "modes/club-info" },
  ];

  const attributes = [
    { label: "Pace", value: player.pace },
    { label: "Shooting", value: player.shooting },
    { label: "Passing", value: player.passing },
    { label: "Dribbling", value: player.dribbling },
    { label: "Defending", value: player.defending },
    { label: "Physical", value: player.physical },
  ];

  return (
    <Container safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/")} style={styles.backButton}>
          <Ionicons name="home" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.clubName}>{club?.name || "Unattached"}</Text>
        </View>
        <View style={styles.ratingCircle}>
          <Text style={styles.ratingValue}>{player.rating}</Text>
          <Text style={styles.ratingLabel}>OVR</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {dashboardItems.map((item) => (
            <TouchableOpacity 
              key={item.title} 
              style={styles.gridItem}
              onPress={() => {}}
            >
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon as any} size={24} color={colors.accent} />
              </View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDetail}>{item.detail}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card style={styles.attributesCard}>
          <Card.Header>
            <Text style={styles.sectionTitle}>Attributes</Text>
          </Card.Header>
          <Card.Content>
            <View style={styles.attributesGrid}>
              {attributes.map((attr) => (
                <View key={attr.label} style={styles.attributeItem}>
                  <View style={styles.attributeHeader}>
                    <Text style={styles.attributeLabel}>{attr.label}</Text>
                    <Text style={styles.attributeValue}>{attr.value}</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${attr.value}%` }]} />
                  </View>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Button 
          variant="primary" 
          style={styles.matchButton}
          onPress={() => router.push({
            pathname: "/modes/match-simulation",
            params: { saveId: save.id, opponentId: "c_mancity" } // Dummy opponent
          })}
        >
          Play Next Match
        </Button>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  playerName: {
    ...typography.h2,
    color: colors.text,
  },
  clubName: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  ratingCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingValue: {
    ...typography.h3,
    color: colors.backgroundDark,
    fontWeight: '900',
  },
  ratingLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.backgroundDark,
    marginTop: -2,
  },
  scrollContent: {
    padding: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  gridItem: {
    width: '47.5%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  itemTitle: {
    ...typography.captionBold,
    color: colors.text,
  },
  itemDetail: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 2,
  },
  attributesCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
  },
  attributesGrid: {
    gap: spacing.md,
  },
  attributeItem: {
    gap: spacing.xs,
  },
  attributeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  attributeLabel: {
    ...typography.tiny,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  attributeValue: {
    ...typography.captionBold,
    color: colors.text,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  matchButton: {
    width: '100%',
    marginBottom: spacing.xxl,
  },
});
