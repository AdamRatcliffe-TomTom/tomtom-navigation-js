import React from "react";
import { Provider as StoreProvider } from "react-redux";
import { store } from "./app/store";
import App from "./app/App";
import { lightTheme, darkTheme } from "./app/themes";
import useTextStyles from "./hooks/useTextStyles";
import useButtonStyles from "./hooks/useButtonStyles";
import { calculateDeviceType } from "./app/AppContext";

import "./css/TomTomNavigation.css";

function Navigation(props) {
  return (
    <StoreProvider store={store}>
      <App {...props} />
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
