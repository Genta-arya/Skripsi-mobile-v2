import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Alert,
  ActivityIndicator,
  ToastAndroid,
  Dimensions,
  RefreshControl,
  FlatList,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { getKecamatan } from "../../service/api";
import { ThemeContext } from "../Theme/Theme";

const textColor = "#000000";

const ListKecamatan = () => {
  const navigation = useNavigation();
  const [kecamatanData, setKecamatanData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const opacityValue = useRef(new Animated.Value(0)).current;
  const API_URL = "http://192.168.1.21:3002";
  const scrollY = useRef(new Animated.Value(0)).current;
  const searchContainerOpacity = useRef(new Animated.Value(5)).current;
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef(null);
  const [isTop, setIsTop] = useState(true);

  const { isDarkMode, backgroundColor, textColor } = useContext(ThemeContext);

  const fetchData = async () => {
    try {
      const response = await getKecamatan();
      setKecamatanData(response.data);
      setFilterData(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      setSearchText("");
    }, [])
  );

  useEffect(() => {
    Animated.timing(opacityValue, {
      toValue: 5,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [opacityValue]);

  const handleKecamatanPress = (id_kecamatan) => {
    navigation.navigate("postingan", { id_kecamatan });
  };

  const handleUpButtonPress = () => {
    if (scrollY._value > windowHeight * 0.5) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const handleSearch = (text) => {
    const searchText = text.toLowerCase();
    setSearchText(searchText);

    if (searchText) {
      const newData = kecamatanData.filter((item) => {
        const itemData = item.nama_kecamatan
          ? item.nama_kecamatan.toLowerCase()
          : "";
        return itemData.indexOf(searchText) > -1;
      });

      if (newData.length === 0) {
        setFilterData([{ id: 0, nama_kecamatan: "Kecamatan tidak ditemukan" }]);
      } else {
        setFilterData(newData);
      }
    } else {
      setFilterData(kecamatanData);
    }
  };

  const handleRetryButtonPress = () => {
    setIsLoading(true);
    ToastAndroid.show(
      "Mencoba menghubungkan kembali ke server",
      ToastAndroid.SHORT
    );
    fetchData();
  };

  const handleSearchAgain = () => {
    setSearchText("");
    setFilterData(kecamatanData);
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color="#008000" />
      </View>
    );
  }

  if (filterData.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor }]}>
        <Text style={[styles.emptyText, { color: textColor }]}>
          {isLoading
            ? "Menghubungkan ke server..."
            : "Gagal terhubung ke server..."}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={handleRetryButtonPress}
        >
          <Ionicons
            name="reload-outline"
            size={70}
            color={textColor}
            marginTop={20}
          />
        </TouchableOpacity>
      </View>
    );
  }

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
    if (offsetY === 0) {
      setIsTop(true);
      Animated.timing(searchContainerOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      setIsTop(false);
      Animated.timing(searchContainerOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };
  const renderItem = ({ item }) => (
    <Animated.View
      key={item.id_kecamatan}
      style={[
        styles.card,
        {
          backgroundColor: isDarkMode ? "black" : "#FFFFFF",
        },
        {
          opacity: scrollY.interpolate({
            inputRange: [-windowHeight, 0, windowHeight * 0.3],
            outputRange: [0, 1, 1],
          }),
          transform: [
            {
              scale: scrollY.interpolate({
                inputRange: [-windowHeight, 0, windowHeight * 0.3],
                outputRange: [0.5, 1, 1],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleKecamatanPress(item.id_kecamatan)}
      >
        <View style={styles.contentContainer}>
          <Image
            source={{ uri: `${API_URL}/${item.gambar}` }}
            style={styles.gambarKecamatan}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.namaKecamatan, { color: textColor }]}>
              {item.nama_kecamatan}
            </Text>
            <Text style={[styles.id_kecamatan, { color: textColor }]}>
              Kode pos: {item.id_kecamatan}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Animated.View
        style={[
          styles.searchContainer,
          {
            opacity: searchContainerOpacity,
            backgroundColor: isDarkMode ? "#424242" : "#FFFFFF",
          },
        ]}
      >
        <MaterialIcons
          name="search"
          size={24}
          color={isDarkMode ? "#FFFFFF" : "#555555"}
        />
        <TextInput
          style={[
            styles.searchInput,
            { color: isDarkMode ? "#FFFFFF" : "#555555" },
          ]}
          placeholder="Cari Kecamatan..."
          value={searchText}
          onChangeText={handleSearch}
          placeholderTextColor={isDarkMode ? "#FFFFFF" : "#555555"}
        />
      </Animated.View>

      {isLoading ? (
        <View style={[styles.loadingContainer, { backgroundColor }]}>
          <ActivityIndicator size="large" color="#008000" />
        </View>
      ) : filterData[0].id === 0 ? (
        <View style={[styles.emptyContainer, { backgroundColor }]}>
          <AntDesign name="frown" size={64} color={textColor} />
          <Text style={[styles.emptyText, { color: textColor }]}>
            Kecamatan tidak ditemukan
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={filterData}
          keyExtractor={(item) => item.id_kecamatan.toString()}
          contentContainerStyle={styles.scrollContainer}
          renderItem={renderItem}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchData}
              colors={["#008000"]}
              progressBackgroundColor="#FFFFFF"
            />
          }
        />
      )}
      <TouchableOpacity
        style={[styles.floatingActionButton, { opacity: isTop ? 0 : 1 }]}
        onPress={handleUpButtonPress}
      >
        <Ionicons name="arrow-up" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  container: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    height: windowHeight * 0.08,
    paddingHorizontal: windowWidth * 0.04,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    borderRadius: 20,
    elevation: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: windowWidth * 0.02,
    fontSize: windowWidth * 0.04,
    borderRadius: 10,
    paddingHorizontal: windowWidth * 0.02,
    paddingVertical: windowHeight * 0.01,
    borderWidth: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: windowWidth * 0.04,
    fontWeight: "bold",
    marginTop: windowHeight * 0.04,
  },
  retryButton: {
    paddingVertical: windowHeight * 0.02,
    paddingHorizontal: windowWidth * 0.04,
    borderRadius: windowWidth * 0.01,
  },
  retryButtonText: {
    fontSize: windowWidth * 0.03,
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingTop: windowHeight * 0.089,
   
  },
  card: {
    borderRadius: windowWidth * 0.01,
    elevation: 60,
    padding: windowWidth * 0.04,
    marginBottom:2,
  },
  textContainer: {
    flex: 1,
  },
  gambarKecamatan: {
    width: 100,
    height: 100,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#555555",
    marginLeft: 5,
  },

  namaKecamatan: {
    fontSize: windowWidth * 0.05,
    fontWeight: "bold",
    marginBottom: windowHeight * 0.02,
    marginLeft: 20,
  },
  id_kecamatan: {
    fontSize: windowWidth * 0.04,
    color: "#555555",
    marginBottom: windowHeight * 0.02,
    marginLeft: 20,
  },

  floatingActionButton: {
    position: "absolute",
    bottom: windowHeight * 0.08,
    right: windowWidth * 0.04,
    backgroundColor: "#008000",
    borderRadius: windowWidth * 0.1,
    width: windowWidth * 0.12,
    height: windowWidth * 0.12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default ListKecamatan;
