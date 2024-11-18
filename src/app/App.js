import React, { useEffect, useState } from "react";
import { useDispatch, batch } from "react-redux";
import { ThemeProvider } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { useGeolocated } from "react-geolocated";
import AppContextProvider from "./AppContext";
import NoApiKeyMessage from "./NoApiKeyMessage";
import Map from "../features/map/Map";
import Search from "../features/search/Search";
import Navigation from "../features/navigation/Navigation";
import GeolocationDialog from "./GeolocationDialog";
import getSectionTypesForTravelMode from "../functions/getSectionTypesForTravelMode";
import detectColorScheme from "../functions/detectColorScheme";
import { lightTheme, darkTheme } from "./themes";
import strings from "../config/strings";

import { DEFAULT_SAFE_AREA_INSETS } from "../config";

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
  children,
  style,
  apiKey,
  theme = detectColorScheme(),
  language = "en-US",
  measurementSystem = "auto",
  width = 100,
  height = 100,
  guidanceVoice,
  guidanceVoiceVolume,
  simulationSpeed = "3x",
  mapOptions = {},
  initialCenter,
  initialZoom,
  routeWaypoints,
  routeOptions = {},
  automaticRouteCalculation,
  safeAreaInsets,
  showSearch = false,
  searchPosition,
  showBottomPanel = true,
  showGuidancePanel = true,
  showArrivalPanel = true,
  showContinueButton = false,
  routeUrl,
  onNavigationStarted = () => {},
  onNavigationStopped = () => {},
  onProgressUpdate = () => {},
  onDestinationReached = () => {},
  onNavigationContinue = () => {}
}) {
  strings.setLanguage(language);

  const dispatch = useDispatch();
  const [preCalculatedRoute, setPreCalculatedRoute] = useState();
  const { isGeolocationAvailable, isGeolocationEnabled } = useGeolocated();
  const [hideGeolocationDialog, { toggle: toggleHideGeolocationDialog }] =
    useBoolean(true);

  const mergedSafeAreaInsets = {
    ...DEFAULT_SAFE_AREA_INSETS,
    ...safeAreaInsets
  };

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
        language,
        ...routeOptions,
        locations: routeWaypoints,
        sectionType: getSectionTypesForTravelMode(routeOptions.travelMode)
      })
    );
    dispatch(setMovingMethod("jumpTo"));
  }, [
    automaticRouteCalculation,
    language,
    JSON.stringify(routeOptions),
    JSON.stringify(routeWaypoints)
  ]);

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
      if (routeUrl) {
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
      } else {
        setPreCalculatedRoute(null);
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
        safeAreaInsets={mergedSafeAreaInsets}
      >
        <div className="TomTomNavigation" style={style}>
          <Map preCalculatedRoute={preCalculatedRoute} {...mapOptions}>
            {showSearch && <Search position={searchPosition} />}
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
        {children}
      </AppContextProvider>
    </ThemeProvider>
  );
}

export default App;
