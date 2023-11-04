import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import add from "date-fns/add";
import { withMap } from "react-tomtom-maps";
import { useAppContext } from "../../app/AppContext";
import useSpeech from "../../hooks/useSpeech";
import NavigationPanel from "./NavigationPanel";
import Simulator from "./Simulator";
import { useCalculateRouteQuery } from "../../services/routing";
import shouldAnimateCamera from "../../functions/shouldAnimateCamera";
import geoJsonBounds from "../../functions/geoJsonBounds";
import tomtom2mapbox from "../../functions/tomtom2mapbox";
import strings from "../../config/strings";

import {
  getRouteOptions,
  getAutomaticRouteCalculation,
  setCamera,
  setBounds,
  setFitBoundsOptions
} from "../map/mapSlice";

import {
  getShowNavigationPanel,
  getIsNavigating,
  getNavigationModeTransitioning,
  getCurrentLocation,
  setIsNavigating,
  setNavigationModeTransitioning,
  setCurrentLocation,
  setDistanceRemaining,
  setTimeRemaining,
  setEta,
  setRemainingRoute,
  setHasReachedDestination,
  resetNavigation
} from "../navigation/navigationSlice";

const Navigation = ({ map }) => {
  const dispatch = useDispatch();
  const { speechAvailable, getVoiceForLanguage, speak } = useSpeech();
  const { apiKey, simulationSpeed, height, language } = useAppContext();
  const showNavigationPanel = useSelector(getShowNavigationPanel);
  const isNavigating = useSelector(getIsNavigating);
  const navigationModeTransitioning = useSelector(
    getNavigationModeTransitioning
  );
  const { announcement } = useSelector(getCurrentLocation);
  const routeOptions = useSelector(getRouteOptions);
  const automaticRouteCalculation = useSelector(getAutomaticRouteCalculation);
  const { data: route } = useCalculateRouteQuery(
    {
      key: apiKey,
      ...routeOptions
    },
    { skip: !automaticRouteCalculation }
  );
  const [navigationRoute, setNavigationRoute] = useState();
  const navigationPaddingTop = useMemo(
    () => Math.max(height - 390, 0),
    [height]
  );

  useEffect(() => {
    if (route) {
      stopNavigation();

      const navigationRoute = tomtom2mapbox(route.features[0]);
      setNavigationRoute(navigationRoute);

      const { lengthInMeters, travelTimeInSeconds } =
        route.features[0].properties.summary;
      const eta = add(new Date(), {
        seconds: travelTimeInSeconds
      }).toISOString();

      batch(() => {
        dispatch(setDistanceRemaining(lengthInMeters));
        dispatch(setTimeRemaining(travelTimeInSeconds));
        dispatch(setEta(eta));
        dispatch(setRemainingRoute(route));
      });
    }
  }, [route]);

  useEffect(() => {
    if (speechAvailable && announcement) {
      const voice = getVoiceForLanguage(language);
      speak({ voice, text: announcement.text });
    }
  }, [announcement]);

  const startNavigation = () => {
    // Center the map on the first coordinate of the route
    const routeCoordinates = route.features[0].geometry.coordinates;
    const center = routeCoordinates[0];
    const movingMethod = shouldAnimateCamera(map.getBounds(), center)
      ? "flyTo"
      : "jumpTo";

    batch(() => {
      dispatch(setIsNavigating(true));
      dispatch(setNavigationModeTransitioning(true));
      dispatch(
        setCamera({
          movingMethod,
          center,
          pitch: 60,
          zoom: 18,
          animationOptions: { padding: { top: navigationPaddingTop } }
        })
      );
    });

    // Make map non-interactive when navigating
    setMapInteractive(false);

    map.once("moveend", () => dispatch(setNavigationModeTransitioning(false)));
  };

  const stopNavigation = () => {
    const bounds = geoJsonBounds(route);

    batch(() => {
      dispatch(resetNavigation());
      dispatch(setNavigationModeTransitioning(true));
      dispatch(setFitBoundsOptions({ animate: true }));
      dispatch(setBounds(bounds));
    });

    // Restore map interaction
    setMapInteractive(true);

    map.once("moveend", () => {
      dispatch(setNavigationModeTransitioning(false));
    });
  };

  const setMapInteractive = (interactive) =>
    (map.__om._canvas.style.pointerEvents = interactive ? "all" : "none");

  const handleSimulatorUpdate = (event) => {
    const { pitch, zoom, stepCoords, stepBearing, stepTime, duration } = event;
    const elapsedTime = Math.floor(stepTime / 1000);

    batch(() => {
      dispatch(
        setCamera({
          movingMethod: "easeTo",
          center: stepCoords,
          zoom,
          pitch,
          bearing: stepBearing,
          animationOptions: { duration, padding: { top: navigationPaddingTop } }
        })
      );
      dispatch(
        setCurrentLocation({ location: stepCoords, elapsedTime, route })
      );
    });
  };

  const handleSimulatorEnd = () => {
    const { coordinates } = route.features[0].geometry;
    const lastCoordinate = coordinates[coordinates.length - 1];

    batch(() => {
      dispatch(setHasReachedDestination(true));
      dispatch(
        setCamera({
          center: lastCoordinate,
          zoom: 18,
          animationOptions: { pitch: 0, duration: 500, padding: { top: 0 } }
        })
      );
    });

    if (speechAvailable) {
      const voice = getVoiceForLanguage(language);
      speak({ voice, text: strings.arrived });
    }
  };

  return (
    <>
      {showNavigationPanel && (
        <NavigationPanel
          route={route}
          onStartNavigation={startNavigation}
          onStopNavigation={stopNavigation}
        />
      )}
      {navigationRoute && isNavigating && !navigationModeTransitioning && (
        <Simulator
          route={navigationRoute}
          maneuvers={[
            {
              type: ["arrive"],
              buffer: 0.0621371,
              zoom: 17.5,
              pitch: 40
            },
            {
              type: ["turn left", "turn right"],
              buffer: 0.0621371,
              zoom: 17.5,
              pitch: 40
            },
            {
              type: ["bear right"],
              buffer: 0.0621371,
              zoom: 17.5,
              pitch: 40
            }
          ]}
          spacing="acceldecel"
          updateCamera={false}
          speed={simulationSpeed}
          onUpdate={handleSimulatorUpdate}
          onEnd={handleSimulatorEnd}
        />
      )}
    </>
  );
};

export default withMap(Navigation);
