import React, { useEffect } from "react";
import { useDispatch, batch } from "react-redux";
import { ThemeProvider } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { Provider as StoreProvider } from "react-redux";
import { useGeolocated } from "react-geolocated";
import { store } from "./store";
import AppContextProvider from "./AppContext";
import Map from "../features/map/Map";
import Navigation from "../features/navigation/Navigation";
import LocationDialog from "../components/LocationDialog";
import strings from "../config/strings";

import {
  setCenter,
  setZoom,
  setRouteOptions,
  setAutomaticRouteCalculation,
  setMovingMethod
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
    dispatch(setMovingMethod("jumpTo"));
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
  measurementSystem,
  width,
  height,
  simulationSpeed,
  mapOptions,
  ...otherProps
}) {
  strings.setLanguage(language);
  const { isGeolocationAvailable, isGeolocationEnabled } = useGeolocated();
  const [hideLocationDialog, { toggle: toggleHideLocationDialog }] =
    useBoolean(true);

  useEffect(() => {
    if (!isGeolocationAvailable || !isGeolocationEnabled) {
      toggleHideLocationDialog();
    }
  }, [isGeolocationAvailable, isGeolocationEnabled]);

  return (
    <StoreProvider store={store}>
      <ThemeProvider {...(theme === "dark" && { theme: darkTheme })}>
        <AppContextProvider
          apiKey={apiKey}
          language={language}
          measurementSystem={measurementSystem}
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
          <LocationDialog
            isGeolocationAvailable={isGeolocationAvailable}
            isGeolocationEnabled={isGeolocationEnabled}
            onToggleHide={toggleHideLocationDialog}
            hidden={hideLocationDialog}
          />
        </AppContextProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}

export default App;
