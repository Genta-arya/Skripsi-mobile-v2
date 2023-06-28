import React, { useEffect, useRef, useContext } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";


import bg from "../../components/src/assets/rsz_image.png";
import { ThemeContext } from "../Theme/Theme";

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const theme = useContext(ThemeContext); // Access the theme from the context

  useEffect(() => {
    const delay = 3000;

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      navigation.navigate("nav");
    }, delay);
    return () => clearTimeout(timeout);
  }, [fadeAnim, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Animated.Image
        source={bg}
        style={[styles.image, { opacity: fadeAnim }]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "75%",
    height: "75%",
    resizeMode: "contain",
  },
});

export default SplashScreen;
