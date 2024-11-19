import React from "react";
import { Provider as StoreProvider } from "react-redux";
import { store } from "./core/store";
import NavigationView from "./core/NavigationView";
import { lightTheme, darkTheme } from "./core/themes";
import useTextStyles from "./hooks/useTextStyles";
import useButtonStyles from "./hooks/useButtonStyles";
import { calculateDeviceType } from "./core/NavigationContext";

import "./css/TomTomNavigation.css";

function Navigation(props) {
  return (
    <StoreProvider store={store}>
      <NavigationView {...props} />
    </StoreProvider>
  );
}

export {
  lightTheme,
  darkTheme,
  useTextStyles,
  useButtonStyles,
  calculateDeviceType
};

export default Navigation;
