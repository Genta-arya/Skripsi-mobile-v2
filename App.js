import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./utils/navigation";
import { ThemeProvider } from "./view/Theme/Theme";

const App = () => {

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
