import React, { useEffect } from "react";
import { useDispatch, batch } from "react-redux";
import { ThemeProvider } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { useGeolocated } from "react-geolocated";
import AppContextProvider from "./AppContext";
import NoApiKeyMessage from "./NoApiKeyMessage";
import Map from "../features/map/Map";
import Navigation from "../features/navigation/Navigation";
import GeolocationDialog from "./GeolocationDialog";
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
  showArrivalPanel,
  onNavigationStarted,
  onNavigationStopped,
  onProgressUpdate,
  onDestinationReached
}) {
  strings.setLanguage(language);

  const dispatch = useDispatch();
  const { isGeolocationAvailable, isGeolocationEnabled } = useGeolocated();
  const [hideGeolocationDialog, { toggle: toggleHideGeolocationDialog }] =
    useBoolean(true);

  useEffect(() => {
    if (!isGeolocationAvailable || !isGeolocationEnabled) {
      toggleHideGeolocationDialog();
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
        <div className="TomTomNavigation">
          <Map {...mapOptions}>
            <Navigation
              onNavigationStarted={onNavigationStarted}
              onNavigationStopped={onNavigationStopped}
              onProgressUpdate={onProgressUpdate}
              onDestinationReached={onDestinationReached}
            />
          </Map>
        </div>
        {!apiKey && <NoApiKeyMessage />}
        <GeolocationDialog
          isGeolocationAvailable={isGeolocationAvailable}
          isGeolocationEnabled={isGeolocationEnabled}
          onToggleHide={toggleHideGeolocationDialog}
          hidden={hideGeolocationDialog}
        />
      </AppContextProvider>
    </ThemeProvider>
  );
}

export default App;
