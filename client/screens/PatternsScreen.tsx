import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import Animated, { FadeIn } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Typography } from "@/constants/theme";
import { getAllEntries, ClarityChoice, getSavedPalette, SavedPalette } from "@/storage/localStorage";

type ChoiceCounts = Record<ClarityChoice, number>;

export default function PatternsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const [counts, setCounts] = useState<ChoiceCounts>({
    Focus: 0,
    Calm: 0,
    Energy: 0,
  });
  const [mostCommon, setMostCommon] = useState<ClarityChoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [palette, setPalette] = useState<SavedPalette["palette"] | null>(null);

  useEffect(() => {
    loadPatterns();
  }, []);

  const loadPatterns = async () => {
    const entries = await getAllEntries();

    const newCounts: ChoiceCounts = {
      Focus: 0,
      Calm: 0,
      Energy: 0,
    };

    entries.forEach((entry) => {
      if (entry.choice in newCounts) {
        newCounts[entry.choice]++;
      }
    });

    setCounts(newCounts);

    const choices: ClarityChoice[] = ["Focus", "Calm", "Energy"];
    let maxChoice: ClarityChoice | null = null;
    let maxCount = 0;

    choices.forEach((choice) => {
      if (newCounts[choice] > maxCount) {
        maxCount = newCounts[choice];
        maxChoice = choice;
      }
    });

    setMostCommon(maxChoice);

    const saved = await getSavedPalette();
    if (saved) {
      setPalette(saved.palette);
    }

    setLoading(false);
  };

  const totalEntries = counts.Focus + counts.Calm + counts.Energy;

  const bg = palette ? palette.background : theme.backgroundRoot;
  const textColor = palette ? palette.text : theme.text;
  const secondaryColor = palette ? palette.textSecondary : theme.textSecondary;
  const rowBg = palette ? palette.iconBg : theme.backgroundDefault;

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: bg,
            paddingTop: headerHeight + Spacing.lg,
          },
        ]}
      >
        <View style={styles.loadingContainer}>
          <ThemedText style={{ color: secondaryColor }}>
            Loading...
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          paddingTop: headerHeight + Spacing["3xl"],
          paddingBottom: insets.bottom + Spacing["3xl"],
        },
      ]}
    >
      <Animated.View entering={FadeIn.duration(400)} style={styles.content}>
        <ThemedText style={[styles.title, { color: textColor }]}>
          Your patterns
        </ThemedText>

        <View style={styles.countersContainer}>
          <View style={[styles.counterRow, { backgroundColor: rowBg }]}>
            <ThemedText style={[styles.counterLabel, { color: textColor }]}>
              Focus
            </ThemedText>
            <ThemedText
              style={[styles.counterValue, { color: secondaryColor }]}
            >
              {counts.Focus} {counts.Focus === 1 ? "day" : "days"}
            </ThemedText>
          </View>

          <View style={[styles.counterRow, { backgroundColor: rowBg }]}>
            <ThemedText style={[styles.counterLabel, { color: textColor }]}>
              Calm
            </ThemedText>
            <ThemedText
              style={[styles.counterValue, { color: secondaryColor }]}
            >
              {counts.Calm} {counts.Calm === 1 ? "day" : "days"}
            </ThemedText>
          </View>

          <View style={[styles.counterRow, { backgroundColor: rowBg }]}>
            <ThemedText style={[styles.counterLabel, { color: textColor }]}>
              Energy
            </ThemedText>
            <ThemedText
              style={[styles.counterValue, { color: secondaryColor }]}
            >
              {counts.Energy} {counts.Energy === 1 ? "day" : "days"}
            </ThemedText>
          </View>
        </View>

        {totalEntries > 0 && mostCommon ? (
          <View style={styles.insightContainer}>
            <ThemedText
              style={[styles.insightText, { color: secondaryColor }]}
            >
              You choose {mostCommon} most often
            </ThemedText>
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing["2xl"],
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    ...Typography.h2,
    marginBottom: Spacing["4xl"],
  },
  countersContainer: {
    gap: Spacing.lg,
  },
  counterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  counterLabel: {
    ...Typography.body,
    fontWeight: "600",
  },
  counterValue: {
    ...Typography.body,
  },
  insightContainer: {
    marginTop: Spacing["4xl"],
  },
  insightText: {
    ...Typography.body,
  },
});
