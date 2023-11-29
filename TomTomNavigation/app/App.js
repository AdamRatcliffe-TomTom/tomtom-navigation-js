import React, { useEffect } from "react";
import { useDispatch, batch } from "react-redux";
import { ThemeProvider, makeStyles } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { Provider as StoreProvider } from "react-redux";
import { useGeolocated } from "react-geolocated";
import { store } from "./store";
import AppContextProvider from "./AppContext";
import NoApiKeyMessage from "./NoApiKeyMessage";
import Map from "../features/map/Map";
import Navigation from "../features/navigation/Navigation";
import LocationDialog from "./LocationDialog";
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
  setShowBottomPanel,
  setShowGuidancePanel,
  setShowArrivalPanel,
  resetNavigation
} from "../features/navigation/navigationSlice";

const useStyles = makeStyles({
  wrapper: {
    position: "relative"
  }
});

// Use the wrapper to save shared state to the store
function Wrapper({
  initialCenter,
  initialZoom,
  routeOptions,
  automaticRouteCalculation,
  showBottomPanel,
  showGuidancePanel,
  showArrivalPanel,
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
    dispatch(setShowBottomPanel(showBottomPanel));
  }, [showBottomPanel]);

  useEffect(() => {
    dispatch(setShowGuidancePanel(showGuidancePanel));
  }, [showGuidancePanel]);

  useEffect(() => {
    dispatch(setShowArrivalPanel(showArrivalPanel));
  }, [showArrivalPanel]);

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
        >
          <Wrapper {...otherProps}>
            <Map {...mapOptions}>
              <Navigation />
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
