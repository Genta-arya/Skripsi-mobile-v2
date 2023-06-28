import React, { useContext, useState, useEffect } from "react";
import { View, Text, Switch, Animated, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ThemeContext } from "../Theme/Theme";
import { ThemeProvider } from "@react-navigation/native";

const Setting = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [starsAnimation] = useState([...Array(10)].map(() => new Animated.Value(0)));

  const handleToggleTheme = () => {
    setIsLoading(true);
  };

  useEffect(() => {
    if (isLoading) {
      startAnimation();
    }
  }, [isLoading]);

  const startAnimation = () => {
    Animated.parallel([
      Animated.timing(animation, {
        toValue: isDarkMode ? 1 : 0,
        duration: 3000,
        useNativeDriver: true,
      }),
      ...starsAnimation.map((starAnim) =>
        Animated.timing(starAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ),
    ]).start(() => {
      toggleTheme();
      setIsLoading(false);
    });
  };

  const sunRotationInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["1200deg", "180deg"],
  });

  const moonRotationInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "0deg"],
  });

  const sunIconStyle = {
    transform: [{ rotate: sunRotationInterpolate }],
  };

  const moonIconStyle = {
    transform: [{ rotate: moonRotationInterpolate }],
  };

  const containerStyle = {
    backgroundColor: isDarkMode ? "black" : "white",
  };

  const textStyle = {
    color: isDarkMode ? "white" : "black",
  };

  const modeText = isDarkMode ? "Nonakftifkan Mode Gelap" : "Aktifkan Mode Gelap";

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.title, textStyle]}>{modeText}</Text>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <View style={styles.loader}>
            <Animated.View style={[styles.sunIcon, sunIconStyle]}>
              <FontAwesome name="sun-o" size={120} color="#FFD700" />
            </Animated.View>
            <Animated.View style={[styles.moonIcon, moonIconStyle]}>
              <FontAwesome name="moon-o" size={60} color="#FFD700" />
            </Animated.View>
          </View>
          <View style={styles.starContainer}>
            {starsAnimation.map((starAnim, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.star,
                  {
                    opacity: starAnim,
                    transform: [
                      {
                        translateY: starAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-100, 600],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <FontAwesome name="star" size={20} color="#FFD700" />
              </Animated.View>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.switchContainer}>
          <Switch
            value={isDarkMode}
            onValueChange={handleToggleTheme}
            trackColor={{ false: "#767577", true: "#228B22" }}
            thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 24,
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  sunIcon: {
    position: "absolute",
  },
  moonIcon: {
    position: "absolute",
  },
  starContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  star: {
    position: "absolute",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default () => (
  <ThemeProvider>
    <Setting />
  </ThemeProvider>
);
