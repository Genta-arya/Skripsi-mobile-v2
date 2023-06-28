import React, { useEffect, useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "../constant";
import ListKecamatan from "../view/Kecamatan/ListKecamatan";
import HomeView from "../view/Home/HomeView";
import Notif from "../view/User/Notif";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Setting from "../view/User/Setting";
import { ThemeContext } from "../view/Theme/Theme";
import Bookmark from "../view/Bookmark/Bookmark";

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

const KecamatanStack = () => {
  const theme = useContext(ThemeContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.isDarkMode ? "black" : "white",
        },
        headerTintColor: theme.isDarkMode ? "white" : "black",
      }}
    >
      <Stack.Screen
        name={"Daftar Kecamatan"}
        component={ListKecamatan}
        options={{
          headerShown: true,
          headerBackVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

const UserStack = () => {
  const theme = useContext(ThemeContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.isDarkMode ? "black" : "white",
        },
        headerTintColor: theme.isDarkMode ? "white" : "black",
      }}
    >
      <Stack.Screen
        name={"notifikasi"}
        component={Notif}
        options={{
          headerShown: true,
          headerBackVisible: false,
          title: "Notifikasi",
          headerTitleStyle: {
            color: theme.isDarkMode ? "white" : "black",
          },
        }}
      />
    </Stack.Navigator>
  );
};

const UserBookmark = () => {
  const theme = useContext(ThemeContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.isDarkMode ? "black" : "white",
        },
        headerTintColor: theme.isDarkMode ? "white" : "black",
      }}
    >
      <Stack.Screen
        name={"Bookmark"}
        component={Bookmark}
        options={{
          headerShown: true,
          headerBackVisible: false,
          title: "Bookmark",
          headerTitleStyle: {
            color: theme.isDarkMode ? "white" : "black",
          },
        }}
      />
    </Stack.Navigator>
  );
};

