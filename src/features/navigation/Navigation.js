import tt from "@tomtom-international/web-sdk-maps";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import CheapRuler from "cheap-ruler";
import { add } from "date-fns";
import { featureCollection, lineString } from "@turf/helpers";
import { withMap } from "react-tomtom-maps";
import { useNavigationContext } from "../../core/NavigationContext";
import useSelectorRef from "../../hooks/useSelectorRef";
import useSpeech from "../../hooks/useMicrosoftSpeech";
import useNavigationRoute from "./hooks/useNavigationRoute";
import useNavigationSimulation from "./hooks/useNavigationSimulation";
import BottomPanel from "./BottomPanel";
import NavigationGuidancePanel from "./NavigationGuidancePanel";
import Simulator from "./Simulator";
import isPedestrianRoute from "../../functions/isPedestrianRoute";
import fireEvent from "../../functions/fireEvent";
import NavigationPerspectives from "../../constants/NavigationPerspectives";
import ControlEvents from "../../constants/ControlEvents";
import strings from "../../config/strings";

import {
  getRouteOptions,
  getAutomaticRouteCalculation,
  getViewTransitioning,
  setCamera,
  setBounds,
  setFitBoundsOptions,
  setViewTransitioning
} from "../map/mapSlice";

import {
  getShowGuidancePanel,
  getIsNavigating,
  getNavigationPerspective,
  getHasReachedDestination,
  getSimulationShouldEnd,
  getCurrentLocation,
  getLastInstruction,
  getVoiceAnnouncementsEnabled,
  setNavigationPerspective,
  setCurrentLocation,
  setDistanceRemaining,
  setTimeRemaining,
  setEta,
  setHasReachedDestination,
  setSimulationShouldEnd
} from "../navigation/navigationSlice";

import {
  TABLET_PANEL_WIDTH,
  ARRIVAL_PANEL_HEIGHT,
  FIT_BOUNDS_PADDING_TOP,
  FIT_BOUNDS_PADDING_RIGHT,
  FIT_BOUNDS_PADDING_LEFT,
  VEHICLE_NAVIGATION_SIMULATION_ZOOM,
  PEDESTRIAN_NAVIGATION_SIMULATION_ZOOM
} from "../../config";

