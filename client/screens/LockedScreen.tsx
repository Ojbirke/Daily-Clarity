import React, { useEffect, useState, useRef, useCallback } from "react";
import { StyleSheet, View, Pressable, AppState, AppStateStatus } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  FadeIn,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";
import { getTodayEntry, DailyEntry, hasCompletedToday, savePalette, getSavedPalette } from "@/storage/localStorage";
import { RootStackParamList } from "@/types/navigation";

type LockedScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Locked">;
};

const CHOICE_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  Focus: "target",
  Calm: "feather",
  Energy: "zap",
};

type MoodPalette = {
  background: string;
  iconBg: string;
  text: string;
  textSecondary: string;
  accent: string;
  buttonBg: string;
};

const MOOD_PALETTES: Record<string, MoodPalette[]> = {
  Focus: [
    { background: "#EDE9FE", iconBg: "#DDD6FE", text: "#4C1D95", textSecondary: "#6D28D9", accent: "#7C3AED", buttonBg: "#DDD6FE" },
    { background: "#E0E7FF", iconBg: "#C7D2FE", text: "#312E81", textSecondary: "#4338CA", accent: "#6366F1", buttonBg: "#C7D2FE" },
    { background: "#EEF2FF", iconBg: "#E0E7FF", text: "#1E1B4B", textSecondary: "#3730A3", accent: "#4F46E5", buttonBg: "#E0E7FF" },
    { background: "#F5F3FF", iconBg: "#EDE9FE", text: "#2E1065", textSecondary: "#5B21B6", accent: "#8B5CF6", buttonBg: "#EDE9FE" },
    { background: "#FAF5FF", iconBg: "#F3E8FF", text: "#3B0764", textSecondary: "#7E22CE", accent: "#A855F7", buttonBg: "#F3E8FF" },
    { background: "#DBEAFE", iconBg: "#BFDBFE", text: "#1E3A5F", textSecondary: "#1D4ED8", accent: "#3B82F6", buttonBg: "#BFDBFE" },
    { background: "#E8DAEF", iconBg: "#D2B4DE", text: "#4A235A", textSecondary: "#6C3483", accent: "#884EA0", buttonBg: "#D2B4DE" },
    { background: "#D6EAF8", iconBg: "#AED6F1", text: "#1B4F72", textSecondary: "#2471A3", accent: "#2E86C1", buttonBg: "#AED6F1" },
    { background: "#E8EAF6", iconBg: "#C5CAE9", text: "#1A237E", textSecondary: "#283593", accent: "#3949AB", buttonBg: "#C5CAE9" },
    { background: "#F3E5F5", iconBg: "#E1BEE7", text: "#4A148C", textSecondary: "#6A1B9A", accent: "#8E24AA", buttonBg: "#E1BEE7" },
  ],
  Calm: [
    { background: "#ECFDF5", iconBg: "#D1FAE5", text: "#064E3B", textSecondary: "#047857", accent: "#10B981", buttonBg: "#D1FAE5" },
    { background: "#F0FDF4", iconBg: "#DCFCE7", text: "#14532D", textSecondary: "#15803D", accent: "#22C55E", buttonBg: "#DCFCE7" },
    { background: "#F0FDFA", iconBg: "#CCFBF1", text: "#134E4A", textSecondary: "#0F766E", accent: "#14B8A6", buttonBg: "#CCFBF1" },
    { background: "#ECFEFF", iconBg: "#CFFAFE", text: "#164E63", textSecondary: "#0E7490", accent: "#06B6D4", buttonBg: "#CFFAFE" },
    { background: "#F0F9FF", iconBg: "#E0F2FE", text: "#0C4A6E", textSecondary: "#0369A1", accent: "#0EA5E9", buttonBg: "#E0F2FE" },
    { background: "#E8F5E9", iconBg: "#C8E6C9", text: "#1B5E20", textSecondary: "#2E7D32", accent: "#43A047", buttonBg: "#C8E6C9" },
    { background: "#E0F2F1", iconBg: "#B2DFDB", text: "#004D40", textSecondary: "#00695C", accent: "#00897B", buttonBg: "#B2DFDB" },
    { background: "#E0F7FA", iconBg: "#B2EBF2", text: "#006064", textSecondary: "#00838F", accent: "#00ACC1", buttonBg: "#B2EBF2" },
    { background: "#F1F8E9", iconBg: "#DCEDC8", text: "#33691E", textSecondary: "#558B2F", accent: "#7CB342", buttonBg: "#DCEDC8" },
    { background: "#E8F8F5", iconBg: "#D1F2EB", text: "#0E6655", textSecondary: "#117A65", accent: "#1ABC9C", buttonBg: "#D1F2EB" },
  ],
  Energy: [
    { background: "#FFF7ED", iconBg: "#FFEDD5", text: "#7C2D12", textSecondary: "#C2410C", accent: "#F97316", buttonBg: "#FFEDD5" },
    { background: "#FEF2F2", iconBg: "#FEE2E2", text: "#7F1D1D", textSecondary: "#B91C1C", accent: "#EF4444", buttonBg: "#FEE2E2" },
    { background: "#FFFBEB", iconBg: "#FEF3C7", text: "#78350F", textSecondary: "#B45309", accent: "#F59E0B", buttonBg: "#FEF3C7" },
    { background: "#FDF2F8", iconBg: "#FCE7F3", text: "#831843", textSecondary: "#BE185D", accent: "#EC4899", buttonBg: "#FCE7F3" },
    { background: "#FFF1F2", iconBg: "#FFE4E6", text: "#881337", textSecondary: "#BE123C", accent: "#F43F5E", buttonBg: "#FFE4E6" },
    { background: "#FEF9C3", iconBg: "#FEF08A", text: "#713F12", textSecondary: "#A16207", accent: "#EAB308", buttonBg: "#FEF08A" },
    { background: "#FCE4EC", iconBg: "#F8BBD0", text: "#880E4F", textSecondary: "#AD1457", accent: "#D81B60", buttonBg: "#F8BBD0" },
    { background: "#FBE9E7", iconBg: "#FFCCBC", text: "#BF360C", textSecondary: "#D84315", accent: "#F4511E", buttonBg: "#FFCCBC" },
    { background: "#FFF3E0", iconBg: "#FFE0B2", text: "#E65100", textSecondary: "#EF6C00", accent: "#FB8C00", buttonBg: "#FFE0B2" },
    { background: "#FFEBEE", iconBg: "#FFCDD2", text: "#B71C1C", textSecondary: "#C62828", accent: "#E53935", buttonBg: "#FFCDD2" },
  ],
};

