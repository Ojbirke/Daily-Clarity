import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
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
import { getTodayDateString, getQuestionForDate } from "@/storage/localStorage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type QuestionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Question">;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function QuestionScreen({ navigation }: QuestionScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const buttonScale = useSharedValue(1);

  const today = getTodayDateString();
  const question = getQuestionForDate(today);

  const formattedDate = new Date(today).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const handleReflect = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Note", { question });
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
      <Animated.View
        entering={FadeIn.duration(400).delay(100)}
        style={styles.content}
      >
        <ThemedText
          style={[
            styles.dateLabel,
            { color: theme.textSecondary },
          ]}
        >
          {formattedDate.toUpperCase()}
        </ThemedText>

        <ThemedText
          style={[
            styles.question,
            { color: theme.text },
          ]}
        >
          {question}
        </ThemedText>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(400).delay(300)}
        style={styles.buttonContainer}
      >
        <AnimatedPressable
          onPress={handleReflect}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[
            styles.button,
            { backgroundColor: theme.link },
            buttonAnimatedStyle,
          ]}
          testID="button-reflect"
        >
          <ThemedText
            style={[
              styles.buttonText,
              { color: theme.buttonText },
            ]}
          >
            Reflect
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
    paddingHorizontal: Spacing.lg,
  },
  dateLabel: {
    ...Typography.label,
    marginBottom: Spacing["3xl"],
  },
  question: {
    ...Typography.display,
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
