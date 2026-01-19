import React, { useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { hasCompletedToday } from "@/storage/localStorage";
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
      // Clear old data from previous version (one-time migration)
      await AsyncStorage.removeItem("@daily_clarity_entries");
      
      const completed = await hasCompletedToday();

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
