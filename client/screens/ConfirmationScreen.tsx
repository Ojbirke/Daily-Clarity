import React from "react";
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
  ZoomIn,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type ConfirmationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Confirmation">;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ConfirmationScreen({
  navigation,
}: ConfirmationScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const buttonScale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const handleDone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.replace("Locked");
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
          entering={ZoomIn.duration(400).springify().damping(12)}
          style={[styles.iconContainer, { backgroundColor: theme.backgroundDefault }]}
        >
          <Feather name="check" size={48} color={theme.success} />
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(200)}>
          <ThemedText style={[styles.heading, { color: theme.text }]}>
            Entry saved
          </ThemedText>

          <ThemedText
            style={[styles.subtext, { color: theme.textSecondary }]}
          >
            See you tomorrow at midnight
          </ThemedText>
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeIn.duration(400).delay(400)}
        style={styles.buttonContainer}
      >
        <AnimatedPressable
          onPress={handleDone}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[
            styles.button,
            { backgroundColor: theme.link },
            buttonAnimatedStyle,
          ]}
          testID="button-done"
        >
          <ThemedText style={[styles.buttonText, { color: theme.buttonText }]}>
            Done
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
