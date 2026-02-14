import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Container, Button, Card } from "@/components/ui";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors, spacing, typography, borderRadius, shadows } from "@/constants/design";
import { db, Club } from "@/lib/db";
import { Ionicons } from "@expo/vector-icons";

export default function ClubSelectionScreen() {
  const router = useRouter();
  const { saveId } = useLocalSearchParams<{ saveId: string }>();
  const [leagues, setLeagues] = useState<any[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const allLeagues = await db.leagues.list();
      setLeagues(allLeagues);
      if (allLeagues.length > 0) {
        setSelectedLeagueId(allLeagues[0].id);
        const leagueClubs = await db.clubs.list(allLeagues[0].id);
        setClubs(leagueClubs);
      }
    } catch (error) {
      console.error("Error loading selection data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeagueSelect = async (leagueId: string) => {
    setSelectedLeagueId(leagueId);
    setLoading(true);
    try {
      const leagueClubs = await db.clubs.list(leagueId);
      setClubs(leagueClubs);
    } catch (error) {
      console.error("Error loading clubs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClubSelect = async (club: Club) => {
    if (!saveId) return;
    try {
      await db.saves.update(saveId, { clubId: club.id });
      router.replace(`/modes/manager?id=${saveId}`);
    } catch (error) {
      console.error("Error selecting club:", error);
    }
  };

  return (
    <Container safeArea style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Club</Text>
        <Text style={styles.subtitle}>Select a club to begin your management career</Text>
      </View>

      <View style={styles.leagueSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.leagueScroll}>
          {leagues.map((league) => (
            <TouchableOpacity
              key={league.id}
              style={[
                styles.leagueTab,
                selectedLeagueId === league.id && styles.activeLeagueTab
              ]}
              onPress={() => handleLeagueSelect(league.id)}
            >
              <Text style={[
                styles.leagueTabText,
                selectedLeagueId === league.id && styles.activeLeagueTabText
              ]}>
                {league.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          <View style={styles.clubsGrid}>
            {clubs.map((club) => (
              <Card key={club.id} style={styles.clubCard} onPress={() => handleClubSelect(club)}>
                <Card.Content>
                  <View style={styles.clubHeader}>
                    <View style={[styles.clubColor, { backgroundColor: club.primaryColor }]} />
                    <View style={styles.clubInfo}>
                      <Text style={styles.clubName}>{club.name}</Text>
                      <Text style={styles.clubStadium}>{club.stadiumName}</Text>
                    </View>
                  </View>
                  <View style={styles.clubStats}>
                    <View style={styles.stat}>
                      <Text style={styles.statLabel}>Budget</Text>
                      <Text style={styles.statValue}>£{(club.budget / 1000000).toFixed(0)}M</Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.statLabel}>Reputation</Text>
                      <Text style={styles.statValue}>{club.reputation}/100</Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  leagueSelector: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leagueScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  leagueTab: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeLeagueTab: {
    borderBottomColor: colors.primary,
  },
  leagueTabText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  activeLeagueTabText: {
    color: colors.primary,
  },
  scrollContent: {
    padding: spacing.md,
  },
  loader: {
    marginTop: spacing.xxl,
  },
  clubsGrid: {
    gap: spacing.md,
  },
  clubCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  clubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  clubColor: {
    width: 12,
    height: 40,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    ...typography.h4,
    color: colors.text,
  },
  clubStadium: {
    ...typography.tiny,
    color: colors.textSecondary,
  },
  clubStats: {
    flexDirection: 'row',
    justifyContent: 'between',
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    ...typography.tiny,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  statValue: {
    ...typography.captionBold,
    color: colors.text,
  },
});