function getRandomPalette(choice: string): MoodPalette {
  const palettes = MOOD_PALETTES[choice];
  if (!palettes) return MOOD_PALETTES.Focus[0];
  return palettes[Math.floor(Math.random() * palettes.length)];
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function LockedScreen({ navigation }: LockedScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const buttonScale = useSharedValue(1);
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null);
  const [moodActive, setMoodActive] = useState(false);
  const [currentPalette, setCurrentPalette] = useState<MoodPalette | null>(null);
  const appState = useRef(AppState.currentState);
  const isTapping = useRef(false);

  const iconBounce = useSharedValue(0);
  const fadeProgress = useSharedValue(0);

  useEffect(() => {
    const loadData = async () => {
      const entry = await getTodayEntry();
      setTodayEntry(entry);

      const saved = await getSavedPalette();
      if (saved) {
        setCurrentPalette(saved.palette as MoodPalette);
        setMoodActive(true);
        fadeProgress.value = 1;
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (todayEntry) {
      iconBounce.value = withDelay(
        800,
        withRepeat(
          withSequence(
            withTiming(-8, { duration: 300, easing: Easing.out(Easing.quad) }),
            withTiming(0, { duration: 400, easing: Easing.bounce }),
            withTiming(0, { duration: 2000 }),
          ),
          -1,
          false,
        ),
      );
    }

    return () => {
      cancelAnimation(iconBounce);
    };
  }, [todayEntry]);

  const handleIconTap = useCallback(() => {
    if (!todayEntry || isTapping.current) return;

    isTapping.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const palette = getRandomPalette(todayEntry.choice);

    cancelAnimation(fadeProgress);

    fadeProgress.value = 0;
    setCurrentPalette(palette);
    setMoodActive(true);
    savePalette(palette);

    fadeProgress.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) });

    cancelAnimation(iconBounce);
    iconBounce.value = withSequence(
      withTiming(-14, { duration: 200, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 500, easing: Easing.bounce }),
      withDelay(
        500,
        withRepeat(
          withSequence(
            withTiming(-8, { duration: 300, easing: Easing.out(Easing.quad) }),
            withTiming(0, { duration: 400, easing: Easing.bounce }),
            withTiming(0, { duration: 2000 }),
          ),
          -1,
          false,
        ),
      ),
    );

    setTimeout(() => {
      isTapping.current = false;
    }, 400);
  }, [todayEntry]);

  useEffect(() => {
    const checkNewDay = async (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        const completed = await hasCompletedToday();
        if (!completed) {
          navigation.replace("Question");
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener("change", checkNewDay);
    return () => {
      subscription.remove();
    };
  }, [navigation]);

  const iconBounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: iconBounce.value }],
  }));

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeProgress.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const handleViewPatterns = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Patterns");
  };

  const choiceIcon = todayEntry
    ? CHOICE_ICONS[todayEntry.choice] || "check"
    : "lock";

  const p = currentPalette;
  const iconColor = moodActive && p ? p.accent : theme.text;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundRoot,
          paddingTop: insets.top + Spacing["6xl"],
          paddingBottom: insets.bottom + Spacing["6xl"],
        },
      ]}
    >
      {moodActive && p ? (
        <Animated.View
          key={p.background}
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: p.background },
            fadeStyle,
          ]}
          pointerEvents="none"
        />
      ) : null}

      <View style={styles.content}>
        <Animated.View entering={FadeIn.duration(400).delay(100)}>
          <Pressable onPress={handleIconTap} testID="button-mood-toggle">
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: moodActive && p ? p.iconBg : theme.backgroundDefault,
                },
                iconBounceStyle,
              ]}
            >
              <Feather name={choiceIcon} size={48} color={iconColor} />
            </Animated.View>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(200)}>
          {todayEntry ? (
            <>
              <ThemedText
                style={[
                  styles.intentionLabel,
                  { color: moodActive && p ? p.textSecondary : theme.textSecondary },
                ]}
              >
                TODAY'S INTENTION
              </ThemedText>
              <ThemedText
                style={[
                  styles.focusLabel,
                  { color: moodActive && p ? p.text : theme.text },
                ]}
              >
                {todayEntry.choice}
              </ThemedText>
              {todayEntry.note ? (
                <View
                  style={[
                    styles.noteContainer,
                    {
                      backgroundColor: moodActive && p ? p.iconBg : theme.backgroundDefault,
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.noteText,
                      { color: moodActive && p ? p.textSecondary : theme.textSecondary },
                    ]}
                  >
                    "{todayEntry.note}"
                  </ThemedText>
                </View>
              ) : null}
            </>
          ) : (
            <ThemedText style={[styles.heading, { color: theme.text }]}>
              You've already checked in today.
            </ThemedText>
          )}
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeIn.duration(400).delay(400)}
        style={styles.buttonContainer}
      >
        <AnimatedPressable
          onPress={handleViewPatterns}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[
            styles.button,
            {
              backgroundColor: moodActive && p ? p.buttonBg : theme.backgroundDefault,
            },
            buttonAnimatedStyle,
          ]}
          testID="button-patterns"
        >
          <ThemedText
            style={[
              styles.buttonText,
              { color: moodActive && p ? p.text : theme.text },
            ]}
          >
            View Patterns
          </ThemedText>
        </AnimatedPressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing["2xl"],
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing["3xl"],
  },
  intentionLabel: {
    ...Typography.label,
    textAlign: "center",
    marginBottom: Spacing.sm,
    letterSpacing: 2,
  },
  heading: {
    ...Typography.h4,
    textAlign: "center",
  },
  focusLabel: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  noteContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.none,
    maxWidth: 300,
  },
  noteText: {
    ...Typography.body,
    textAlign: "center",
    fontStyle: "italic",
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    width: "100%",
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.none,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    ...Typography.button,
  },
});
