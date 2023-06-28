import React, { useEffect, useState, useRef, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
  ToastAndroid,
} from "react-native";
import { getDetail } from "../../service/api";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../Theme/Theme";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const DetailPage = ({ route }) => {
  const [kecamatanData, setKecamatanData] = useState(null);
  const navigate = useNavigation();
  const flatListRef = useRef(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const API_URL = "http://192.168.1.21:3002";

  const { isDarkMode, backgroundColor, textColor } = useContext(ThemeContext);

  useEffect(() => {
    const { id_kecamatan } = route.params;
    fetchData(id_kecamatan);
  }, []);

  useEffect(() => {
    if (kecamatanData) {
      animateItems();
    }
  }, [kecamatanData]);

  const fetchData = async (id_kecamatan) => {
    try {
      const response = await getDetail(id_kecamatan);
      const reversedData = response.data.reverse(); // Membalikkan urutan data
      setKecamatanData(reversedData);
    } catch (error) {}
  };

  const handleKecamatanPress = (id) => {
    navigate.navigate("DetailKecamatan", { id_kecamatan: id });
  };

  const handleScrollToTop = () => {
    flatListRef.current.scrollToOffset({ offset: 0, animated: true });
  };

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    setShowScrollToTop(offsetX > 0);
  };

  const animateItems = () => {
    slideAnim.setValue(-windowWidth);

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const SWIPE_THRESHOLD = 100;

  const handleSwipeRight = () => {
    const currentIndex = Math.floor(slideAnim._value / -windowWidth);
    if (currentIndex > 0) {
      Animated.timing(slideAnim, {
        toValue: (currentIndex - 1) * -windowWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleSwipeLeft = () => {
    const currentIndex = Math.floor(slideAnim._value / -windowWidth);
    if (currentIndex < kecamatanData.length - 1) {
      Animated.timing(slideAnim, {
        toValue: (currentIndex + 1) * -windowWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5;
      },
      onPanResponderMove: (evt, gestureState) => {
        Animated.event([null, { dx: slideAnim }], { useNativeDriver: false })(
          evt,
          gestureState
        );
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx } = gestureState;
        if (dx > SWIPE_THRESHOLD) {
          handleSwipeRight();
        } else if (dx < -SWIPE_THRESHOLD) {
          handleSwipeLeft();
        } else {
          Animated.timing(slideAnim, {
            toValue: Math.floor(slideAnim._value / -windowWidth) * -windowWidth,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.blogPost,
        { backgroundColor: backgroundColor, shadowColor: textColor },
      ]}
      onPress={() => handleKecamatanPress(item.id)}
      {...panResponder.panHandlers}
    >
      <View style={styles.imageContainer}>
        {item.gambar1 && (
          <Animated.Image
            source={{ uri: `${API_URL}/${item.gambar1}` }}
            style={[
              styles.gambarKecamatan,
              { transform: [{ translateX: slideAnim }] },
            ]}
          />
        )}
      </View>
      <Text style={[styles.title, { color: textColor }]}>Kecamatan:</Text>
      <Text style={[styles.content, { color: textColor }]}>
        {item.nama_kecamatan}
      </Text>
      <Text style={[styles.title, { color: textColor }]}>Bidang:</Text>
      <Text style={[styles.content, { color: textColor }]}>{item.bidang}</Text>
      <Text style={[styles.title, { color: textColor }]}>Judul Pekerjaan:</Text>
      <Text style={[styles.content, { color: textColor }]}>{item.judul}</Text>
      <Text style={[styles.title, { color: textColor }]}>Lokasi:</Text>
      <Text style={[styles.content, { color: textColor }]}>{item.lokasi}</Text>
    </TouchableOpacity>
  );

  if (!kecamatanData) {
    return (
      <View
        style={[
          styles.emptyContainer,
          { backgroundColor: backgroundColor, shadowColor: textColor },
        ]}
      >
        <AntDesign name="frown" size={64} color={textColor} />
        <Text style={[styles.emptyText, { color: textColor }]}>
          Posting Pembangunan tidak ditemukan
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: backgroundColor, shadowColor: textColor },
      ]}
    >
      <FlatList
        ref={flatListRef}
        data={kecamatanData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
      />
      {showScrollToTop && (
        <TouchableOpacity
          style={[
            styles.fab,
            { backgroundColor: textColor, shadowColor: backgroundColor },
          ]}
          onPress={handleScrollToTop}
        >
          <AntDesign name="arrowleft" size={24} color={backgroundColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: windowHeight * 0.02,
    paddingHorizontal: windowWidth * 0.03,
    alignItems: "center",
  },
  blogPost: {
    marginRight: 2,
    marginLeft: 2,
    marginTop: 50,
    height: windowHeight * 0.7,
    width: windowWidth - windowWidth * 0.06,
    borderRadius: windowWidth * 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: windowWidth * 0.04,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: windowHeight * 0.3,
    borderRadius: windowWidth * 0.1,
    overflow: "hidden",
    marginBottom: windowHeight * 0.02,
  },
  gambarKecamatan: {
    flex: 1,
    resizeMode: "cover",
  },
  title: {
    fontSize: windowWidth * 0.04,
    fontWeight: "bold",
    marginBottom: windowHeight * 0.01,
  },
  content: {
    fontSize: windowWidth * 0.035,
    marginBottom: windowHeight * 0.02,
  },
  fab: {
    position: "absolute",
    bottom: windowHeight * 0.05,
    right: windowWidth * 0.05,
    borderRadius: windowWidth * 0.14,
    width: windowWidth * 0.14,
    height: windowWidth * 0.14,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
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
});

export default DetailPage;
