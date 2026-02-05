import * as React from "react";
import { ScrollView, Text, View, TouchableOpacity, FlatList, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { getAllSaves, deleteSave, duplicateSave, type CareerSave } from "@/lib/career-storage";

export default function CareerSavesScreen() {
  const router = useRouter();
  const colors = useColors();
  const [saves, setSaves] = React.useState<CareerSave[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadSaves();
  }, []);

  const loadSaves = async () => {
    setLoading(true);
    const allSaves = await getAllSaves();
    setSaves(allSaves.sort((a, b) => new Date(b.lastPlayedAt).getTime() - new Date(a.lastPlayedAt).getTime()));
    setLoading(false);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert("Delete Save", `Are you sure you want to delete "${name}"?`, [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: async () => {
          await deleteSave(id);
          await loadSaves();
        },
        style: "destructive",
      },
    ]);
  };

  const handleDuplicate = async (id: string) => {
    await duplicateSave(id);
    await loadSaves();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const renderSaveCard = ({ item }: { item: CareerSave }) => (
    <View className="bg-surface rounded-lg p-4 border border-border mb-3">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">{item.name}</Text>
          <Text className="text-xs text-muted">{item.clubName}</Text>
        </View>
        <View className="bg-primary px-2 py-1 rounded" style={{ backgroundColor: colors.primary }}>
          <Text className="text-xs font-bold text-background capitalize">{item.mode}</Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-3 gap-2">
        <View className="flex-1">
          <Text className="text-xs text-muted">Season</Text>
          <Text className="text-sm font-semibold text-foreground">{item.seasonYear}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-xs text-muted">Week</Text>
          <Text className="text-sm font-semibold text-foreground">{item.currentWeek}/38</Text>
        </View>
        <View className="flex-1">
          <Text className="text-xs text-muted">Last Played</Text>
          <Text className="text-xs font-semibold text-foreground">{formatDate(item.lastPlayedAt).split(" ")[0]}</Text>
        </View>
      </View>

      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => {}}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            backgroundColor: colors.primary,
            flex: 1,
          })}
          className="rounded py-2 items-center"
        >
          <Text className="text-sm font-semibold text-background">Load</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDuplicate(item.id)}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            backgroundColor: colors.surface,
            borderColor: colors.border,
          })}
          className="rounded py-2 items-center border px-3"
        >
          <Text className="text-sm font-semibold text-foreground">Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDelete(item.id, item.name)}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            backgroundColor: colors.error,
          })}
          className="rounded py-2 items-center px-3"
        >
          <Text className="text-sm font-semibold text-background">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-primary px-6 py-6 gap-1" style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base text-background mb-2">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-background">Career Saves</Text>
          <Text className="text-sm text-background opacity-90">Manage your game saves</Text>
        </View>

        <View className="px-4 py-6">
          {loading ? (
            <View className="items-center py-8">
              <Text className="text-muted">Loading saves...</Text>
            </View>
          ) : saves.length > 0 ? (
            <View>
              <Text className="text-sm font-semibold text-foreground mb-3">
                {saves.length} Save{saves.length !== 1 ? "s" : ""}
              </Text>
              <FlatList
                data={saves}
                renderItem={renderSaveCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          ) : (
            <View className="bg-surface rounded-lg p-6 items-center border border-border">
              <Text className="text-muted mb-3">No career saves yet</Text>
              <TouchableOpacity
                onPress={() => router.back()}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: colors.primary,
                })}
                className="rounded-lg px-6 py-2"
              >
                <Text className="text-sm font-semibold text-background">Start New Career</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
