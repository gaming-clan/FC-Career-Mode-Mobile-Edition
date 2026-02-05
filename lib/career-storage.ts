import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CareerSave {
  id: string;
  name: string;
  mode: "manager" | "player" | "sporting_director" | "create_a_club";
  clubName: string;
  seasonYear: number;
  currentWeek: number;
  managerName?: string;
  playerName?: string;
  createdAt: string;
  lastPlayedAt: string;
  gameData: Record<string, any>;
}

const STORAGE_KEY = "football_career_saves";

export async function getAllSaves(): Promise<CareerSave[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading saves:", error);
    return [];
  }
}

export async function getSaveById(id: string): Promise<CareerSave | null> {
  try {
    const saves = await getAllSaves();
    return saves.find((s) => s.id === id) || null;
  } catch (error) {
    console.error("Error getting save:", error);
    return null;
  }
}

export async function createSave(save: Omit<CareerSave, "id" | "createdAt" | "lastPlayedAt">): Promise<CareerSave> {
  try {
    const newSave: CareerSave = {
      ...save,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastPlayedAt: new Date().toISOString(),
    };

    const saves = await getAllSaves();
    saves.push(newSave);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saves));

    return newSave;
  } catch (error) {
    console.error("Error creating save:", error);
    throw error;
  }
}

export async function updateSave(id: string, updates: Partial<CareerSave>): Promise<CareerSave | null> {
  try {
    const saves = await getAllSaves();
    const index = saves.findIndex((s) => s.id === id);

    if (index === -1) return null;

    saves[index] = {
      ...saves[index],
      ...updates,
      lastPlayedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
    return saves[index];
  } catch (error) {
    console.error("Error updating save:", error);
    return null;
  }
}

export async function deleteSave(id: string): Promise<boolean> {
  try {
    const saves = await getAllSaves();
    const filtered = saves.filter((s) => s.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error deleting save:", error);
    return false;
  }
}

export async function duplicateSave(id: string): Promise<CareerSave | null> {
  try {
    const save = await getSaveById(id);
    if (!save) return null;

    const newSave: CareerSave = {
      ...save,
      id: Date.now().toString(),
      name: `${save.name} (Copy)`,
      createdAt: new Date().toISOString(),
      lastPlayedAt: new Date().toISOString(),
    };

    const saves = await getAllSaves();
    saves.push(newSave);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saves));

    return newSave;
  } catch (error) {
    console.error("Error duplicating save:", error);
    return null;
  }
}

export async function exportSave(id: string): Promise<string | null> {
  try {
    const save = await getSaveById(id);
    return save ? JSON.stringify(save, null, 2) : null;
  } catch (error) {
    console.error("Error exporting save:", error);
    return null;
  }
}

export async function importSave(jsonData: string): Promise<CareerSave | null> {
  try {
    const save = JSON.parse(jsonData) as Omit<CareerSave, "id" | "createdAt" | "lastPlayedAt">;
    return createSave(save);
  } catch (error) {
    console.error("Error importing save:", error);
    return null;
  }
}

export async function autoSave(id: string, gameData: Record<string, any>): Promise<CareerSave | null> {
  return updateSave(id, { gameData });
}
