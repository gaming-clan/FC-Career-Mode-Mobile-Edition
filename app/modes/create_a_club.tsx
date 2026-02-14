import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput } from "react-native";
import { Container, Button, Card, Input } from "@/components/ui";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors, spacing, typography, borderRadius, shadows } from "@/constants/design";
import { db, Save, Club } from "@/lib/db";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/use-auth";

export default function CreateAClubModeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [clubName, setClubName] = useState("");
  const [shortName, setShortName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#059669");
  const [secondaryColor, setSecondaryColor] = useState("#FFFFFF");
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [leagues, setLeagues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadLeagues();
  }, []);

  const loadLeagues = async () => {
    setLoading(true);
    try {
      const allLeagues = await db.leagues.list();
      setLeagues(allLeagues);
      if (allLeagues.length > 0) setSelectedLeagueId(allLeagues[0].id);
    } catch (error) {
      console.error("Error loading leagues:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!user || !clubName || !shortName || !selectedLeagueId) return;

    setCreating(true);
    try {
      // 1. Create the club in DB (Simplified for MVP, ideally we'd have a system to add new clubs to a save)
      // For now, let's just create a save and store club info in gameData
      const newSave = await db.saves.create({
        userId: user.id,
        name: `${clubName} Career`,
        mode: "create_a_club",
        seasonYear: 2025,
        currentWeek: 1,
        gameData: JSON.stringify({
          customClub: {
            name: clubName,
            shortName,
            primaryColor,
            secondaryColor,
            leagueId: selectedLeagueId
          }
        })
      });

      router.replace(`/modes/manager?id=${newSave.id}`);
    } catch (error) {
      console.error("Error creating club:", error);
    } finally {
      setCreating(false);
    }
  };

  const colorOptions = [
    "#059669", "#DC052D", "#004170", "#FFFFFF", "#F6EB61", "#000000", "#6CABDD", "#EF0107"
  ];

  return (
    <Container safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Create-a-Club</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step {step} of 3</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Identity</Text>
            <Input
              label="Club Name"
              placeholder="e.g. AFC Richmond"
              value={clubName}
              onChangeText={setClubName}
              style={styles.input}
            />
            <Input
              label="Short Name (3 Letters)"
              placeholder="e.g. RIC"
              value={shortName}
              onChangeText={(text) => setShortName(text.toUpperCase().slice(0, 3))}
              style={styles.input}
            />
            <Button 
              variant="primary" 
              onPress={() => setStep(2)} 
              disabled={!clubName || shortName.length < 3}
            >
              Continue
            </Button>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Branding</Text>
            
            <Text style={styles.label}>Primary Color</Text>
            <View style={styles.colorGrid}>
              {colorOptions.map(color => (
                <TouchableOpacity 
                  key={color} 
                  style={[styles.colorCircle, { backgroundColor: color, borderWidth: primaryColor === color ? 3 : 0, borderColor: colors.accent }]}
                  onPress={() => setPrimaryColor(color)}
                />
              ))}
            </View>

            <Text style={styles.label}>Secondary Color</Text>
            <View style={styles.colorGrid}>
              {colorOptions.map(color => (
                <TouchableOpacity 
                  key={color} 
                  style={[styles.colorCircle, { backgroundColor: color, borderWidth: secondaryColor === color ? 3 : 0, borderColor: colors.accent }]}
                  onPress={() => setSecondaryColor(color)}
                />
              ))}
            </View>

            <View style={styles.previewContainer}>
              <Text style={styles.label}>Kit Preview</Text>
              <View style={[styles.kitPreview, { backgroundColor: primaryColor, borderColor: secondaryColor, borderWidth: 4 }]}>
                <Text style={[styles.previewText, { color: secondaryColor }]}>{shortName}</Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <Button variant="outline" onPress={() => setStep(1)} style={styles.flex1}>Back</Button>
              <Button variant="primary" onPress={() => setStep(3)} style={styles.flex1}>Continue</Button>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>League Selection</Text>
            <Text style={styles.description}>Choose which league your club will join.</Text>
            
            {loading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <View style={styles.leagueGrid}>
                {leagues.map(league => (
                  <TouchableOpacity 
                    key={league.id} 
                    style={[styles.leagueCard, selectedLeagueId === league.id && styles.activeLeagueCard]}
                    onPress={() => setSelectedLeagueId(league.id)}
                  >
                    <Text style={[styles.leagueName, selectedLeagueId === league.id && styles.activeLeagueName]}>{league.name}</Text>
                    <Text style={styles.leagueCountry}>{league.country}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.buttonRow}>
              <Button variant="outline" onPress={() => setStep(2)} style={styles.flex1}>Back</Button>
              <Button 
                variant="primary" 
                onPress={handleCreate} 
                loading={creating}
                style={styles.flex1}
              >
                Start Career
              </Button>
            </View>
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
    flex: 1,
  },
  stepIndicator: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  stepText: {
    ...typography.tiny,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  stepContainer: {
    gap: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
  },
  input: {
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    ...shadows.sm,
  },
  previewContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  kitPreview: {
    width: 120,
    height: 160,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  previewText: {
    ...typography.h1,
    fontWeight: '900',
  },
  leagueGrid: {
    gap: spacing.md,
  },
  leagueCard: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeLeagueCard: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
  },
  leagueName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  activeLeagueName: {
    color: colors.primary,
  },
  leagueCountry: {
    ...typography.tiny,
    color: colors.textSecondary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  flex1: {
    flex: 1,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
