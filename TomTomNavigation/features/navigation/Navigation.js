import tt from "@tomtom-international/web-sdk-maps";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import add from "date-fns/add";
import { withMap } from "react-tomtom-maps";
import { useAppContext } from "../../app/AppContext";
import useSelectorRef from "../../hooks/useSelectorRef";
import useSpeech from "../../hooks/useMicrosoftSpeech";
import BottomPanel from "./BottomPanel";
import NavigationGuidancePanel from "./NavigationGuidancePanel";
import Simulator from "./Simulator";
import { useCalculateRouteQuery } from "../../services/routing";
import shouldAnimateCamera from "../../functions/shouldAnimateCamera";
import geoJsonBounds from "../../functions/geoJsonBounds";
import tomtom2mapbox from "../../functions/tomtom2mapbox";
import fireEvent from "../../functions/fireEvent";
import NavigationPerspectives from "../../constants/NavigationPerspectives";
import ComponentEvents from "../../constants/ComponentEvents";
import NavigationStates from "../../constants/NavigationStates";
import strings from "../../config/strings";

import {
  getRouteOptions,
  getAutomaticRouteCalculation,
  getViewTransitioning,
  setCamera,
  setBounds,
  setPitch,
  setFitBoundsOptions,
  setViewTransitioning
} from "../map/mapSlice";

import {
  getShowBottomPanel,
  getShowGuidancePanel,
  getIsNavigating,
  getNavigationPerspective,
  getHasReachedDestination,
  getCurrentLocation,
  getLastInstruction,
  getVoiceAnnouncementsEnabled,
  setIsNavigating,
  setNavigationPerspective,
  setCurrentLocation,
  setDistanceRemaining,
  setTimeRemaining,
  setEta,
  setHasReachedDestination,
  resetNavigation
} from "../navigation/navigationSlice";

