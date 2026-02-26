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
  interpolateColor,
  FadeIn,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";
import { getTodayEntry, DailyEntry, hasCompletedToday } from "@/storage/localStorage";
import { RootStackParamList } from "@/types/navigation";

type LockedScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Locked">;
};

const CHOICE_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  Focus: "target",
  Calm: "feather",
  Energy: "zap",
};

const MOOD_COLORS = {
  Focus: {
    background: "#EDE9FE",
    iconBg: "#DDD6FE",
    text: "#4C1D95",
    textSecondary: "#6D28D9",
    accent: "#7C3AED",
    buttonBg: "#DDD6FE",
  },
  Calm: {
    background: "#ECFDF5",
    iconBg: "#D1FAE5",
    text: "#064E3B",
    textSecondary: "#047857",
    accent: "#10B981",
    buttonBg: "#D1FAE5",
  },
  Energy: {
    background: "#FFF7ED",
    iconBg: "#FFEDD5",
    text: "#7C2D12",
    textSecondary: "#C2410C",
    accent: "#F97316",
    buttonBg: "#FFEDD5",
  },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function LockedScreen({ navigation }: LockedScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const buttonScale = useSharedValue(1);
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null);
  const [moodActive, setMoodActive] = useState(false);
  const appState = useRef(AppState.currentState);

  const iconBounce = useSharedValue(0);
  const colorTransition = useSharedValue(0);

  useEffect(() => {
    const loadTodayEntry = async () => {
      const entry = await getTodayEntry();
      setTodayEntry(entry);
    };
    loadTodayEntry();
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
    if (!todayEntry) return;

    const next = !moodActive;
    setMoodActive(next);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    colorTransition.value = withSpring(next ? 1 : 0, {
      damping: 20,
      stiffness: 80,
    });

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
  }, [todayEntry, moodActive]);

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

  const choice = todayEntry?.choice || "Focus";
  const mood = MOOD_COLORS[choice as keyof typeof MOOD_COLORS] || MOOD_COLORS.Focus;

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorTransition.value,
      [0, 1],
      [theme.backgroundRoot, mood.background],
    );
    return { backgroundColor };
  });

  const iconContainerAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorTransition.value,
      [0, 1],
      [theme.backgroundDefault, mood.iconBg],
    );
    return {
      backgroundColor,
      transform: [{ translateY: iconBounce.value }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      colorTransition.value,
      [0, 1],
      [theme.text, mood.text],
    );
    return { color };
  });

  const secondaryTextAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      colorTransition.value,
      [0, 1],
      [theme.textSecondary, mood.textSecondary],
    );
    return { color };
  });

  const iconColorAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      colorTransition.value,
      [0, 1],
      [theme.text, mood.accent],
    );
    return { color };
  });

  const noteContainerAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorTransition.value,
      [0, 1],
      [theme.backgroundDefault, mood.iconBg],
    );
    return { backgroundColor };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorTransition.value,
      [0, 1],
      [theme.backgroundDefault, mood.buttonBg],
    );
    return {
      backgroundColor,
      transform: [{ scale: buttonScale.value }],
    };
  });

  const buttonTextAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      colorTransition.value,
      [0, 1],
      [theme.text, mood.text],
    );
    return { color };
  });

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

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing["6xl"],
          paddingBottom: insets.bottom + Spacing["6xl"],
        },
        containerAnimatedStyle,
      ]}
    >
      <View style={styles.content}>
        <Animated.View entering={FadeIn.duration(400).delay(100)}>
          <Pressable onPress={handleIconTap} testID="button-mood-toggle">
            <Animated.View
              style={[styles.iconContainer, iconContainerAnimatedStyle]}
            >
              <AnimatedFeatherIcon
                name={choiceIcon}
                size={48}
                colorStyle={iconColorAnimatedStyle}
              />
            </Animated.View>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(200)}>
          {todayEntry ? (
            <>
              <Animated.Text
                style={[styles.intentionLabel, secondaryTextAnimatedStyle]}
              >
                TODAY'S INTENTION
              </Animated.Text>
              <Animated.Text style={[styles.focusLabel, textAnimatedStyle]}>
                {todayEntry.choice}
              </Animated.Text>
              {todayEntry.note ? (
                <Animated.View
                  style={[styles.noteContainer, noteContainerAnimatedStyle]}
                >
                  <Animated.Text
                    style={[styles.noteText, secondaryTextAnimatedStyle]}
                  >
                    "{todayEntry.note}"
                  </Animated.Text>
                </Animated.View>
              ) : null}
            </>
          ) : (
            <Animated.Text style={[styles.heading, textAnimatedStyle]}>
              You've already checked in today.
            </Animated.Text>
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
          style={[styles.button, buttonAnimatedStyle]}
          testID="button-patterns"
        >
          <Animated.Text style={[styles.buttonText, buttonTextAnimatedStyle]}>
            View Patterns
          </Animated.Text>
        </AnimatedPressable>
      </Animated.View>
    </Animated.View>
  );
}

function AnimatedFeatherIcon({
  name,
  size,
  colorStyle,
}: {
  name: keyof typeof Feather.glyphMap;
  size: number;
  colorStyle: any;
}) {
  const AnimatedIcon = Animated.createAnimatedComponent(Feather);
  return <AnimatedIcon name={name} size={size} style={colorStyle} />;
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
