import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator, StyleSheet, Animated } from "react-native";
import { Container, Button, Card } from "@/components/ui";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors, spacing, typography, borderRadius, shadows } from "@/constants/design";
import { db, Club, Player } from "@/lib/db";
import { simulateMatch, MatchResult, MatchEvent } from "@/lib/game-simulation";
import { Ionicons } from "@expo/vector-icons";

export default function MatchSimulationScreen() {
  const router = useRouter();
  const { saveId, opponentId } = useLocalSearchParams<{ saveId: string; opponentId: string }>();
  const [homeClub, setHomeClub] = useState<Club | null>(null);
  const [awayClub, setAwayClub] = useState<Club | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [simulating, setSimulating] = useState(true);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [visibleEvents, setVisibleEvents] = useState<MatchEvent[]>([]);

  useEffect(() => {
    if (saveId && opponentId) {
      runSimulation();
    }
  }, [saveId, opponentId]);

  const runSimulation = async () => {
    try {
      const save = await db.saves.get(saveId!);
      if (!save?.clubId) return;

      const myClub = await db.clubs.get(save.clubId);
      const theirClub = await db.clubs.get(opponentId!);
      
      if (!myClub || !theirClub) return;

      setHomeClub(myClub);
      setAwayClub(theirClub);

      const mySquad = await db.players.listByClub(myClub.id);
      const theirSquad = await db.players.listByClub(theirClub.id);

      const matchResult = simulateMatch(myClub, theirClub, mySquad, theirSquad);
      setResult(matchResult);

      // Start minute-by-minute simulation
      startMatchClock(matchResult);
    } catch (error) {
      console.error("Error in simulation:", error);
    }
  };

  const startMatchClock = (matchResult: MatchResult) => {
    let min = 0;
    const interval = setInterval(() => {
      min += 1;
      setCurrentMinute(min);

      // Check for events in this minute
      const newEvents = matchResult.events.filter(e => e.minute === min);
      if (newEvents.length > 0) {
        setVisibleEvents(prev => [...newEvents, ...prev]);
      }

      if (min >= 90) {
        clearInterval(interval);
        setSimulating(false);
      }
    }, 100); // 100ms per minute for fast simulation
  };

  if (!homeClub || !awayClub) {
    return (
      <Container safeArea style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </Container>
    );
  }

  const getScore = (clubId: string) => {
    if (!result) return 0;
    const events = result.events.filter(e => e.type === "goal" && e.minute <= currentMinute);
    // This is a bit simplified, ideally we'd track which club scored
    // For now, let's just count all goals and show the final result when done
    return 0; // Placeholder for live score
  };

  return (
    <Container safeArea style={styles.container}>
      <View style={styles.scoreboard}>
        <View style={styles.teamContainer}>
          <View style={[styles.teamColor, { backgroundColor: homeClub.primaryColor }]} />
          <Text style={styles.teamName}>{homeClub.shortName}</Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {result && !simulating ? result.homeGoals : '?'} - {result && !simulating ? result.awayGoals : '?'}
          </Text>
          <View style={styles.minuteBadge}>
            <Text style={styles.minuteText}>{currentMinute}'</Text>
          </View>
        </View>

        <View style={styles.teamContainer}>
          <Text style={styles.teamName}>{awayClub.shortName}</Text>
          <View style={[styles.teamColor, { backgroundColor: awayClub.primaryColor }]} />
        </View>
      </View>

      <View style={styles.pitch}>
        <View style={styles.pitchLines} />
        <View style={styles.centerCircle} />
      </View>

      <View style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>Match Commentary</Text>
        <ScrollView contentContainerStyle={styles.eventsScroll}>
          {visibleEvents.map((event, idx) => (
            <View key={idx} style={styles.eventRow}>
              <Text style={styles.eventMinute}>{event.minute}'</Text>
              <View style={styles.eventBadge}>
                <Ionicons 
                  name={event.type === "goal" ? "football" : "alert-circle"} 
                  size={16} 
                  color={event.type === "goal" ? colors.success : colors.warning} 
                />
              </View>
              <Text style={styles.eventDesc}>{event.description}</Text>
            </View>
          ))}
          {currentMinute === 0 && <Text style={styles.commentaryPlaceholder}>Kicking off soon...</Text>}
        </ScrollView>
      </View>

      {!simulating && (
        <View style={styles.footer}>
          <Button variant="primary" onPress={() => router.replace(`/modes/manager?id=${saveId}`)}>
            Continue to Post-Match
          </Button>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  scoreboard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.xl,
    backgroundColor: colors.backgroundDarkSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDarkMode,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  teamColor: {
    width: 8,
    height: 32,
    borderRadius: borderRadius.sm,
  },
  teamName: {
    ...typography.h3,
    color: colors.white,
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
    ...typography.display,
    color: colors.white,
    fontSize: 40,
  },
  minuteBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  minuteText: {
    ...typography.tiny,
    color: colors.white,
    fontWeight: 'bold',
  },
  pitch: {
    height: 120,
    backgroundColor: colors.primaryDark,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  pitchLines: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  centerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  eventsContainer: {
    flex: 1,
    padding: spacing.md,
  },
  eventsTitle: {
    ...typography.captionBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  eventsScroll: {
    gap: spacing.sm,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDarkTertiary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  eventMinute: {
    ...typography.captionBold,
    color: colors.primaryLight,
    width: 30,
  },
  eventBadge: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDesc: {
    ...typography.caption,
    color: colors.textDark,
    flex: 1,
  },
  commentaryPlaceholder: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderDarkMode,
  },
});
