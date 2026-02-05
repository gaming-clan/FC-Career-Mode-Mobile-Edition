import { View, Text, ScrollView } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface Standing {
  position: number;
  clubName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  isUserClub?: boolean;
}

interface LeagueTableProps {
  standings: Standing[];
}

export function LeagueTable({ standings }: LeagueTableProps) {
  const colors = useColors();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="gap-2">
        <View className="flex-row gap-2 px-2 py-2 bg-surface rounded-lg border border-border">
          <Text className="w-8 text-xs font-bold text-foreground">Pos</Text>
          <Text className="w-24 text-xs font-bold text-foreground">Club</Text>
          <Text className="w-8 text-xs font-bold text-foreground">P</Text>
          <Text className="w-8 text-xs font-bold text-foreground">W</Text>
          <Text className="w-8 text-xs font-bold text-foreground">D</Text>
          <Text className="w-8 text-xs font-bold text-foreground">L</Text>
          <Text className="w-8 text-xs font-bold text-foreground">GF</Text>
          <Text className="w-8 text-xs font-bold text-foreground">GA</Text>
          <Text className="w-8 text-xs font-bold text-foreground">Pts</Text>
        </View>

        {standings.map((standing, index) => {
          let bgColor = colors.surface;
          if (standing.position <= 4) {
            bgColor = colors.success;
          } else if (standing.position <= 6) {
            bgColor = colors.warning;
          } else if (standing.position >= standings.length - 2) {
            bgColor = colors.error;
          }

          return (
            <View
              key={standing.position}
              className="flex-row gap-2 px-2 py-2 rounded-lg border border-border"
              style={{
                backgroundColor: standing.isUserClub ? colors.primary : bgColor,
              }}
            >
              <Text
                className="w-8 text-xs font-semibold text-foreground"
                style={{
                  color: standing.isUserClub ? colors.background : colors.foreground,
                }}
              >
                {standing.position}
              </Text>
              <Text
                className="w-24 text-xs font-semibold text-foreground truncate"
                style={{
                  color: standing.isUserClub ? colors.background : colors.foreground,
                }}
              >
                {standing.clubName}
              </Text>
              <Text
                className="w-8 text-xs text-foreground"
                style={{
                  color: standing.isUserClub ? colors.background : colors.foreground,
                }}
              >
                {standing.played}
              </Text>
              <Text
                className="w-8 text-xs text-foreground"
                style={{
                  color: standing.isUserClub ? colors.background : colors.foreground,
                }}
              >
                {standing.wins}
              </Text>
              <Text
                className="w-8 text-xs text-foreground"
                style={{
                  color: standing.isUserClub ? colors.background : colors.foreground,
                }}
              >
                {standing.draws}
              </Text>
              <Text
                className="w-8 text-xs text-foreground"
                style={{
                  color: standing.isUserClub ? colors.background : colors.foreground,
                }}
              >
                {standing.losses}
              </Text>
              <Text
                className="w-8 text-xs text-foreground"
                style={{
                  color: standing.isUserClub ? colors.background : colors.foreground,
                }}
              >
                {standing.goalsFor}
              </Text>
              <Text
                className="w-8 text-xs text-foreground"
                style={{
                  color: standing.isUserClub ? colors.background : colors.foreground,
                }}
              >
                {standing.goalsAgainst}
              </Text>
              <Text
                className="w-8 text-xs font-bold text-foreground"
                style={{
                  color: standing.isUserClub ? colors.background : colors.foreground,
                }}
              >
                {standing.points}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
