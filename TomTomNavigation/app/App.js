import React, { useEffect } from "react";
import { useDispatch, batch } from "react-redux";
import { ThemeProvider } from "@fluentui/react";
import { Provider as StoreProvider } from "react-redux";
import { store } from "./store";
import AppContextProvider from "./AppContext";
import Map from "../features/map/Map";
import Navigation from "../features/navigation/Navigation";
import strings from "../config/strings";

import {
  setCenter,
  setZoom,
  setRouteOptions,
  setAutomaticRouteCalculation
} from "../features/map/mapSlice";

import { setShowNavigationPanel } from "../features/navigation/navigationSlice";

const darkTheme = {
  semanticColors: {
    bodyText: "#fff"
  },
  palette: {
    white: "#18212A",
    black: "#fff"
  }
};

// Use the wrapper to save shared state to the store
function Wrapper({
  initialCenter,
  initialZoom,
  routeOptions,
  automaticRouteCalculation,
  showNavigationPanel,
  children
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    batch(() => {
      if (initialCenter) dispatch(setCenter(initialCenter));
      if (initialZoom) dispatch(setZoom(initialZoom));
    });
  }, []);

  useEffect(() => {
    dispatch(setAutomaticRouteCalculation(automaticRouteCalculation));
    dispatch(setRouteOptions(routeOptions));
  }, [automaticRouteCalculation, JSON.stringify(routeOptions)]);

  useEffect(() => {
    dispatch(setShowNavigationPanel(showNavigationPanel));
  }, [showNavigationPanel]);

  return <div className="TomTomNavigation">{children}</div>;
}

function App({
  apiKey,
  theme,
  language,
  width,
  height,
  simulationSpeed,
  mapOptions,
  ...otherProps
}) {
  strings.setLanguage(language);

  return (
    <StoreProvider store={store}>
      <ThemeProvider {...(theme === "dark" && { theme: darkTheme })}>
        <AppContextProvider
          apiKey={apiKey}
          language={language}
          width={width}
          height={height}
          simulationSpeed={simulationSpeed}
          theme={theme}
        >
          <Wrapper {...otherProps}>
            <Map {...mapOptions}>
              <Navigation />
            </Map>
          </Wrapper>
        </AppContextProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}

export default App;
