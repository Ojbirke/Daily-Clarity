import { Platform } from "react-native";
import {
  getTodayEntry,
  getAllEntries,
  calculateStreak,
  getTodayDateString,
} from "@/storage/localStorage";

// Must match the App Group in app.json and targets/widget/expo-target.config.js.
const APP_GROUP = "group.com.dailyclarity.app";

// @bacons/apple-targets ships a native module that only exists in a dev/prod
// build on iOS. Guard so Expo Go and web don't crash on the missing module.
let ExtensionStorage: any = null;
if (Platform.OS === "ios") {
  try {
    ExtensionStorage = require("@bacons/apple-targets").ExtensionStorage;
  } catch {
    ExtensionStorage = null;
  }
}

/**
 * Mirrors today's check-in state into the shared App Group so the home/lock
 * screen widget can render it, then asks WidgetKit to reload. Best-effort:
 * never throws, and is a no-op on web / Android / Expo Go.
 */
export async function syncWidget(): Promise<void> {
  if (!ExtensionStorage) return;
  try {
    const storage = new ExtensionStorage(APP_GROUP);
    const entry = await getTodayEntry();
    const streak = calculateStreak(await getAllEntries());

    storage.set("todayDate", getTodayDateString());
    storage.set("todayChoice", entry?.choice ?? "");
    storage.set("streak", streak);

    ExtensionStorage.reloadWidget();
  } catch {
    // Widget updates are best-effort — never block the app on them.
  }
}
