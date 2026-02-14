import React, { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Container, Button, Card } from "@/components/ui";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors, spacing, typography, borderRadius, shadows } from "@/constants/design";
import { Ionicons } from "@expo/vector-icons";

export default function TacticsScreen() {
  const router = useRouter();
  const [formation, setFormation] = useState("4-3-3 Holding");
  const [style, setStyle] = useState("Balanced");
  const [mentality, setMentality] = useState("Attacking");

  const formations = ["4-3-3 Holding", "4-2-3-1 Wide", "4-4-2 Flat", "3-5-2", "5-3-2"];
  const styles = ["Balanced", "Tiki-Taka", "Gegenpressing", "Counter-Attack", "Park the Bus"];
  const mentalities = ["Ultra Defensive", "Defensive", "Balanced", "Attacking", "Ultra Attacking"];

  return (
    <Container safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Team Tactics</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.sectionCard}>
          <Card.Header>
            <Text style={styles.sectionTitle}>Formation</Text>
          </Card.Header>
          <Card.Content>
            <View style={styles.optionsGrid}>
              {formations.map(f => (
                <TouchableOpacity 
                  key={f} 
                  style={[styles.optionItem, formation === f && styles.activeOption]}
                  onPress={() => setFormation(f)}
                >
                  <Text style={[styles.optionText, formation === f && styles.activeOptionText]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Header>
            <Text style={styles.sectionTitle}>Tactical Style</Text>
          </Card.Header>
          <Card.Content>
            <View style={styles.optionsGrid}>
              {styles.map(s => (
                <TouchableOpacity 
                  key={s} 
                  style={[styles.optionItem, style === s && styles.activeOption]}
                  onPress={() => setStyle(s)}
                >
                  <Text style={[styles.optionText, style === s && styles.activeOptionText]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Header>
            <Text style={styles.sectionTitle}>Mentality</Text>
          </Card.Header>
          <Card.Content>
            <View style={styles.mentalityRow}>
              {mentalities.map(m => (
                <TouchableOpacity 
                  key={m} 
                  style={[styles.mentalityItem, mentality === m && styles.activeMentality]}
                  onPress={() => setMentality(m)}
                >
                  <Text style={[styles.mentalityText, mentality === m && styles.activeMentalityText]}>
                    {m.split(' ')[0][0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.mentalityDesc}>{mentality}</Text>
          </Card.Content>
        </Card>

        <Button variant="primary" style={styles.saveButton} onPress={() => router.back()}>
          Confirm Tactics
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
  scrollContent: {
    padding: spacing.md,
  },
  sectionCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.captionBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    ...typography.caption,
    color: colors.text,
  },
  activeOptionText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  mentalityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  mentalityItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeMentality: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  mentalityText: {
    ...typography.bodyBold,
    color: colors.text,
  },
  activeMentalityText: {
    color: colors.backgroundDark,
  },
  mentalityDesc: {
    ...typography.captionBold,
    color: colors.accent,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
});
