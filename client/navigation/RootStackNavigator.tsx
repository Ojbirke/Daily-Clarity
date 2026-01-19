import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HeaderButton } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";

import SplashScreen from "@/screens/SplashScreen";
import QuestionScreen from "@/screens/QuestionScreen";
import ConfirmationScreen from "@/screens/ConfirmationScreen";
import LockedScreen from "@/screens/LockedScreen";
import PatternsScreen from "@/screens/PatternsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useTheme } from "@/hooks/useTheme";
import { RootStackParamList } from "@/types/navigation";

export type { RootStackParamList };

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        headerShown: false,
        animation: "fade",
      }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Question" component={QuestionScreen} />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
      <Stack.Screen name="Locked" component={LockedScreen} />
      <Stack.Screen
        name="Patterns"
        component={PatternsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "Patterns",
          headerLeft: () => (
            <HeaderButton onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color={theme.text} />
            </HeaderButton>
          ),
          animation: "slide_from_right",
        })}
      />
    </Stack.Navigator>
  );
}