const Navigation = ({ map, onNavigationStateChange }) => {
  const dispatch = useDispatch();
  const { speechAvailable, getVoiceForLanguage, speak } = useSpeech();
  const {
    apiKey,
    simulationSpeed,
    height,
    language,
    measurementSystem,
    guidanceVoice,
    guidanceVoiceVolume
  } = useAppContext();
  const showBottomPanel = useSelector(getShowBottomPanel);
  const showGuidancePanel = useSelector(getShowGuidancePanel);
  const isNavigating = useSelector(getIsNavigating);
  const viewTransitioning = useSelector(getViewTransitioning);
  const navigationPerspectiveRef = useSelectorRef(getNavigationPerspective).at(
    1
  );
  const hasReachedDestination = useSelector(getHasReachedDestination);
  const { announcement } = useSelector(getCurrentLocation);
  const lastInstructionRef = useSelectorRef(getLastInstruction).at(1);
  const [voiceAnnouncementsEnabled, voiceAnnouncementsEnabledRef] =
    useSelectorRef(getVoiceAnnouncementsEnabled);
  const routeOptions = useSelector(getRouteOptions);
  const destination = routeOptions.locations.at(-1);
  const automaticRouteCalculation = useSelector(getAutomaticRouteCalculation);
  const { data: { route } = {} } = useCalculateRouteQuery(
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
  const guidancePanelIsVisible =
    showGuidancePanel && isNavigating && !hasReachedDestination;
  const bottomPanelIsVisible = showBottomPanel;
  const simulatorIsActive = navigationRoute && isNavigating;

  useEffect(() => {
    if (route) {
      if (isNavigating) {
        stopNavigation();
      }

      const navigationRoute = tomtom2mapbox(route.features[0]);
      setNavigationRoute(navigationRoute);
      setETA();
    }
  }, [route]);

  useEffect(() => {
    if (speechAvailable && voiceAnnouncementsEnabled && announcement) {
      const voice = getGuidanceVoice();
      speak({ voice, text: announcement.text, volume: guidanceVoiceVolume });
    }
  }, [announcement, voiceAnnouncementsEnabled]);

  const setETA = () => {
    const { lengthInMeters, travelTimeInSeconds } =
      route.features[0].properties.summary;
    const eta = add(new Date(), {
      seconds: travelTimeInSeconds
    }).toISOString();

    batch(() => {
      dispatch(setDistanceRemaining(lengthInMeters));
      dispatch(setTimeRemaining(travelTimeInSeconds));
      dispatch(setEta(eta));
    });
  };

  const startNavigation = () => {
    // Center the map on the first coordinate of the route
    const routeCoordinates = route.features[0].geometry.coordinates;
    const center = routeCoordinates[0];
    const movingMethod = shouldAnimateCamera(map.getBounds(), center)
      ? "flyTo"
      : "jumpTo";

    // Make map non-interactive when navigating
    setMapInteractive(false);

    batch(() => {
      dispatch(setViewTransitioning(true));
      dispatch(setIsNavigating(true));
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

    map.once("moveend", () => dispatch(setViewTransitioning(false)));

    if (speechAvailable && voiceAnnouncementsEnabledRef?.current) {
      const voice = getGuidanceVoice();
      const announcement = strings.DEPART;
      speak({ voice, text: announcement, volume: guidanceVoiceVolume });
    }

    fireEvent(ComponentEvents.navigation_started);
    onNavigationStateChange(NavigationStates.NAVIGATION_STARTED);
  };

  const stopNavigation = () => {
    const bounds = geoJsonBounds(route);

    // Reset the map's field of view padding
    map.__om.setPadding({ top: 0 });

    batch(() => {
      dispatch(setViewTransitioning(true));
      dispatch(resetNavigation());
      dispatch(setPitch(0));
      dispatch(setFitBoundsOptions({ animate: true }));
      dispatch(setBounds(bounds));

      // Reset the ETA
      setETA();
    });

    map.once("moveend", () => dispatch(setViewTransitioning(false)));

    // Restore map interaction
    setMapInteractive(true);

    fireEvent(ComponentEvents.navigation_stopped);
    onNavigationStateChange(NavigationStates.NAVIGATION_STOPPED);
  };

  const setMapInteractive = (interactive) =>
    (map.__om._canvas.style.pointerEvents = interactive ? "all" : "none");

  const handleSimulatorUpdate = (event) => {
    if (viewTransitioning) {
      return;
    }

    const { pitch, zoom, stepCoords, stepBearing, stepTime, duration } = event;
    const elapsedTime = Math.floor(stepTime / 1000);

    batch(() => {
      if (navigationPerspectiveRef.current === NavigationPerspectives.DRIVING) {
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
          measurementSystem,
          language
        })
      );
    });

    fireEvent(ComponentEvents.progress_update, {
      progress: {
        coordinates: stepCoords,
        bearing: stepBearing,
        elapsedTime
      }
    });
  };

  const handleSimulatorEnd = () => {
    const { coordinates } = route.features[0].geometry;
    const lastCoordinate = coordinates[coordinates.length - 1];
    const bounds = new tt.LngLatBounds(lastCoordinate, lastCoordinate);
    bounds.extend(destination.coordinates);

    // Reset the map's field of view padding
    map.__om.setPadding({ top: 0 });

    batch(() => {
      dispatch(setViewTransitioning(true));
      dispatch(setHasReachedDestination(true));
      dispatch(setNavigationPerspective(NavigationPerspectives.ROUTE_OVERVIEW));
      dispatch(
        setFitBoundsOptions({
          animate: true,
          pitch: 0,
          duration: 500,
          maxZoom: 18,
          padding: { top: 100, right: 100, bottom: 240, left: 100 }
        })
      );
      dispatch(setBounds(bounds.toArray()));
    });

    map.once("moveend", () => dispatch(setViewTransitioning(false)));

    if (speechAvailable && voiceAnnouncementsEnabledRef?.current) {
      const voice = getGuidanceVoice();
      const instruction = lastInstructionRef?.current;

      if (instruction) {
        const announcement = strings[instruction.maneuver];
        speak({ voice, text: announcement, volume: guidanceVoiceVolume });
      }
    }

    fireEvent(ComponentEvents.destination_reached, { destination });
    onNavigationStateChange(NavigationStates.DESTINATION_REACHED);
  };

  const getGuidanceVoice = () =>
    guidanceVoice || getVoiceForLanguage(language) || "en-US-JennyNeural";

  return (
    <>
      {guidancePanelIsVisible && <NavigationGuidancePanel route={route} />}
      {bottomPanelIsVisible && (
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
