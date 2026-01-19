import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Typography } from "@/constants/theme";
import { RootStackParamList } from "@/types/navigation";

type ConfirmationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Confirmation">;
  route: RouteProp<RootStackParamList, "Confirmation">;
};

export default function ConfirmationScreen({
  navigation,
}: ConfirmationScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Locked");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

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
          style={[
            styles.iconContainer,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <Feather name="check" size={48} color={theme.success} />
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(200)}>
          <ThemedText style={[styles.heading, { color: theme.text }]}>
            You're done for today
          </ThemedText>
        </Animated.View>
      </View>
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
  },
});
