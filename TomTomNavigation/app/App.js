import React from "react";
import { ThemeProvider } from "@fluentui/react";
import { Provider as StoreProvider } from "react-redux";
import { store } from "./store";
import AppContextProvider from "./AppContext";
import Map from "../features/map/Map";

function App({ width, height, ...otherProps }) {
  return (
    <StoreProvider store={store}>
      <ThemeProvider>
        <AppContextProvider width={width} height={height}>
          <div className="TomTomNavigation">
            <Map {...otherProps} />
          </div>
        </AppContextProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}

export default App;
