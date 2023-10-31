import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import add from "date-fns/add";
import { withMap } from "react-tomtom-maps";
import { useAppContext } from "../../app/AppContext";
import NavigationPanel from "./NavigationPanel";
import Simulator from "./Simulator";
import { useCalculateRouteQuery } from "../../services/routing";
import shouldAnimateCamera from "../../functions/shouldAnimateCamera";
import geoJsonBounds from "../../functions/geoJsonBounds";
import tomtom2mapbox from "../../functions/tomtom2mapbox";

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
  setIsNavigating,
  setNavigationModeTransitioning,
  setCurrentLocation,
  setDistanceRemaining,
  setTimeRemaining,
  setEta,
  clearCurrentLocation
} from "../navigation/navigationSlice";

const Navigation = ({ map }) => {
  const dispatch = useDispatch();
  const { apiKey, simulationSpeed } = useAppContext();
  const showNavigationPanel = useSelector(getShowNavigationPanel);
  const isNavigating = useSelector(getIsNavigating);
  const navigationModeTransitioning = useSelector(
    getNavigationModeTransitioning
  );
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

  useEffect(() => {
    if (route) {
      const navigationRoute = tomtom2mapbox(route.features[0]);
      setNavigationRoute(navigationRoute);

      const { lengthInMeters, travelTimeInSeconds } =
        route.features[0].properties.summary;
      const eta = add(new Date(), { seconds: travelTimeInSeconds });

      batch(() => {
        dispatch(setDistanceRemaining(lengthInMeters));
        dispatch(setTimeRemaining(travelTimeInSeconds));
        dispatch(setEta(eta));
      });
    }
  }, [route]);

  const handleStartNavigation = () => {
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
          zoom: 18
        })
      );
    });

    // Make map non-interactive when navigating
    setMapInteractive(false);

    map.once("moveend", () => dispatch(setNavigationModeTransitioning(false)));
  };

  const handleStopNavigation = () => {
    const bounds = geoJsonBounds(route);

    batch(() => {
      dispatch(setIsNavigating(false));
      dispatch(setNavigationModeTransitioning(true));
      dispatch(clearCurrentLocation());
      dispatch(setFitBoundsOptions({ animate: true }));
      dispatch(
        setCamera({
          pitch: 0,
          zoom: undefined
        })
      );
      dispatch(setBounds(bounds));
    });

    // Restore map interaction
    setMapInteractive(true);

    map.once("moveend", () => dispatch(setNavigationModeTransitioning(false)));
  };

  const setMapInteractive = (interactive) =>
    (map.__om._canvas.style.pointerEvents = interactive ? "all" : "none");

  const handleSimulatorUpdate = (event) => {
    const { stepCoords, stepTime } = event;
    const elapsedTime = Math.floor(stepTime / 1000);

    dispatch(setCurrentLocation({ location: stepCoords, elapsedTime, route }));
  };

  return (
    <>
      {showNavigationPanel && (
        <NavigationPanel
          route={route}
          onStartNavigation={handleStartNavigation}
          onStopNavigation={handleStopNavigation}
        />
      )}
      {navigationRoute && isNavigating && !navigationModeTransitioning && (
        <Simulator
          route={navigationRoute}
          maneuvers={[
            {
              type: ["arrive"],
              buffer: 0.0621371,
              zoom: 16,
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
          speed={simulationSpeed}
          onUpdate={handleSimulatorUpdate}
        />
      )}
    </>
  );
};

export default withMap(Navigation);
