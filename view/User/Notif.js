import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../Theme/Theme";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Notif() {
  const navigation = useNavigation();
  const [notifData, setNotifData] = useState([]);

  const API_URL = "http://192.168.1.21:3002";

  const { isDarkMode, backgroundColor, textColor } = useContext(ThemeContext);

  const fetchNotifData = () => {
    fetch(`${API_URL}/api/notifikasi`)
      .then((response) => response.json())
      .then((data) => {
        setNotifData(data.data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchNotifData();

    const interval = setInterval(fetchNotifData, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleNotificationPress = (id_kecamatan) => {
    navigation.navigate("postingan", { id_kecamatan });
  };

  const notificationBackgroundColor = isDarkMode ? "black" : backgroundColor;
  const notificationTextColor = isDarkMode ? "white" : textColor;

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: notificationBackgroundColor },
      ]}
    >
      {notifData.length > 0 ? (
        notifData.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            style={[styles.notification]}
            onPress={() => handleNotificationPress(notif.id_kecamatan)}
          >
            <Image
              source={{ uri: `${API_URL}/api/notifikasi/${notif.gambar}` }}
              style={styles.notificationImage}
            />
            <View style={styles.notificationContent}>
              <Text
                style={[
                  styles.notificationTitle,
                  { color: notificationTextColor },
                ]}
              >
                {notif.nama_kecamatan}
              </Text>
              <Text
                style={[
                  styles.notificationMessage,
                  { color: notificationTextColor },
                ]}
              >
                {notif.id_kecamatan}
              </Text>
              <Text
                style={[
                  styles.notificationMessage,
                  { color: notificationTextColor },
                ]}
              >
                {notif.pesan}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text
          style={[styles.noNotificationText, { color: notificationTextColor }]}
        >
          Tidak ada notifikasi
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  notification: {
    flexDirection: "row",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  notificationImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  notificationContent: {
    flex: 1,
    padding: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#777777",
  },
  noNotificationText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 24,
  },
});
