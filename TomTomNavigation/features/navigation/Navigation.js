import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import add from "date-fns/add";
import { withMap } from "react-tomtom-maps";
import { useAppContext } from "../../app/AppContext";
import useSelectorRef from "../../hooks/useSelectorRef";
import useSpeech from "../../hooks/useMicrosoftSpeech";
import BottomPanel from "./BottomPanel";
import NextInstructionPanel from "./NextInstructionPanel";
import Simulator from "./Simulator";
import { useCalculateRouteQuery } from "../../services/routing";
import shouldAnimateCamera from "../../functions/shouldAnimateCamera";
import geoJsonBounds from "../../functions/geoJsonBounds";
import tomtom2mapbox from "../../functions/tomtom2mapbox";
import NavigationPerspectives from "../../constants/NavigationPerspectives";
import strings from "../../config/strings";

import {
  getRouteOptions,
  getAutomaticRouteCalculation,
  setCamera,
  setBounds,
  setPitch,
  setFitBoundsOptions
} from "../map/mapSlice";

import {
  getShowBottomPanel,
  getShowNIP,
  getIsNavigating,
  getNavigationTransitioning,
  getNavigationPerspective,
  getCurrentLocation,
  getLastInstruction,
  getVoiceAnnouncementsEnabled,
  setIsNavigating,
  setNavigationTransitioning,
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
  const {
    apiKey,
    simulationSpeed,
    height,
    language,
    measurementSystem,
    guidanceVoice
  } = useAppContext();
  const showBottomPanel = useSelector(getShowBottomPanel);
  const showNIP = useSelector(getShowNIP);
  const isNavigating = useSelector(getIsNavigating);
  const navigationTransitioning = useSelector(getNavigationTransitioning);
  const navigationPerspective = useSelector(getNavigationPerspective);
  const { announcement } = useSelector(getCurrentLocation);
  const [_, lastInstructionRef] = useSelectorRef(getLastInstruction);
  const [voiceAnnouncementsEnabled, voiceAnnouncementsEnabledRef] =
    useSelectorRef(getVoiceAnnouncementsEnabled);
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
  const nipIsVisible = showNIP && isNavigating;
  const simulatorIsActive = navigationRoute && isNavigating;

  useEffect(() => {
    if (route) {
      if (isNavigating) {
        stopNavigation();
      }

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
    if (speechAvailable && voiceAnnouncementsEnabled && announcement) {
      const voice = getGuidanceVoice();
      speak({ voice, text: announcement.text });
    }
  }, [announcement, voiceAnnouncementsEnabled]);

  const startNavigation = () => {
    // Center the map on the first coordinate of the route
    const routeCoordinates = route.features[0].geometry.coordinates;
    const center = routeCoordinates[0];
    const movingMethod = shouldAnimateCamera(map.getBounds(), center)
      ? "flyTo"
      : "jumpTo";

    // Make map non-interactive when navigating
    setMapInteractive(false);

    map.once("moveend", () => dispatch(setNavigationTransitioning(false)));

    batch(() => {
      dispatch(setIsNavigating(true));
      dispatch(setNavigationTransitioning(true));
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
  };

  const stopNavigation = () => {
    const bounds = geoJsonBounds(route);

    map.once("moveend", () => dispatch(setNavigationTransitioning(false)));
    map.__om.setPadding({ top: 0 });

    batch(() => {
      dispatch(resetNavigation());
      dispatch(setNavigationTransitioning(true));
      dispatch(setPitch(0));
      dispatch(setFitBoundsOptions({ animate: true }));
      dispatch(setBounds(bounds));
    });

    // Restore map interaction
    setMapInteractive(true);
  };

  const setMapInteractive = (interactive) =>
    (map.__om._canvas.style.pointerEvents = interactive ? "all" : "none");

  const handleSimulatorUpdate = (event) => {
    if (navigationTransitioning) {
      return;
    }

    const { pitch, zoom, stepCoords, stepBearing, stepTime, duration } = event;
    const elapsedTime = Math.floor(stepTime / 1000);

    batch(() => {
      if (navigationPerspective === NavigationPerspectives.DRIVING) {
        dispatch(
          setCamera({
            movingMethod: "easeTo",
            center: stepCoords,
            zoom,
            pitch,
            bearing: stepBearing,
            animationOptions: {
              duration,
              padding: { top: navigationPaddingTop }
            }
          })
        );
      }

      dispatch(
        setCurrentLocation({
          location: stepCoords,
          bearing: stepBearing,
          elapsedTime,
          route,
          measurementSystem
        })
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

    if (speechAvailable && voiceAnnouncementsEnabledRef?.current) {
      const voice = getGuidanceVoice();
      const instruction = lastInstructionRef?.current;

      if (instruction) {
        const announcement = strings[instruction.maneuver];
        speak({ voice, text: announcement });
      }
    }
  };

  const getGuidanceVoice = () =>
    guidanceVoice || getVoiceForLanguage(language) || "en-US-JennyNeural";

  return (
    <>
      {nipIsVisible && <NextInstructionPanel route={route} />}
      {showBottomPanel && (
        <BottomPanel
          route={route}
          onStartNavigation={startNavigation}
          onStopNavigation={stopNavigation}
        />
      )}
      {simulatorIsActive && (
        <Simulator
          route={navigationRoute}
          zoom={17}
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
