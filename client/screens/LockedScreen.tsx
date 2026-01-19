import React, { useState, useEffect } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";
import { getTimeUntilMidnight, formatCountdown } from "@/storage/localStorage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type LockedScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Locked">;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function LockedScreen({ navigation }: LockedScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const buttonScale = useSharedValue(1);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const { hours, minutes } = getTimeUntilMidnight();
      setCountdown(formatCountdown(hours, minutes));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

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
      <View style={styles.content}>
        <Animated.View
          entering={FadeIn.duration(400).delay(100)}
          style={[styles.iconContainer, { backgroundColor: theme.backgroundDefault }]}
        >
          <Feather name="lock" size={48} color={theme.textSecondary} />
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(200)}>
          <ThemedText style={[styles.heading, { color: theme.text }]}>
            You've reflected today
          </ThemedText>

          <ThemedText
            style={[styles.subtext, { color: theme.textSecondary }]}
          >
            Next entry unlocks in {countdown}
          </ThemedText>
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
            { backgroundColor: theme.backgroundDefault },
            buttonAnimatedStyle,
          ]}
          testID="button-patterns"
        >
          <ThemedText style={[styles.buttonText, { color: theme.text }]}>
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
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing["3xl"],
  },
  heading: {
    ...Typography.h4,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  subtext: {
    ...Typography.body,
    textAlign: "center",
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
