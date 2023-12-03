import React, { useEffect } from "react";
import { useDispatch, batch } from "react-redux";
import { ThemeProvider } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { useGeolocated } from "react-geolocated";
import AppContextProvider from "./AppContext";
import NoApiKeyMessage from "./NoApiKeyMessage";
import Map from "../features/map/Map";
import Navigation from "../features/navigation/Navigation";
import LocationDialog from "./LocationDialog";
import getSectionTypesForTravelMode from "../functions/getSectionTypesForTravelMode";
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

function App({
  apiKey,
  theme,
  language,
  measurementSystem,
  width,
  height,
  guidanceVoice,
  guidanceVoiceVolume,
  simulationSpeed,
  mapOptions,
  initialCenter,
  initialZoom,
  routeOptions,
  automaticRouteCalculation,
  showBottomPanel,
  showGuidancePanel,
  showArrivalPanel
}) {
  strings.setLanguage(language);

  const dispatch = useDispatch();
  const { isGeolocationAvailable, isGeolocationEnabled } = useGeolocated();
  const [hideLocationDialog, { toggle: toggleHideLocationDialog }] =
    useBoolean(true);

  useEffect(() => {
    if (!isGeolocationAvailable || !isGeolocationEnabled) {
      toggleHideLocationDialog();
    }
  }, [isGeolocationAvailable, isGeolocationEnabled]);

  useEffect(() => {
    batch(() => {
      if (initialCenter) dispatch(setCenter(initialCenter));
      if (initialZoom) dispatch(setZoom(initialZoom));
    });
  }, []);

  useEffect(() => {
    dispatch(resetNavigation());
    dispatch(setAutomaticRouteCalculation(automaticRouteCalculation));
    dispatch(
      setRouteOptions({
        ...routeOptions,
        sectionType: getSectionTypesForTravelMode(routeOptions.travelMode)
      })
    );
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
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <AppContextProvider
        apiKey={apiKey}
        language={language}
        measurementSystem={measurementSystem}
        width={width}
        height={height}
        guidanceVoice={guidanceVoice}
        guidanceVoiceVolume={guidanceVoiceVolume}
        simulationSpeed={simulationSpeed}
        theme={theme}
      >
        <Map {...mapOptions}>
          <Navigation />
        </Map>
        {!apiKey && <NoApiKeyMessage />}
        <LocationDialog
          isGeolocationAvailable={isGeolocationAvailable}
          isGeolocationEnabled={isGeolocationEnabled}
          onToggleHide={toggleHideLocationDialog}
          hidden={hideLocationDialog}
        />
      </AppContextProvider>
    </ThemeProvider>
  );
}

export default App;
