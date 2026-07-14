import AsyncStorage from "@react-native-async-storage/async-storage";

const ENTRIES_KEY = "@daily_clarity_entries";

export type ClarityChoice = "Focus" | "Calm" | "Energy";

export interface DailyEntry {
  date: string;
  choice: ClarityChoice;
  note: string;
  createdAt: string;
}

function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayDateString(): string {
  return formatDateString(new Date());
}

/**
 * Returns the number of consecutive days (ending today) that have an entry.
 * If today has no entry yet, the streak is measured through yesterday so an
 * existing streak stays visible before the user checks in for the day.
 */
export function calculateStreak(entries: DailyEntry[]): number {
  if (entries.length === 0) return 0;

  const dates = new Set(entries.map((entry) => entry.date));
  const cursor = new Date();

  // If today isn't checked in yet, start counting from yesterday.
  if (!dates.has(formatDateString(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (dates.has(formatDateString(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
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
