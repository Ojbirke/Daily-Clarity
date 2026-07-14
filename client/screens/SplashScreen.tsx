import React, { useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { hasCompletedToday } from "@/storage/localStorage";
import { syncWidget } from "@/utils/widget";
import { RootStackParamList } from "@/types/navigation";

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Splash">;
};

export default function SplashScreen({ navigation }: SplashScreenProps) {
  const { theme } = useTheme();
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    const checkAndNavigate = async () => {
      const completed = await hasCompletedToday();

      // Keep the home/lock-screen widget in sync on every launch (handles day
      // rollover and streak changes even if the user doesn't check in).
      syncWidget();

      const navigate = () => {
        if (completed) {
          navigation.replace("Locked");
        } else {
          navigation.replace("Question");
        }
      };

      setTimeout(() => {
        opacity.value = withTiming(
          0,
          {
            duration: 300,
            easing: Easing.out(Easing.ease),
          },
          () => {
            runOnJS(navigate)();
          }
        );
      }, 500);
    };

    checkAndNavigate();
  }, [navigation, opacity]);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
  },
});
