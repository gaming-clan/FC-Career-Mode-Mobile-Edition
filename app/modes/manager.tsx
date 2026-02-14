import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Container, Button, Card } from "@/components/ui";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors, spacing, typography, borderRadius, shadows } from "@/constants/design";
import { db, Save, Club, Player } from "@/lib/db";
import { Ionicons } from "@expo/vector-icons";

export default function ManagerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [save, setSave] = useState<Save | null>(null);
  const [club, setClub] = useState<Club | null>(null);
  const [squad, setSquad] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadSaveData();
    }
  }, [id]);

  const loadSaveData = async () => {
    setLoading(true);
    try {
      const saveData = await db.saves.get(id!);
      if (!saveData) {
        router.replace("/");
        return;
      }

      setSave(saveData);

      if (!saveData.clubId) {
        router.replace(`/modes/club-selection?saveId=${id}`);
        return;
      }

      const clubData = await db.clubs.get(saveData.clubId);
      setClub(clubData);

      const squadData = await db.players.listByClub(saveData.clubId);
      setSquad(squadData);
    } catch (error) {
      console.error("Error loading manager data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateMatch = () => {
    // For now, let's just pick Arsenal (c_arsenal) as a dummy opponent if not already set
    const opponentId = "c_arsenal";
    router.push({
      pathname: "/modes/match-simulation",
      params: { saveId: save.id, opponentId }
    });
  };

  if (loading) {
    return (
      <Container safeArea style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </Container>
    );
  }

  if (!club || !save) return null;

  const dashboardItems = [
    { title: "Squad", icon: "people", detail: `${squad.length} Players`, route: "modes/squad-management" },
    { title: "Tactics", icon: "grid", detail: "4-3-3 Holding", route: "modes/tactics" },
    { title: "Transfers", icon: "swap-horizontal", detail: "Window Open", route: "modes/transfers" },
    { title: "Finances", icon: "cash", detail: `£${(club.budget / 1000000).toFixed(1)}M`, route: "modes/financial" },
  ];

  return (
    <Container safeArea style={styles.container}>
      <View style={[styles.hero, { backgroundColor: club.primaryColor }]}>
        <TouchableOpacity onPress={() => router.replace("/")} style={styles.backButton}>
          <Ionicons name="home" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.heroContent}>
          <Text style={styles.clubName}>{club.name}</Text>
          <Text style={styles.managerName}>Manager: {save.name}</Text>
          <View style={styles.seasonBadge}>
            <Text style={styles.seasonText}>SEASON {save.seasonYear} • WEEK {save.currentWeek}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {dashboardItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.gridItem}
              onPress={() => router.push({ pathname: item.route as any, params: { saveId: save.id } })}
            >
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon as any} size={24} color={colors.primary} />
              </View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDetail}>{item.detail}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card style={styles.nextMatchCard}>
          <Card.Header>
            <Text style={styles.sectionTitle}>Next Match</Text>
          </Card.Header>
          <Card.Content>
            <View style={styles.matchRow}>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{club.shortName}</Text>
                <Text style={styles.venue}>HOME</Text>
              </View>
              <Text style={styles.vs}>VS</Text>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>ARS</Text>
                <Text style={styles.venue}>AWAY</Text>
              </View>
            </View>
          </Card.Content>
          <Card.Footer>
            <Button variant="primary" style={styles.simulateButton} onPress={handleSimulateMatch}>
              Simulate Match
            </Button>
          </Card.Footer>
        </Card>

        <View style={styles.leagueSummary}>
          <Text style={styles.sectionTitle}>League Standing</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.cell, styles.pos]}>POS</Text>
              <Text style={[styles.cell, styles.team]}>CLUB</Text>
              <Text style={[styles.cell, styles.stat]}>P</Text>
              <Text style={[styles.cell, styles.stat]}>PTS</Text>
            </View>
            <View style={[styles.tableRow, styles.activeRow]}>
              <Text style={[styles.cell, styles.pos]}>1</Text>
              <Text style={[styles.cell, styles.team]}>{club.name}</Text>
              <Text style={[styles.cell, styles.stat]}>0</Text>
              <Text style={[styles.cell, styles.stat]}>0</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.cell, styles.pos]}>2</Text>
              <Text style={[styles.cell, styles.team]}>Arsenal</Text>
              <Text style={[styles.cell, styles.stat]}>0</Text>
              <Text style={[styles.cell, styles.stat]}>0</Text>
            </View>
          </View>
        </View>
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
  hero: {
    height: 180,
    padding: spacing.md,
    justifyContent: 'flex-end',
  },
  backButton: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
  },
  heroContent: {
    marginBottom: spacing.sm,
  },
  clubName: {
    ...typography.display,
    color: colors.white,
    fontSize: 32,
  },
  managerName: {
    ...typography.body,
    color: colors.white,
    opacity: 0.9,
  },
  seasonBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
  },
  seasonText: {
    ...typography.tiny,
    color: colors.white,
    fontWeight: 'bold',
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
  nextMatchCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
  },
  teamInfo: {
    alignItems: 'center',
  },
  teamName: {
    ...typography.h2,
    color: colors.text,
  },
  venue: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 2,
  },
  vs: {
    ...typography.h3,
    color: colors.textTertiary,
  },
  simulateButton: {
    width: '100%',
  },
  leagueSummary: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  table: {
    marginTop: spacing.md,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.xs,
    marginBottom: spacing.xs,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  activeRow: {
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
  },
  cell: {
    ...typography.tiny,
    color: colors.textSecondary,
  },
  pos: { width: 30 },
  team: { flex: 1, color: colors.text },
  stat: { width: 30, textAlign: 'center' },
});
