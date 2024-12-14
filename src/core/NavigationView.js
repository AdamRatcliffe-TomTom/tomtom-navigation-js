import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, batch } from "react-redux";
import { ThemeProvider } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { useGeolocated } from "react-geolocated";
import NavigationContextProvider from "./NavigationContext";
import NoApiKeyMessage from "./NoApiKeyMessage";
import { LayersProvider } from "../features/map/hooks/LayersContext";
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
  setShowETAPanel,
  setShowGuidancePanel,
  setShowArrivalPanel,
  setShowContinueButton,
  setContinueButtonText
} from "../features/navigation/navigationSlice";

function NavigationView({
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
  guidanceVoicePlaybackRate = 1,
  simulationOptions = {},
  mapOptions = {},
  mapStyles = {},
  initialCenter,
  initialZoom,
  routeWaypoints,
  routeOptions = {},
  automaticRouteCalculation,
  arriveNorth = true,
  safeAreaInsets,
  showSearch = false,
  searchPosition,
  showETAPanel = true,
  showGuidancePanel = true,
  showArrivalPanel = true,
  showContinueButton = false,
  continueButtonText = strings.continueWalking,
  routeData,
  renderLayers,
  renderETAPanel,
  renderArrivalPanel,
  onMapReady = () => {},
  onRouteUpdated = () => {},
  onNavigationStarted = () => {},
  onNavigationStopped = () => {},
  onProgressUpdate = () => {},
  onDestinationReached = () => {},
  onNavigationContinue = () => {},
  onComponentExit = () => {}
}) {
  strings.setLanguage(language);

  const dispatch = useDispatch();
  const [preCalculatedRoute, setPreCalculatedRoute] = useState();
  const { isGeolocationAvailable, isGeolocationEnabled } = useGeolocated();
  const mergedSafeAreaInsets = useMemo(
    () => ({
      ...DEFAULT_SAFE_AREA_INSETS,
      ...safeAreaInsets
    }),
    [DEFAULT_SAFE_AREA_INSETS, safeAreaInsets]
  );
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
    batch(() => {
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
    });
  }, [
    automaticRouteCalculation,
    language,
    JSON.stringify(routeOptions),
    JSON.stringify(routeWaypoints)
  ]);

  useEffect(() => {
    dispatch(setShowETAPanel(showETAPanel));
  }, [showETAPanel]);

  useEffect(() => {
    dispatch(setShowGuidancePanel(showGuidancePanel));
  }, [showGuidancePanel]);

  useEffect(() => {
    dispatch(setShowContinueButton(showContinueButton));
  }, [showContinueButton]);

  useEffect(() => {
    dispatch(setContinueButtonText(continueButtonText));
  }, [showContinueButton]);

  useEffect(() => {
    dispatch(setShowArrivalPanel(showArrivalPanel));
  }, [showArrivalPanel]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (routeData) {
        if (typeof routeData === "string") {
          try {
            const response = await fetch(routeData);
            if (!response.ok) {
              throw new Error(`HTTP error. Status: ${response.status}`);
            }
            const route = await response.json();
            setPreCalculatedRoute(route);
          } catch (error) {
            console.error("Error fetching static route:", error);
          }
        } else if (typeof routeData === "object" && routeData !== null) {
          setPreCalculatedRoute(routeData);
        } else {
          console.error("Invalid routeData: Expected a string or an object.");
          setPreCalculatedRoute(null);
        }
      } else {
        setPreCalculatedRoute(null);
      }
    };

    fetchRoute();
  }, [routeData]);

  useEffect(() => {
    if (preCalculatedRoute && preCalculatedRoute.type === "FeatureCollection") {
      const pointFeatures = preCalculatedRoute.features.filter(
        (feature) => feature.geometry.type === "Point"
      );

      if (pointFeatures.length > 0) {
        dispatch(
          setRouteOptions({
            locations: pointFeatures
          })
        );
      }
    }
  }, [preCalculatedRoute, dispatch]);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <NavigationContextProvider
        apiKey={apiKey}
        language={language}
        measurementSystem={measurementSystem}
        width={width}
        height={height}
        guidanceVoice={guidanceVoice}
        guidanceVoiceVolume={guidanceVoiceVolume}
        guidanceVoicePlaybackRate={guidanceVoicePlaybackRate}
        theme={theme}
        mapStyles={mapStyles}
        safeAreaInsets={mergedSafeAreaInsets}
      >
        <div className="TomTomNavigation" style={style}>
          <LayersProvider>
            <Map
              renderLayers={renderLayers}
              preCalculatedRoute={preCalculatedRoute}
              onMapReady={onMapReady}
              onRouteUpdated={onRouteUpdated}
              onComponentExit={onComponentExit}
              {...mapOptions}
            >
              {showSearch && <Search position={searchPosition} />}
              <Navigation
                simulationOptions={simulationOptions}
                arriveNorth={arriveNorth}
                renderETAPanel={renderETAPanel}
                renderArrivalPanel={renderArrivalPanel}
                preCalculatedRoute={preCalculatedRoute}
                onNavigationStarted={onNavigationStarted}
                onNavigationStopped={onNavigationStopped}
                onProgressUpdate={onProgressUpdate}
                onDestinationReached={onDestinationReached}
                onNavigationContinue={onNavigationContinue}
              />
            </Map>
          </LayersProvider>
        </div>
        {!apiKey && <NoApiKeyMessage />}
        <GeolocationDialog
          isGeolocationAvailable={isGeolocationAvailable}
          isGeolocationEnabled={isGeolocationEnabled}
          onToggleHide={toggleHideGeolocationDialog}
          hidden={hideGeolocationDialog}
        />
        {children}
      </NavigationContextProvider>
    </ThemeProvider>
  );
}

export default NavigationView;
