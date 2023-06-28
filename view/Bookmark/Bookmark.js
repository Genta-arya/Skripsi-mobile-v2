import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../Theme/Theme";

const Bookmark = () => {
  const [bookmarkData, setBookmarkData] = useState([]);
  const API_URL = "http://192.168.1.21:3001";
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    fetchBookmarkData();
    const interval = setInterval(fetchBookmarkData, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchBookmarkData = async () => {
    try {
      const savedData = await AsyncStorage.getItem("savedPosts");
      const bookmarkedPosts = savedData ? JSON.parse(savedData) : [];
      setBookmarkData(bookmarkedPosts);
    } catch (error) {
      console.log("Error fetching bookmark data:", error);
    }
  };

  useEffect(() => {
    console.log("Bookmark data updated:", bookmarkData);
  }, [bookmarkData]);

  const handleItemPress = (id) => {
    navigation.navigate("DetailKecamatan", { id_kecamatan: id });
  };

  const handleLongPress = (id) => {
    Alert.alert(
      "Hapus Bookmark",
      "Apakah ingin menghapus Bookmark?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", style: "destructive", onPress: () => handleBookmarkDelete(id) },
      ]
    );
  };

  const handleBookmarkDelete = async (id) => {
    try {
      const updatedBookmarks = bookmarkData.filter((item) => item.id !== id);
      await AsyncStorage.setItem(
        "savedPosts",
        JSON.stringify(updatedBookmarks)
      );
      setBookmarkData(updatedBookmarks);
    } catch (error) {
      console.log("Error deleting bookmark:", error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleItemPress(item.id)}
      onLongPress={() => handleLongPress(item.id)}
    >
      <Image
        source={{ uri: `${API_URL}/${item.gambar1}` }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text
          style={[styles.title, { color: isDarkMode ? "white" : "black" }]}
        >
          {item.nama_kecamatan}
        </Text>
        <Text
          style={[styles.subtitle, { color: isDarkMode ? "#999" : "#666" }]}
        >
          {item.id_kecamatan}
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: isDarkMode ? "white" : "black" },
          ]}
        >
          {item.judul}
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: isDarkMode ? "white" : "black" },
          ]}
        >
          {item.bidang}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "black" : "#fff" },
      ]}
    >
      <FlatList
        data={bookmarkData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
});

export default Bookmark;
