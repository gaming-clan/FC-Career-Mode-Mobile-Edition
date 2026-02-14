import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Container, Button, Card } from "@/components/ui";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors, spacing, typography, borderRadius, shadows } from "@/constants/design";
import { db, Save, Club, Player } from "@/lib/db";
import { Ionicons } from "@expo/vector-icons";

export default function SportingDirectorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [save, setSave] = useState<Save | null>(null);
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadDirectorData();
    }
  }, [id]);

  const loadDirectorData = async () => {
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
    } catch (error) {
      console.error("Error loading director data:", error);
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

  if (!club || !save) return null;

  const dashboardItems = [
    { title: "Recruitment", icon: "search", detail: "Scouting Active", route: "modes/scouting" },
    { title: "Academy", icon: "school", detail: "3 High Potential", route: "modes/academy" },
    { title: "Strategy", icon: "trending-up", detail: "Philosophy: Youth", route: "modes/philosophy" },
    { title: "Facilities", icon: "stadium", detail: "Level 4 Training", route: "modes/facilities" },
  ];

  return (
    <Container safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/")} style={styles.backButton}>
          <Ionicons name="home" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.directorName}>{save.name}</Text>
          <Text style={styles.titleText}>Sporting Director • {club.name}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Budget</Text>
            <Text style={styles.statValue}>£{(club.budget / 1000000).toFixed(1)}M</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Board Trust</Text>
            <Text style={[styles.statValue, { color: colors.success }]}>85%</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Vision</Text>
            <Text style={styles.statValue}>Elite</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {dashboardItems.map((item) => (
            <TouchableOpacity 
              key={item.title} 
              style={styles.gridItem}
              onPress={() => {}}
            >
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon as any} size={24} color="#6366F1" />
              </View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDetail}>{item.detail}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card style={styles.recruitmentCard}>
          <Card.Header>
            <Text style={styles.sectionTitle}>Transfer Targets</Text>
          </Card.Header>
          <Card.Content>
            <View style={styles.emptyList}>
              <Text style={styles.emptyText}>Assign scouts to discover players matching your recruitment profile.</Text>
              <Button variant="outline" size="sm" style={styles.actionButton}>Go to Scouting</Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.facilitiesCard}>
          <Card.Header>
            <Text style={styles.sectionTitle}>Facilities Status</Text>
          </Card.Header>
          <Card.Content>
            <View style={styles.facilityRow}>
              <Ionicons name="fitness" size={20} color={colors.primary} />
              <View style={styles.facilityInfo}>
                <Text style={styles.facilityName}>Training Ground</Text>
                <Text style={styles.facilityLevel}>Level 4 (Elite)</Text>
              </View>
              <Button variant="ghost" size="sm">Upgrade</Button>
            </View>
            <View style={[styles.facilityRow, { borderBottomWidth: 0 }]}>
              <Ionicons name="medical" size={20} color={colors.error} />
              <View style={styles.facilityInfo}>
                <Text style={styles.facilityName}>Medical Center</Text>
                <Text style={styles.facilityLevel}>Level 3 (Pro)</Text>
              </View>
              <Button variant="ghost" size="sm">Upgrade</Button>
            </View>
          </Card.Content>
        </Card>
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
  directorName: {
    ...typography.h2,
    color: colors.text,
  },
  titleText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statLabel: {
    ...typography.tiny,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    ...typography.captionBold,
    color: colors.text,
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
  recruitmentCard: {
    marginBottom: spacing.lg,
  },
  facilitiesCard: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
  },
  emptyList: {
    padding: spacing.md,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  actionButton: {
    width: '100%',
  },
  facilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  facilityInfo: {
    flex: 1,
  },
  facilityName: {
    ...typography.captionBold,
    color: colors.text,
  },
  facilityLevel: {
    ...typography.tiny,
    color: colors.textSecondary,
  },
});
