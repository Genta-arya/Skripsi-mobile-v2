import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tema default
const defaultTheme = {
  isDarkMode: false,
  backgroundColor: "white",
  textColor: "black",
};

// Konteks tema
export const ThemeContext = createContext(defaultTheme);

// Komponen provider tema
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    loadThemeFromStorage();
  }, []);

  const loadThemeFromStorage = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      const parsedTheme = savedTheme ? JSON.parse(savedTheme) : defaultTheme;
      setTheme(parsedTheme);
    } catch (error) {
      
    }
  };

  const saveThemeToStorage = async (newTheme) => {
    try {
      await AsyncStorage.setItem("theme", JSON.stringify(newTheme));
    } catch (error) {
     
    }
  };

  const toggleTheme = () => {
    const newTheme = {
      ...theme,
      isDarkMode: !theme.isDarkMode,
      backgroundColor: theme.isDarkMode ? "white" : "black",
      textColor: theme.isDarkMode ? "black" : "white",
    };
    setTheme(newTheme);
    saveThemeToStorage(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ ...theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
