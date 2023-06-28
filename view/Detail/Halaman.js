import React, { useEffect, useState, useRef, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { halamanDetail } from "../../service/api";
import ImageViewer from "react-native-image-zoom-viewer";
import { MaterialCommunityIcons, Ionicons, Entypo } from "@expo/vector-icons";
import { ThemeContext } from "../Theme/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get("window").width;

const Halaman = ({ route }) => {
  const [data, setData] = useState(null);
  const API_URL = "http://192.168.1.21:3002";
  const [imageIndex, setImageIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [showInvalidCoordinates, setShowInvalidCoordinates] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isIdInLocalStorage, setIsIdInLocalStorage] = useState(false);

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const latitudeDelta = 0.005;
  const longitudeDelta = 0.005;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const radiusAnim = useRef(new Animated.Value(20)).current;

  const { isDarkMode, backgroundColor, textColor } = useContext(ThemeContext);
  useEffect(() => {
    const { id_kecamatan } = route.params;
    halamanDetail(id_kecamatan).then((result) => {
      setData(result);
  
      // Check if the post is already saved in local storage
      AsyncStorage.getItem("savedPosts").then((savedData) => {
        const posts = savedData ? JSON.parse(savedData) : [];
        const isIdInLocalStorage = posts.some((post) => post.id === result.id);
        setIsSaved(isIdInLocalStorage);
        setIsIdInLocalStorage(isIdInLocalStorage);
  
        // Start the animations
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 1000,
            useNativeDriver: true,
          }),
        ]).start();
      });
    });
  }, []);
  

  useEffect(() => {
    // Restart the circle animation when isMapVisible changes
    if (isMapVisible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(radiusAnim, {
            toValue: 100,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [isMapVisible]);

  const saveToLocalStorage = async () => {
    try {
      // Retrieve the existing saved data from local storage
      const savedData = await AsyncStorage.getItem("savedPosts");
      let posts = savedData ? JSON.parse(savedData) : [];

      const existingPostIndex = posts.findIndex((post) => post.id === data.id);

      if (existingPostIndex !== -1) {
        // Post already exists in saved data, remove it
        posts.splice(existingPostIndex, 1);
        ToastAndroid.show("Bookmark telah dihapus", ToastAndroid.SHORT);
      } else {
        // Add the current post to the saved data
        posts.push(data);
        ToastAndroid.show("Berhasil tambahkan ke Bookmark", ToastAndroid.SHORT);
      }

      // Save the updated data to local storage
      await AsyncStorage.setItem("savedPosts", JSON.stringify(posts));

      // Update the saved state
      setIsSaved(existingPostIndex === -1);

      console.log("Data saved to local storage:", posts); // Check the saved data in console
    } catch (error) {
      console.log("Error saving to local storage:", error);
    }
  };

  const toggleModal = async () => {
    const { id } = data;
    const savedData = await AsyncStorage.getItem("savedPosts");
    const posts = savedData ? JSON.parse(savedData) : [];
    const isIdInLocalStorage = posts.some(post => post.id === id);
    setIsIdInLocalStorage(isIdInLocalStorage);
    setIsModalVisible(!isModalVisible);
  };
  
  

  const toggleMap = () => {
    if (!isCoordinateValid) {
      setShowInvalidCoordinates(true);
    } else {
      setShowInvalidCoordinates(false);
    }
    setIsMapVisible(!isMapVisible);
  };

  if (!data) {
    return (
      <View style={[styles.nodata, { backgroundColor: backgroundColor }]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ color: textColor }}>Loading...</Text>
      </View>
    );
  }

  const latitude = parseFloat(data.koordinat.split(" ")[0]);
  const longitude = parseFloat(data.koordinat.split(" ")[1]);

  // Check if coordinates are valid
  const isCoordinateValid = !isNaN(latitude) && !isNaN(longitude);

  const images = [];
  if (data.gambar1) {
    images.push({ url: `${API_URL}/${data.gambar1}` });
  }
  if (data.gambar2) {
    images.push({ url: `${API_URL}/${data.gambar2}` });
  }
  if (data.gambar3) {
    images.push({ url: `${API_URL}/${data.gambar3}` });
  }

  return (
    <Animated.ScrollView
      style={[
        styles.container,
        { opacity: fadeAnim, backgroundColor: backgroundColor },
      ]}
    >
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={[styles.imageContainer, { transform: [{ scale: scaleAnim }] }]}
      >
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setImageIndex(index);
              toggleModal();
            }}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: image.url }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.imageIndicator}>
                <Ionicons name="images-outline" size={25} color="black" />
                <Text style={styles.imageCountText}>
                  {index + 1}/{images.length}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>

      <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={saveToLocalStorage}>
            <Text style={[styles.titleText, { color: textColor }]}>
              {data.nama_kecamatan}
            </Text>
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isSaved || isIdInLocalStorage ? "orange" : "#696969"}
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.labelText, { color: textColor }]}>
          ID Kecamatan:
        </Text>
        <Text style={[styles.valueText, { color: textColor }]}>
          {data.id_kecamatan}
        </Text>
        <Text style={[styles.labelText, { color: textColor }]}>Bidang:</Text>
        <Text style={[styles.valueText, { color: textColor }]}>
          {data.bidang}
        </Text>
        <Text style={[styles.labelText, { color: textColor }]}>Judul:</Text>
        <Text style={[styles.valueText, { color: textColor }]}>
          {data.judul}
        </Text>
        <Text style={[styles.labelText, { color: textColor }]}>Anggaran:</Text>
        <Text style={[styles.valueText, { color: textColor }]}>
          {data.anggaran}
        </Text>
        <Text style={[styles.labelText, { color: textColor }]}>Tahun:</Text>
        <Text style={[styles.valueText, { color: textColor }]}>
          {data.tahun}
        </Text>
        <Text style={[styles.labelText, { color: textColor }]}>Koordinat:</Text>
        <Text style={[styles.valueText, { color: textColor }]}>
          {data.koordinat}
        </Text>
      </Animated.View>
      <TouchableOpacity
        onPress={toggleMap}
        style={[
          styles.toggleMapButton,
          { backgroundColor: isDarkMode ? "#ffffff" : "#008000" },
        ]}
      >
        <Text
          style={[
            styles.toggleMapButtonText,
            { color: isDarkMode ? "#000000" : "#ffffff" },
          ]}
        >
          {isMapVisible ? "Sembunyikan Map" : "Tampilkan Map"}
        </Text>
      </TouchableOpacity>
      {showInvalidCoordinates && (
        <Text style={[styles.invalidCoordinateText, { color: "red" }]}>
          Koordinat tidak sesuai
        </Text>
      )}

      <View style={[styles.mapContainer, { height: isMapVisible ? 450 : 0 }]}>
        {isMapVisible && isCoordinateValid && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: latitudeDelta,
              longitudeDelta: longitudeDelta,
            }}
          >
            <Marker.Animated
              coordinate={{ latitude: latitude, longitude: longitude }}
              title={data.nama_kecamatan}
              description={data.lokasi}
            />
            <AnimatedCircle
              center={{ latitude, longitude }}
              radius={radiusAnim}
              fillColor={
                isDarkMode ? "rgba(0, 0, 255, 0.3)" : "rgba(0, 0, 255, 0.3)"
              }
              strokeColor={isDarkMode ? "red" : "white"}
            />
          </MapView>
        )}
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={toggleModal}
      >
        <ImageViewer
          imageUrls={images}
          index={imageIndex}
          enableSwipeDown={true}
          onSwipeDown={toggleModal}
        />
        <TouchableOpacity style={styles.backButton} onPress={toggleModal}>
          <Ionicons name="chevron-back-outline" size={24} color="white" />
        </TouchableOpacity>
      </Modal>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  nodata: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    height: 350,
  },
  imageWrapper: {
    width: windowWidth,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  imageIndicator: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    padding: 5,
  },
  imageCountText: {
    color: "black",
    marginLeft: 5,
  },

  textContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 15,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  valueText: {
    fontSize: 16,
    marginBottom: 15,
  },
  toggleMapButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  toggleMapButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  invalidCoordinateText: {
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
  },

  mapContainer: {
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 10,
  },
});

export default Halaman;
