import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { Container, Button, Card, Input } from "@/components/ui";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors, spacing, typography, borderRadius, shadows } from "@/constants/design";
import { db, Save } from "@/lib/db";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/use-auth";

export default function CareerSavesScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: Save["mode"] }>();
  const { user } = useAuth();
  const [saves, setSaves] = useState<Save[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newSaveName, setNewSaveName] = useState("");

  useEffect(() => {
    loadSaves();
  }, [user]);

  const loadSaves = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const allSaves = await db.saves.list(user.id);
      // If mode is specified, filter by mode. Otherwise show all.
      const filteredSaves = mode ? allSaves.filter((s) => s.mode === mode) : allSaves;
      setSaves(filteredSaves);
    } catch (error) {
      console.error("Error loading saves:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSave = async () => {
    if (!user || !newSaveName.trim()) return;
    
    setCreating(true);
    try {
      const newSave = await db.saves.create({
        userId: user.id,
        name: newSaveName,
        mode: mode || "manager",
        seasonYear: 2025,
        currentWeek: 1,
      });
      
      router.push(`/modes/${newSave.mode}?id=${newSave.id}` as any);
    } catch (error) {
      Alert.alert("Error", "Failed to create save game");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSave = async (id: string) => {
    Alert.alert(
      "Delete Save",
      "Are you sure you want to delete this career? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            await db.saves.delete(id);
            loadSaves();
          }
        }
      ]
    );
  };

  if (!user) {
    return (
      <Container safeArea style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.message}>Please sign in to manage your careers</Text>
          <Button variant="primary" onPress={() => router.replace("/")}>Back to Menu</Button>
        </View>
      </Container>
    );
  }

  return (
    <Container safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {mode ? `${mode.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Saves` : 'All Careers'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          <View style={styles.savesList}>
            {saves.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="football-outline" size={64} color={colors.textTertiary} />
                <Text style={styles.emptyText}>No saved careers found</Text>
              </View>
            ) : (
              saves.map((save) => (
                <Card key={save.id} style={styles.saveCard} onPress={() => router.push(`/modes/${save.mode}?id=${save.id}` as any)}>
                  <Card.Content>
                    <View style={styles.saveHeader}>
                      <View>
                        <Text style={styles.saveName}>{save.name}</Text>
                        <Text style={styles.saveDetails}>
                          {save.clubId ? 'Managing Club' : 'No Club Selected'} • Season {save.seasonYear}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => handleDeleteSave(save.id)}>
                        <Ionicons name="trash-outline" size={20} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </View>
        )}

        <View style={styles.createSection}>
          <Text style={styles.sectionTitle}>Start New Career</Text>
          <Input
            placeholder="Career Name (e.g. My Road to Glory)"
            value={newSaveName}
            onChangeText={setNewSaveName}
            style={styles.input}
          />
          <Button 
            variant="primary" 
            onPress={handleCreateSave} 
            loading={creating}
            disabled={!newSaveName.trim()}
          >
            Create New {mode ? mode.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Career'}
          </Button>
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
  loader: {
    marginTop: spacing.xxl,
  },
  savesList: {
    marginBottom: spacing.xxl,
  },
  saveCard: {
    marginBottom: spacing.md,
  },
  saveHeader: {
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
  },
  saveName: {
    ...typography.h4,
    color: colors.text,
  },
  saveDetails: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  createSection: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});