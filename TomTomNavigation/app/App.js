import React, { useEffect, useState } from "react";
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
  setShowContinueButton,
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
  showContinueButton,
  routeUrl,
  onNavigationStarted,
  onNavigationStopped,
  onProgressUpdate,
  onDestinationReached,
  onNavigationContinue
}) {
  strings.setLanguage(language);

  const dispatch = useDispatch();
  const [preCalculatedRoute, setPreCalculatedRoute] = useState();
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
    dispatch(setShowContinueButton(showContinueButton));
  }, [showContinueButton]);

  useEffect(() => {
    dispatch(setShowArrivalPanel(showArrivalPanel));
  }, [showArrivalPanel]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!routeUrl) return;

      try {
        const response = await fetch(routeUrl);
        if (!response.ok) {
          throw new Error(`HTTP error. Status: ${response.status}`);
        }
        const route = await response.json();
        setPreCalculatedRoute(route);
      } catch (error) {
        console.error("Error fetching static route:", error);
      }
    };
    fetchRoute();
  }, [routeUrl]);

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
          <Map preCalculatedRoute={preCalculatedRoute} {...mapOptions}>
            <Navigation
              preCalculatedRoute={preCalculatedRoute}
              onNavigationStarted={onNavigationStarted}
              onNavigationStopped={onNavigationStopped}
              onProgressUpdate={onProgressUpdate}
              onDestinationReached={onDestinationReached}
              onNavigationContinue={onNavigationContinue}
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
