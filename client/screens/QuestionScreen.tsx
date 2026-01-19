import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ChoiceButton } from "@/components/ChoiceButton";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Typography } from "@/constants/theme";
import { saveEntry, ClarityChoice } from "@/storage/localStorage";
import { RootStackParamList } from "@/types/navigation";

type QuestionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Question">;
};

const CHOICES: ClarityChoice[] = ["Focus", "Calm", "Energy"];

export default function QuestionScreen({ navigation }: QuestionScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const handleChoice = async (choice: ClarityChoice) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await saveEntry(choice);
    navigation.replace("Confirmation", { choice });
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
        <ThemedText style={[styles.question, { color: theme.text }]}>
          What matters most today?
        </ThemedText>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(400).delay(300)}
        style={styles.choicesContainer}
      >
        {CHOICES.map((choice) => (
          <ChoiceButton
            key={choice}
            label={choice}
            onPress={() => handleChoice(choice)}
            testID={`button-${choice.toLowerCase()}`}
          />
        ))}
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
  question: {
    ...Typography.display,
    textAlign: "center",
  },
  choicesContainer: {
    width: "100%",
    gap: Spacing.lg,
  },
});
