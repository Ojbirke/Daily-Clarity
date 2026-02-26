import AsyncStorage from "@react-native-async-storage/async-storage";

const ENTRIES_KEY = "@daily_clarity_entries";

export type ClarityChoice = "Focus" | "Calm" | "Energy";

export interface DailyEntry {
  date: string;
  choice: ClarityChoice;
  note: string;
  createdAt: string;
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getAllEntries(): Promise<DailyEntry[]> {
  try {
    const json = await AsyncStorage.getItem(ENTRIES_KEY);
    if (json) {
      return JSON.parse(json);
    }
    return [];
  } catch {
    return [];
  }
}

export async function getEntryForDate(
  date: string
): Promise<DailyEntry | null> {
  const entries = await getAllEntries();
  return entries.find((entry) => entry.date === date) || null;
}

export async function getTodayEntry(): Promise<DailyEntry | null> {
  const today = getTodayDateString();
  return getEntryForDate(today);
}

export async function hasCompletedToday(): Promise<boolean> {
  const entry = await getTodayEntry();
  return entry !== null;
}

export async function saveEntry(
  choice: ClarityChoice,
  note: string
): Promise<DailyEntry> {
  const entries = await getAllEntries();
  const today = getTodayDateString();

  const existingIndex = entries.findIndex((e) => e.date === today);
  const newEntry: DailyEntry = {
    date: today,
    choice,
    note,
    createdAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    entries[existingIndex] = newEntry;
  } else {
    entries.unshift(newEntry);
  }

  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  return newEntry;
}

export async function clearAllEntries(): Promise<void> {
  await AsyncStorage.removeItem(ENTRIES_KEY);
}

const PALETTE_KEY = "@daily_clarity_palette";

export interface SavedPalette {
  date: string;
  palette: {
    background: string;
    iconBg: string;
    text: string;
    textSecondary: string;
    accent: string;
    buttonBg: string;
  };
}

export async function savePalette(palette: SavedPalette["palette"]): Promise<void> {
  const data: SavedPalette = {
    date: getTodayDateString(),
    palette,
  };
  await AsyncStorage.setItem(PALETTE_KEY, JSON.stringify(data));
}

export async function getSavedPalette(): Promise<SavedPalette | null> {
  try {
    const json = await AsyncStorage.getItem(PALETTE_KEY);
    if (json) {
      const data: SavedPalette = JSON.parse(json);
      if (data.date === getTodayDateString()) {
        return data;
      }
    }
    return null;
  } catch {
    return null;
  }
}
