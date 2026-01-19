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
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NoteScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Note">;
  route: RouteProp<RootStackParamList, "Note">;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function NoteScreen({ navigation, route }: NoteScreenProps) {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const [response, setResponse] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const buttonScale = useSharedValue(1);

  const { question } = route.params;

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

  const handleSave = async () => {
    if (!response.trim() || isSaving) return;

    setIsSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Keyboard.dismiss();

    try {
      await saveEntry(question, response.trim());
      navigation.replace("Confirmation");
    } catch {
      setIsSaving(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const canSave = response.trim().length > 0 && !isSaving;

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
          <ThemedText
            style={[styles.questionLabel, { color: theme.textSecondary }]}
          >
            {question}
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
            placeholder="Write your thoughts..."
            placeholderTextColor={theme.textSecondary}
            value={response}
            onChangeText={setResponse}
            multiline
            textAlignVertical="top"
            autoCapitalize="sentences"
            autoCorrect
            testID="input-response"
          />
        </Animated.View>

        <AnimatedPressable
          onPress={handleSave}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={!canSave}
          style={[
            styles.saveButton,
            {
              backgroundColor: theme.link,
              opacity: canSave ? 1 : 0.4,
              bottom: insets.bottom + Spacing["2xl"],
            },
            buttonAnimatedStyle,
          ]}
          testID="button-save"
        >
          <ThemedText style={[styles.saveButtonText, { color: theme.buttonText }]}>
            Save
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
  questionLabel: {
    ...Typography.body,
    marginBottom: Spacing["2xl"],
    opacity: 0.8,
  },
  input: {
    flex: 1,
    ...Typography.body,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xs,
    maxHeight: Platform.OS === "web" ? 400 : undefined,
  },
  saveButton: {
    position: "absolute",
    right: Spacing["2xl"],
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xs,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {},
    }),
  },
  saveButtonText: {
    ...Typography.button,
  },
});