const UserSetting = () => {
  const theme = useContext(ThemeContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.isDarkMode ? "black" : "white",
        },
        headerTintColor: theme.isDarkMode ? "white" : "black",
      }}
    >
      <Stack.Screen
        name={"Setting"}
        component={Setting}
        options={{
          headerShown: true,
          headerBackVisible: false,
          title: "Pengaturan",
          headerTitleStyle: {
            color: theme.isDarkMode ? "white" : "black",
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default function BottomNav() {
  const theme = useContext(ThemeContext);
  const [notifData, setNotifData] = useState([]);
  const [newNotifCount, setNewNotifCount] = useState(0);
  const [badgeCount, setBadgeCount] = useState(0);

  const getBadgeCount = async () => {
    try {
      const count = await AsyncStorage.getItem("badgeCount");
      if (count !== null) {
        setBadgeCount(parseInt(count));
        console.log(badgeCount);
      }
    } catch (error) {
      console.log("Error retrieving badge count:", error);
    }
  };

  useEffect(() => {
    getBadgeCount();
  }, []);

  const incrementBadgeCount = async () => {
    try {
      const newCount = badgeCount + 1;
      setBadgeCount(newCount);
      await AsyncStorage.setItem("badgeCount", newCount.toString());
    } catch (error) {
      console.log("Error incrementing badge count:", error);
    }
  };

  const fetchNotifData = () => {
    const API_URL = "http://192.168.1.21:3002";
    fetch(`${API_URL}/api/notifikasi`)
      .then((response) => response.json())
      .then(async (data) => {
        const { noread, read } = data.data.reduce(
          (acc, notif) => {
            if (notif.isRead) {
              acc.read.push(notif);
            } else {
              acc.noread.push(notif);
            }
            return acc;
          },
          { noread: [], read: [] }
        );
  
        setNotifData({ noread, read });
  
        const newNotifCount = noread.length;
        setNewNotifCount(badgeCount);
        // console.log(newNotifCount);
  
        try {
          // Store noread notifications
          for (const notif of noread) {
            await AsyncStorage.setItem(`notif_${notif.id}`, "noread");
          }
  
          // Store read notifications
          for (const notif of read) {
            await AsyncStorage.setItem(`notif_${notif.id}`, "read");
          }
  
          // Update badge state and count
          const updatedNoreadNotifCount = noread.length;
          await AsyncStorage.setItem(
            "badgeCount",
            String(updatedNoreadNotifCount)
          );
          setBadgeCount(updatedNoreadNotifCount);
         
  
          // Check if all notifications are read
          if (noread.length === 0 && read.length > 0) {
            await AsyncStorage.setItem("badgeCount", "0");
            setBadgeCount(0);
          }
        } catch (error) {
          console.error(error);
        }
      });
  };
  
  useEffect(() => {
    fetchNotifData();
    const interval = setInterval(fetchNotifData, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  

  useEffect(() => {
    fetchNotifData();
    const interval = setInterval(fetchNotifData, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const tabIconAnimation = new Animated.Value(0);

  const handleTabPress = async (routeName, navigation) => {
    Animated.sequence([
      Animated.timing(tabIconAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(tabIconAnimation, {
        toValue: 0,
        duration: 150,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate(routeName);
    });
  
    if (routeName === "Notifikasi") {
      try {
        // Update read status of noread notifications to "read"
        const noreadNotifKeys = await AsyncStorage.getAllKeys();
        const noreadNotifKeysToUpdate = noreadNotifKeys.filter(
          (key) => key.startsWith("notif_") && key !== "notifState"
        );
        for (const key of noreadNotifKeysToUpdate) {
          await AsyncStorage.setItem(key, "read");
        }
  
        // Update badge state and count
        const updatedNoreadNotifKeys = await AsyncStorage.getAllKeys();
        const updatedNoreadNotifKeysFiltered = updatedNoreadNotifKeys.filter(
          (key) => key.startsWith("notif_") && key !== "notifState"
        );
        const updatedNoreadNotifCount = updatedNoreadNotifKeysFiltered.length;
        await AsyncStorage.setItem(
          "badgeCount",
          String(updatedNoreadNotifCount)
        );
        setBadgeCount(updatedNoreadNotifCount);
  
        // Fetch and display read notifications
        fetchReadNotifData();
      } catch (error) {
        console.error(error);
      }
    }
  };
  
  const rotateValue = tabIconAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        activeColor={theme.textColor}
        barStyle={{ backgroundColor: theme.backgroundColor }}
      >
        <Tab.Screen
          name={ROUTES.HOME}
          component={HomeView}
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons name="ios-home-outline" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name={ROUTES.KECAMATAN}
          component={KecamatanStack}
          options={({ navigation }) => ({
            title: "Kecamatan",
            tabBarIcon: ({ color }) => (
              <TouchableOpacity
                onPress={() => handleTabPress(ROUTES.KECAMATAN, navigation)}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={{
                    transform: [{ rotate: rotateValue }],
                    backgroundColor: "transparent",
                  }}
                >
                  <Ionicons name="ios-search-outline" size={24} color={color} />
                </Animated.View>
              </TouchableOpacity>
            ),
          })}
        />

        <Tab.Screen
          name={"Bookmarks"}
          component={UserBookmark}
          options={({ navigation }) => ({
            title: "Bookmark",
            tabBarIcon: ({ color }) => (
              <TouchableOpacity
                onPress={() => handleTabPress("Bookmark", navigation)}
                activeOpacity={0.9}
              >
                <Animated.View
                  style={{
                    transform: [{ rotate: rotateValue }],
                  }}
                >
                  <Ionicons
                    name="ios-bookmarks-outline"
                    size={24}
                    color={color}
                  />
                </Animated.View>
              </TouchableOpacity>
            ),
          })}
        />
        <Tab.Screen
          name={"Notifikasi"}
          component={UserStack}
          options={({ navigation }) => ({
            title: "Notifikasi",
            tabBarIcon: ({ color }) => (
              <TouchableOpacity
                onPress={() => handleTabPress("Notifikasi", navigation)}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={{
                    transform: [{ rotate: rotateValue }],
                    backgroundColor: "transparent",
                  }}
                >
                  <View>
                    <Ionicons
                      name="ios-notifications-outline"
                      size={24}
                      color={color}
                    />
                    {badgeCount > 0 && (
                      <View
                        style={[
                          styles.badgeContainer,
                          { backgroundColor: theme.isDarkMode ? "red" : "red" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            { color: theme.isDarkMode ? "white" : "white" },
                          ]}
                        >
                          {badgeCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </Animated.View>
              </TouchableOpacity>
            ),
          })}
        />

        <Tab.Screen
          name={"Pengaturan"}
          component={UserSetting}
          options={({ navigation }) => ({
            title: "Pengaturan",
            tabBarIcon: ({ color }) => (
              <TouchableOpacity
                onPress={() => handleTabPress("Pengaturan", navigation)}
                activeOpacity={0.9}
              >
                <Animated.View
                  style={{
                    transform: [{ rotate: rotateValue }],
                  }}
                >
                  <Ionicons
                    name="ios-settings-outline"
                    size={24}
                    color={color}
                  />
                </Animated.View>
              </TouchableOpacity>
            ),
          })}
        />
      </Tab.Navigator>
      <StatusBar style={theme.isDarkMode ? "light" : "dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    position: "absolute",
    top: -5,
    right: -5,
    borderRadius: 10,
    width: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },
});
