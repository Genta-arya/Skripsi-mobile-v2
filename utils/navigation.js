import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { useColorScheme } from "react-native";
// Ganti dengan path yang sesuai

import { ROUTES } from "../constant";
import BottomNavigasi from "./BottomNav";
import DetailPage from "../view/Detail/DetailPage";
import Halaman from "../view/Detail/Halaman";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../view/Theme/Theme";
import SplashScreen from "../view/Login/Splash";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const navigation = useNavigation();
  const { isDarkMode, backgroundColor, textColor } = useContext(ThemeContext);
  const colorScheme = useColorScheme();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const headerBackgroundColor = isDarkMode ? "black" : backgroundColor;
  const headerTextColor = isDarkMode ? "white" : textColor;
  const headerIconColor = isDarkMode ? "white" : textColor;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"splash"}
        component={SplashScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={"nav"}
        component={BottomNavigasi}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={"postingan"}
        component={DetailPage}
        options={{
          headerShown: true,
          title: "Daftar Pembangunan",
          headerStyle: {
            backgroundColor: headerBackgroundColor,
          },
          headerTintColor: headerTextColor,
          headerLeft: () => (
            <Ionicons
              name="chevron-back-outline"
              size={30}
              color={headerIconColor}
              style={{ marginLeft: 0, marginRight: 15 }}
              onPress={handleGoBack}
            />
          ),
        }}
      />

      <Stack.Screen
        name={"DetailKecamatan"}
        component={Halaman}
        options={{
          headerShown: true,
          title: "Detail Postingan",
          headerStyle: {
            backgroundColor: headerBackgroundColor,
          },
          headerTintColor: headerTextColor,
          headerLeft: () => (
            <Ionicons
              name="chevron-back-outline"
              size={30}
              color={headerIconColor}
              style={{ marginLeft: 0, marginRight: 15 }}
              onPress={handleGoBack}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