const Navigation = ({
  map,
  preCalculatedRoute,
  onNavigationStarted,
  onNavigationStopped,
  onProgressUpdate,
  onDestinationReached,
  onNavigationContinue
}) => {
  const dispatch = useDispatch();
  const rulerRef = useRef(null);
  const { speechAvailable, getVoiceForLanguage, speak } = useSpeech();
  const {
    apiKey,
    simulationSpeed,
    height,
    language,
    measurementSystem,
    guidanceVoice,
    guidanceVoiceVolume,
    guidanceVoicePlaybackRate,
    isTablet
  } = useNavigationContext();
  const showGuidancePanel = useSelector(getShowGuidancePanel);
  const isNavigating = useSelector(getIsNavigating);
  const routeOptions = useSelector(getRouteOptions);
  const automaticRouteCalculation = useSelector(getAutomaticRouteCalculation);
  const [previousRoute, setPreviousRoute] = useState(null);

  const setETA = (feature) => {
    const { lengthInMeters, travelTimeInSeconds } = feature.properties.summary;
    const eta = add(new Date(), {
      seconds: travelTimeInSeconds
    }).toISOString();

    batch(() => {
      dispatch(setDistanceRemaining(lengthInMeters));
      dispatch(setTimeRemaining(travelTimeInSeconds));
      dispatch(setEta(eta));
    });
  };

  const { route, navigationRoute } = useNavigationRoute({
    apiKey,
    routeOptions,
    automaticRouteCalculation,
    preCalculatedRoute,
    setETA
  });
  const { features: [routeFeature] = [] } = route || {};

  const viewTransitioning = useSelector(getViewTransitioning);
  const navigationPerspectiveRef = useSelectorRef(getNavigationPerspective).at(
    1
  );
  const hasReachedDestination = useSelector(getHasReachedDestination);
  const simulationShouldEnd = useSelector(getSimulationShouldEnd);
  const { announcement } = useSelector(getCurrentLocation);
  const lastInstructionRef = useSelectorRef(getLastInstruction).at(1);
  const [voiceAnnouncementsEnabled, voiceAnnouncementsEnabledRef] =
    useSelectorRef(getVoiceAnnouncementsEnabled);
  const destination = useMemo(
    () =>
      routeOptions.locations?.length
        ? routeOptions.locations.at(-1)
        : routeFeature?.geometry.coordinates.at(-1),
    [routeOptions.locations, route]
  );
  const navigationPaddingTop = useMemo(
    () => Math.max(height - (isTablet ? 210 : 390), 0),
    [height, isTablet]
  );
  const navigationPaddingTopRef = useRef(navigationPaddingTop);
  const guidancePanelIsVisible =
    showGuidancePanel && isNavigating && !hasReachedDestination;
  const simulatorIsActive =
    navigationRoute && isNavigating && !hasReachedDestination;
  const isPedestrian = isPedestrianRoute(routeFeature);
  const simulatorZoom = useMemo(
    () =>
      isPedestrian
        ? PEDESTRIAN_NAVIGATION_SIMULATION_ZOOM
        : VEHICLE_NAVIGATION_SIMULATION_ZOOM,
    [isPedestrian]
  );

  const voice = useMemo(
    () => guidanceVoice || getVoiceForLanguage(language) || "en-US-JennyNeural",
    [guidanceVoice, getVoiceForLanguage, language]
  );

  const { startNavigation, stopNavigation } = useNavigationSimulation({
    map,
    route: route || null,
    routeFeature,
    onNavigationStarted,
    onNavigationStopped,
    navigationPaddingTopRef,
    voiceAnnouncementsEnabledRef,
    voice,
    isPedestrian,
    simulatorZoom,
    setETA
  });

  useEffect(() => {
    navigationPaddingTopRef.current = navigationPaddingTop;
  }, [navigationPaddingTop]);

  useEffect(() => {
    if (route) {
      if (isNavigating && route !== previousRoute) {
        stopNavigation();
      }
      setPreviousRoute(route);
    }
  }, [isNavigating, route, previousRoute]);

  useEffect(() => {
    if (Boolean(simulationShouldEnd)) {
      handleSimulatorEnd();
      dispatch(setSimulationShouldEnd(false));
    }
  }, [simulationShouldEnd]);

  useEffect(() => {
    if (speechAvailable && voiceAnnouncementsEnabled && announcement) {
      speak({
        voice,
        text: announcement.text,
        volume: guidanceVoiceVolume,
        playbackRate: guidanceVoicePlaybackRate
      });
    }
  }, [announcement, voiceAnnouncementsEnabled]);

  const handleSimulatorUpdate = (event) => {
    if (viewTransitioning) {
      return;
    }

    const { pitch, zoom, stepCoords, stepBearing, stepTime, duration } = event;
    const elapsedTime = Math.floor(stepTime / 1000);
    const {
      geometry: { coordinates },
      properties: {
        summary: { travelTimeInSeconds }
      }
    } = routeFeature;

    const ruler = getRuler(coordinates);

    const { point, index: pointIndex } = ruler.pointOnLine(
      coordinates,
      stepCoords
    );

    // TODO: this is a workaround for the walking navigation transition and needs further investigation
    if (pointIndex === 0 && stepBearing === 0) return;

    const traveledPart = ruler.lineSlice(coordinates[0], point, coordinates);
    if (traveledPart.length === 1) {
      traveledPart.push(coordinates[0]);
    }

    const remainingPart = ruler.lineSlice(
      point,
      coordinates[coordinates.length - 1],
      coordinates
    );

    const distanceRemaining = ruler.lineDistance(remainingPart);
    const timeRemaining = Math.max(travelTimeInSeconds - elapsedTime, 0);
    const routeProgress = featureCollection([lineString(traveledPart)]);

    const progress = {
      coordinates: stepCoords,
      bearing: stepBearing,
      elapsedTime,
      timeRemaining,
      distanceRemaining,
      routeProgress
    };

    batch(() => {
      if (navigationPerspectiveRef.current === NavigationPerspectives.FOLLOW) {
        dispatch(
          setCamera({
            movingMethod: "easeTo",
            center: stepCoords,
            zoom,
            pitch,
            bearing: stepBearing,
            animationOptions: {
              duration,
              padding: {
                top: navigationPaddingTopRef.current,
                left: isTablet ? TABLET_PANEL_WIDTH : 0
              }
            }
          })
        );
      }

      dispatch(
        setCurrentLocation({
          point,
          pointIndex,
          bearing: stepBearing,
          timeRemaining,
          distanceRemaining,
          routeProgress,
          route,
          measurementSystem,
          language
        })
      );
    });

    fireEvent(ControlEvents.OnProgressUpdate, { progress });

    onProgressUpdate(progress);
  };

  const handleSimulatorEnd = () => {
    const { coordinates } = routeFeature.geometry;
    const lastCoordinate = coordinates[coordinates.length - 1];
    const lastInstruction = lastInstructionRef?.current;
    const bounds = new tt.LngLatBounds(lastCoordinate, lastCoordinate);
    bounds.extend(destination.coordinates);

    // Reset the map's field of view padding
    map.__om.setPadding({ top: 0, left: 0 });

    batch(() => {
      dispatch(setViewTransitioning(true));
      dispatch(setHasReachedDestination(true));
      dispatch(setNavigationPerspective(NavigationPerspectives.OVERVIEW));
      dispatch(
        setFitBoundsOptions({
          animate: true,
          pitch: 0,
          duration: 500,
          maxZoom: 18,
          padding: {
            top: FIT_BOUNDS_PADDING_TOP,
            right: FIT_BOUNDS_PADDING_RIGHT,
            bottom: ARRIVAL_PANEL_HEIGHT + 16,
            left: FIT_BOUNDS_PADDING_LEFT
          }
        })
      );
      dispatch(setBounds(bounds.toArray()));
    });

    map.once("moveend", () => dispatch(setViewTransitioning(false)));

    if (speechAvailable && voiceAnnouncementsEnabledRef?.current) {
      if (lastInstruction) {
        const announcement = strings[lastInstruction.maneuver];
        speak({
          voice,
          text: announcement,
          volume: guidanceVoiceVolume,
          playbackRate: guidanceVoicePlaybackRate
        });
      }
    }

    const eventData = {
      maneuver: lastInstruction.maneuver,
      destination
    };

    fireEvent(ControlEvents.OnDestinationReached, eventData);
    onDestinationReached(eventData);
  };

  const getRuler = () => {
    if (!rulerRef.current && routeFeature) {
      const startCoordinate = routeFeature.geometry.coordinates[0];
      rulerRef.current = new CheapRuler(startCoordinate[1], "meters");
    }
    return rulerRef.current;
  };

  return (
    <>
      {guidancePanelIsVisible && <NavigationGuidancePanel route={route} />}
      <BottomPanel
        route={route}
        onStartNavigation={startNavigation}
        onStopNavigation={stopNavigation}
        onNavigationContinue={onNavigationContinue}
      />
      {simulatorIsActive && (
        <Simulator
          route={navigationRoute}
          zoom={simulatorZoom}
          maneuvers={[
            {
              type: ["arrive"],
              buffer: 0.0621371,
              zoom: simulatorZoom + 1,
              pitch: 40
            },
            {
              type: ["turn left", "turn right"],
              buffer: 0.0621371,
              zoom: simulatorZoom + 1,
              pitch: 40
            },
            {
              type: ["bear right"],
              buffer: 0.0621371,
              zoom: simulatorZoom + 1,
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
