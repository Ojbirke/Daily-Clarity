import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";
import { getAllEntries, DailyEntry } from "@/storage/localStorage";

export default function PatternsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const data = await getAllEntries();
    setEntries(data);
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const renderEntry = ({
    item,
    index,
  }: {
    item: DailyEntry;
    index: number;
  }) => (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 50)}
      style={[styles.entryCard, { backgroundColor: theme.backgroundDefault }]}
    >
      <View style={styles.entryHeader}>
        <ThemedText style={[styles.entryDate, { color: theme.textSecondary }]}>
          {formatDate(item.date)}
        </ThemedText>
        <ThemedText style={[styles.entryChoice, { color: theme.text }]}>
          {item.choice}
        </ThemedText>
      </View>
      {item.note ? (
        <ThemedText style={[styles.entryNote, { color: theme.textSecondary }]}>
          {item.note}
        </ThemedText>
      ) : null}
    </Animated.View>
  );

  const renderEmpty = () => (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={styles.emptyContainer}
    >
      <Image
        source={require("../../assets/images/empty-patterns.png")}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <ThemedText style={[styles.emptyTitle, { color: theme.text }]}>
        No check-ins yet
      </ThemedText>
      <ThemedText
        style={[styles.emptySubtext, { color: theme.textSecondary }]}
      >
        Your patterns will appear here
      </ThemedText>
    </Animated.View>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.backgroundRoot,
            paddingTop: headerHeight + Spacing.lg,
          },
        ]}
      >
        <View style={styles.loadingContainer}>
          <ThemedText style={{ color: theme.textSecondary }}>
            Loading...
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
    >
      <FlatList
        data={entries}
        keyExtractor={(item) => item.date}
        renderItem={renderEntry}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: insets.bottom + Spacing.lg,
          },
          entries.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing["2xl"],
    gap: Spacing.lg,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  entryCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xs,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  entryDate: {
    ...Typography.small,
  },
  entryChoice: {
    ...Typography.body,
    fontWeight: "600",
  },
  entryNote: {
    ...Typography.small,
    marginTop: Spacing.sm,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["2xl"],
  },
  emptyImage: {
    width: 160,
    height: 160,
    marginBottom: Spacing["2xl"],
    opacity: 0.6,
  },
  emptyTitle: {
    ...Typography.h4,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    ...Typography.body,
    textAlign: "center",
  },
});
