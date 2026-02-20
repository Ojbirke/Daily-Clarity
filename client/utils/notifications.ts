import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { ClarityChoice } from "@/storage/localStorage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const REMINDER_MESSAGES: Record<ClarityChoice, string> = {
  Focus: "Stay with it. Your focus is your power today.",
  Calm: "Breathe. You chose calm for a reason.",
  Energy: "Keep moving. Your energy is carrying you today.",
};

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  if (existingStatus === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleReminderNotification(
  choice: ClarityChoice
): Promise<void> {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    const now = new Date();
    const reminderHour = 14;
    const reminder = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      reminderHour,
      0,
      0
    );

    if (reminder.getTime() <= now.getTime()) {
      reminder.setHours(now.getHours() + 1);
      reminder.setMinutes(0);
    }

    const secondsUntilReminder = Math.max(
      60,
      Math.floor((reminder.getTime() - now.getTime()) / 1000)
    );

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Today: ${choice}`,
        body: REMINDER_MESSAGES[choice],
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilReminder,
      },
    });
  } catch {}
}
