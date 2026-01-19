import AsyncStorage from "@react-native-async-storage/async-storage";

const ENTRIES_KEY = "@daily_clarity_entries";

export interface DailyEntry {
  date: string;
  question: string;
  response: string;
  createdAt: string;
}

const REFLECTION_QUESTIONS = [
  "What moment today made you feel most alive?",
  "What challenged you today, and what did you learn from it?",
  "What are you grateful for right now?",
  "What would you do differently if you could relive today?",
  "What emotion did you feel most strongly today?",
  "What small victory can you celebrate from today?",
  "What did you learn about yourself today?",
  "What kindness did you give or receive today?",
  "What's one thing you're looking forward to tomorrow?",
  "How did you take care of yourself today?",
  "What conversation or interaction stood out to you today?",
  "What would make tomorrow even better than today?",
  "What's weighing on your mind right now?",
  "What brought you peace today?",
  "What's one thing you wish you had said today?",
];

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

export function getQuestionForDate(date: string): string {
  const dayOfYear = getDayOfYear(new Date(date));
  const index = dayOfYear % REFLECTION_QUESTIONS.length;
  return REFLECTION_QUESTIONS[index];
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
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

export async function hasCompletedToday(): Promise<boolean> {
  const today = getTodayDateString();
  const entry = await getEntryForDate(today);
  return entry !== null;
}

export async function saveEntry(
  question: string,
  response: string
): Promise<DailyEntry> {
  const entries = await getAllEntries();
  const today = getTodayDateString();

  const existingIndex = entries.findIndex((e) => e.date === today);
  const newEntry: DailyEntry = {
    date: today,
    question,
    response,
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

export function getTimeUntilMidnight(): { hours: number; minutes: number } {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);

  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes };
}

export function formatCountdown(hours: number, minutes: number): string {
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
