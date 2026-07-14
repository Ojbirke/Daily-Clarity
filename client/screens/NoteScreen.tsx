import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Keyboard,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
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
import { saveEntry } from "@/storage/localStorage";
import { scheduleDailyReminder } from "@/utils/notifications";
import { syncWidget } from "@/utils/widget";
import { RootStackParamList } from "@/types/navigation";

type NoteScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Note">;
  route: RouteProp<RootStackParamList, "Note">;
};

const MAX_CHARS = 140;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function NoteScreen({ navigation, route }: NoteScreenProps) {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const buttonScale = useSharedValue(1);

  const { choice } = route.params;

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 400);
    return () => clearTimeout(timer);
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

  const handleNoteChange = (text: string) => {
    if (text.length <= MAX_CHARS) {
      setNote(text);
    }
  };

  const handleDone = async () => {
    if (isSaving) return;

    setIsSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Keyboard.dismiss();

    try {
      await saveEntry(choice, note.trim());
      scheduleDailyReminder();
      syncWidget();
      navigation.replace("Confirmation", { choice });
    } catch {
      setIsSaving(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const charsRemaining = MAX_CHARS - note.length;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      <Pressable
        style={[
          styles.inner,
          {
            paddingTop: headerHeight + Spacing["2xl"],
            paddingBottom: insets.bottom + Spacing["2xl"],
          },
        ]}
        onPress={dismissKeyboard}
      >
        <Animated.View entering={FadeIn.duration(300)} style={styles.content}>
          <ThemedText style={[styles.choiceLabel, { color: theme.text }]}>
            {choice}
          </ThemedText>

          <ThemedText
            style={[styles.promptLabel, { color: theme.textSecondary }]}
          >
            Add a note (optional)
          </ThemedText>

          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              {
                color: theme.text,
                backgroundColor: theme.backgroundDefault,
              },
            ]}
            placeholder="What's on your mind?"
            placeholderTextColor={theme.textSecondary}
            value={note}
            onChangeText={handleNoteChange}
            multiline
            textAlignVertical="top"
            autoCapitalize="sentences"
            autoCorrect
            maxLength={MAX_CHARS}
            testID="input-note"
          />

          <ThemedText
            style={[styles.charCount, { color: theme.textSecondary }]}
          >
            {charsRemaining}
          </ThemedText>
        </Animated.View>

        <AnimatedPressable
          onPress={handleDone}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isSaving}
          style={[
            styles.doneButton,
            {
              backgroundColor: theme.link,
              opacity: isSaving ? 0.5 : 1,
            },
            buttonAnimatedStyle,
          ]}
          testID="button-done"
        >
          <ThemedText
            style={[styles.doneButtonText, { color: theme.buttonText }]}
          >
            Done
          </ThemedText>
        </AnimatedPressable>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: Spacing["2xl"],
  },
  content: {
    flex: 1,
  },
  choiceLabel: {
    ...Typography.h2,
    marginBottom: Spacing.lg,
  },
  promptLabel: {
    ...Typography.body,
    marginBottom: Spacing.lg,
  },
  input: {
    flex: 1,
    ...Typography.body,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xs,
    maxHeight: Platform.OS === "web" ? 200 : 200,
  },
  charCount: {
    ...Typography.small,
    textAlign: "right",
    marginTop: Spacing.sm,
  },
  doneButton: {
    width: "100%",
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.none,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.lg,
  },
  doneButtonText: {
    ...Typography.button,
  },
});
