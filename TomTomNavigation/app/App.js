import React, { useEffect } from "react";
import { useDispatch, batch } from "react-redux";
import { ThemeProvider, LayerHost, makeStyles } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { Provider as StoreProvider } from "react-redux";
import { useGeolocated } from "react-geolocated";
import { store } from "./store";
import AppContextProvider from "./AppContext";
import NoApiKeyMessage from "../features/map/NoAPIKeyMessage";
import Map from "../features/map/Map";
import Navigation from "../features/navigation/Navigation";
import LocationDialog from "../components/LocationDialog";
import { lightTheme, darkTheme } from "./themes";
import strings from "../config/strings";

import {
  setCenter,
  setZoom,
  setRouteOptions,
  setAutomaticRouteCalculation,
  setMovingMethod
} from "../features/map/mapSlice";

import {
  setShowNavigationPanel,
  resetNavigation
} from "../features/navigation/navigationSlice";

const useStyles = makeStyles({
  wrapper: {
    position: "relative"
  },
  layerHost: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1000,
    pointerEvents: "none"
  }
});

const layerHostId = "map-layer-host";

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
  const classes = useStyles();

  useEffect(() => {
    batch(() => {
      if (initialCenter) dispatch(setCenter(initialCenter));
      if (initialZoom) dispatch(setZoom(initialZoom));
    });
  }, []);

  useEffect(() => {
    dispatch(resetNavigation());
    dispatch(setAutomaticRouteCalculation(automaticRouteCalculation));
    dispatch(setRouteOptions(routeOptions));
    dispatch(setMovingMethod("jumpTo"));
  }, [automaticRouteCalculation, JSON.stringify(routeOptions)]);

  useEffect(() => {
    dispatch(setShowNavigationPanel(showNavigationPanel));
  }, [showNavigationPanel]);

  return (
    <div className={`TomTomNavigation ${classes.wrapper}`}>{children}</div>
  );
}

function App({
  apiKey,
  theme,
  language,
  measurementSystem,
  width,
  height,
  guidanceVoice,
  simulationSpeed,
  mapOptions,
  ...otherProps
}) {
  strings.setLanguage(language);

  const classes = useStyles();
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
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <AppContextProvider
          apiKey={apiKey}
          language={language}
          measurementSystem={measurementSystem}
          width={width}
          height={height}
          guidanceVoice={guidanceVoice}
          simulationSpeed={simulationSpeed}
          theme={theme}
          layerHostId={layerHostId}
        >
          <Wrapper {...otherProps}>
            <Map {...mapOptions}>
              <Navigation />
              <LayerHost
                style={{ width, height }}
                className={classes.layerHost}
                id={layerHostId}
              />
            </Map>
            {!apiKey && <NoApiKeyMessage />}
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
