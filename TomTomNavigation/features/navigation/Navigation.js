import tt from "@tomtom-international/web-sdk-maps";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import add from "date-fns/add";
import { featureCollection } from "@turf/helpers";
import { withMap } from "react-tomtom-maps";
import { useAppContext } from "../../app/AppContext";
import useSelectorRef from "../../hooks/useSelectorRef";
import useSpeech from "../../hooks/useMicrosoftSpeech";
import BottomPanel from "./BottomPanel";
import NavigationGuidancePanel from "./NavigationGuidancePanel";
import Simulator from "./Simulator";
import { useCalculateRouteQuery } from "../../services/routing";
import isPedestrianRoute from "../../functions/isPedestrianRoute";
import shouldAnimateCamera from "../../functions/shouldAnimateCamera";
import coordinatesToGeoJson from "../../functions/coordinatesToGeoJson";
import geoJsonBounds from "../../functions/geoJsonBounds";
import tomtom2mapbox from "../../functions/tomtom2mapbox";
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
  getSimulationShouldEnd,
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
  setSimulationShouldEnd,
  resetNavigation
} from "../navigation/navigationSlice";

import {
  TABLET_PANEL_WIDTH,
  ARRIVAL_PANEL_HEIGHT,
  FIT_BOUNDS_PADDING_TOP,
  FIT_BOUNDS_PADDING_RIGHT,
  FIT_BOUNDS_PADDING_BOTTOM,
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
  onDestinationReached
}) => {
  const dispatch = useDispatch();
  const { speechAvailable, getVoiceForLanguage, speak } = useSpeech();
  const {
    apiKey,
    simulationSpeed,
    height,
    language,
    measurementSystem,
    guidanceVoice,
    guidanceVoiceVolume,
    isTablet
  } = useAppContext();
  const showBottomPanel = useSelector(getShowBottomPanel);
  const showGuidancePanel = useSelector(getShowGuidancePanel);
  const isNavigating = useSelector(getIsNavigating);
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
  const routeOptions = useSelector(getRouteOptions);
  const automaticRouteCalculation = useSelector(getAutomaticRouteCalculation);
  const { data: { route } = {} } = useCalculateRouteQuery({
    key: apiKey,
    preCalculatedRoute,
    automaticRouteCalculation,
    ...routeOptions
  });
  const { features: [routeFeature] = [] } = route || {};
  const [navigationRoute, setNavigationRoute] = useState();
  const destination = useMemo(
    () =>
      routeOptions.locations?.length
        ? routeOptions.locations.at(-1)
        : routeFeature?.geometry.coordinates.at(-1),
    [routeOptions.locations, route]
  );
  const navigationPaddingTop = Math.max(height - (isTablet ? 210 : 390), 0);
  const navigationPaddingTopRef = useRef(navigationPaddingTop);
  const guidancePanelIsVisible =
    showGuidancePanel && isNavigating && !hasReachedDestination;
  const bottomPanelIsVisible = showBottomPanel;
  const simulatorIsActive =
    navigationRoute && isNavigating && !hasReachedDestination;
  const isPedestrian = isPedestrianRoute(routeFeature);
  const simulatorZoom = isPedestrian
    ? PEDESTRIAN_NAVIGATION_SIMULATION_ZOOM
    : VEHICLE_NAVIGATION_SIMULATION_ZOOM;

  useEffect(() => {
    navigationPaddingTopRef.current = navigationPaddingTop;
  }, [navigationPaddingTop]);

  useEffect(() => {
    if (route) {
      if (isNavigating) {
        stopNavigation();
      }

      const navigationRoute = tomtom2mapbox(routeFeature);
      setNavigationRoute(navigationRoute);
      setETA();
    }
  }, [route]);

  useEffect(() => {
    if (Boolean(simulationShouldEnd)) {
      handleSimulatorEnd();
      dispatch(setSimulationShouldEnd(false));
    }
  }, [simulationShouldEnd]);

  useEffect(() => {
    if (speechAvailable && voiceAnnouncementsEnabled && announcement) {
      const voice = getGuidanceVoice();
      speak({ voice, text: announcement.text, volume: guidanceVoiceVolume });
    }
  }, [announcement, voiceAnnouncementsEnabled]);

  const setETA = () => {
    const { lengthInMeters, travelTimeInSeconds } =
      routeFeature.properties.summary;
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
    const routeCoordinates = routeFeature.geometry.coordinates;
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
          animationOptions: {
            padding: {
              top: navigationPaddingTop,
              left: isTablet ? TABLET_PANEL_WIDTH : 0
            }
          }
        })
      );
    });

    if (
      !isPedestrian &&
      speechAvailable &&
      voiceAnnouncementsEnabledRef?.current
    ) {
      const voice = getGuidanceVoice();
      const announcement = strings.DEPART;
      speak({ voice, text: announcement, volume: guidanceVoiceVolume });
    }

    map.once("moveend", () => dispatch(setViewTransitioning(false)));

    fireEvent(ControlEvents.OnNavigationStarted);
    onNavigationStarted();
  };

  const stopNavigation = () => {
    let geojson = coordinatesToGeoJson(
      routeOptions.locations.map((location) => location.coordinates)
    );
    const mergedFeatures = [...route.features, ...geojson.features];
    geojson = featureCollection(mergedFeatures);
    const bounds = geoJsonBounds(geojson);

    // Reset the map's field of view padding
    map.__om.setPadding({ top: 0, left: 0 });

    batch(() => {
      dispatch(setViewTransitioning(true));
      dispatch(resetNavigation());
      dispatch(setPitch(0));
      dispatch(
        setFitBoundsOptions({
          padding: {
            top: FIT_BOUNDS_PADDING_TOP,
            right: FIT_BOUNDS_PADDING_RIGHT,
            bottom: FIT_BOUNDS_PADDING_BOTTOM,
            left: FIT_BOUNDS_PADDING_LEFT
          },
          animate: true
        })
      );
      dispatch(setBounds(bounds));

      // Reset the ETA
      setETA();
    });

    map.once("moveend", () => dispatch(setViewTransitioning(false)));

    // Restore map interaction
    setMapInteractive(true);

    fireEvent(ControlEvents.OnNavigationStopped);
    onNavigationStopped();
  };

  const setMapInteractive = (interactive) => {
    map.__om._canvas.parentElement.style.pointerEvents = interactive
      ? "all"
      : "none";
  };

  const handleSimulatorUpdate = (event) => {
    if (viewTransitioning) {
      return;
    }

    const { pitch, zoom, stepCoords, stepBearing, stepTime, duration } = event;
    const elapsedTime = Math.floor(stepTime / 1000);

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
          location: stepCoords,
          bearing: stepBearing,
          elapsedTime,
          route,
          measurementSystem,
          language
        })
      );
    });

    const progress = {
      coordinates: stepCoords,
      bearing: stepBearing,
      elapsedTime
    };

    fireEvent(ControlEvents.OnProgressUpdate, { progress });
    onProgressUpdate(progress);
  };

  const handleSimulatorEnd = () => {
    const { coordinates } = routeFeature.geometry;
    const lastCoordinate = coordinates[coordinates.length - 1];
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
      const voice = getGuidanceVoice();
      const instruction = lastInstructionRef?.current;

      if (instruction) {
        const announcement = strings[instruction.maneuver];
        speak({ voice, text: announcement, volume: guidanceVoiceVolume });
      }
    }

    fireEvent(ControlEvents.OnDestinationReached, { destination });
    onDestinationReached();
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
