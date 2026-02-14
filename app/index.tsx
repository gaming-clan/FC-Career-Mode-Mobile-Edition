import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Button, Container } from '@/components/ui';
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const router = useRouter();

  const gameModes = [
    {
      id: 'manager',
      title: 'Manager Career',
      description: 'Manage every aspect of your favorite club.',
      icon: '👔',
      route: '/modes/career-saves?mode=manager',
      color: colors.primary,
    },
    {
      id: 'player',
      title: 'Player Career',
      description: 'Rise from a wonderkid to a global legend.',
      icon: '⚽',
      route: '/modes/career-saves?mode=player',
      color: colors.accent,
    },
    {
      id: 'director',
      title: 'Sporting Director',
      description: 'Define the vision and build a footballing empire.',
      icon: '📋',
      route: '/modes/career-saves?mode=sporting_director',
      color: '#6366F1', // Indigo
    },
    {
      id: 'club',
      title: 'Create-a-Club',
      description: 'Build your own legacy from the ground up.',
      icon: '🏟️',
      route: '/modes/create_a_club',
      color: '#EC4899', // Pink
    },
  ];

  return (
    <Container safeArea style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>FC CAREER</Text>
          <Text style={styles.subtitle}>MANAGER MOBILE</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>SEASON 2025/26</Text>
          </View>
        </View>

        <View style={styles.modesGrid}>
          {gameModes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[styles.modeCard, { borderLeftColor: mode.color }]}
              onPress={() => router.push(mode.route as any)}
              activeOpacity={0.7}
            >
              <View style={styles.modeIconContainer}>
                <Text style={styles.modeIcon}>{mode.icon}</Text>
              </View>
              <View style={styles.modeContent}>
                <Text style={styles.modeTitle}>{mode.title}</Text>
                <Text style={styles.modeDescription}>{mode.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/modes/career-saves' as any)}>
            <Ionicons name="folder-open-outline" size={20} color={colors.text} style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Load Saved Career</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Ionicons name="settings-outline" size={20} color={colors.text} style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Settings</Text>
          </TouchableOpacity>
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
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.display,
    color: colors.primary,
    fontWeight: '900',
    letterSpacing: 2,
  },
  subtitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '600',
    marginTop: -spacing.xs,
    letterSpacing: 4,
  },
  versionBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
  },
  versionText: {
    ...typography.tiny,
    color: colors.backgroundDark,
    fontWeight: 'bold',
  },
  modesGrid: {
    gap: spacing.md,
  },
  modeCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 6,
    ...shadows.sm,
  },
  modeIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  modeIcon: {
    fontSize: 24,
  },
  modeContent: {
    flex: 1,
  },
  modeTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: 2,
  },
  modeDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  footer: {
    marginTop: spacing.xxxl,
    gap: spacing.sm,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },
  secondaryButtonText: {
    ...typography.bodyBold,
    color: colors.text,
  },
});
