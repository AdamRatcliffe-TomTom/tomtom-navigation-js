import { useEffect } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { featureCollection } from "@turf/helpers";
import { useNavigationContext } from "../../../core/NavigationContext";
import useSpeech from "../../../hooks/useMicrosoftSpeech";
import ControlEvents from "../../../constants/ControlEvents";
import fireEvent from "../../../functions/fireEvent";
import geoJsonBounds from "../../../functions/geoJsonBounds";
import shouldAnimateCamera from "../../../functions/shouldAnimateCamera";
import {
  getFirstInstruction,
  getLastInstruction,
  announcementByIndex
} from "../../../functions/routeUtils";
import strings from "../../../config/strings";

import {
  getRouteOptions,
  setViewTransitioning,
  setCamera,
  setPitch,
  setFitBoundsOptions,
  setBounds
} from "../../../features/map/mapSlice";
import {
  setIsNavigating,
  setLastInstruction,
  setNextInstruction,
  resetNavigation
} from "../navigationSlice";

import {
  EVENT_PREFIX,
  TABLET_PANEL_WIDTH,
  FIT_BOUNDS_PADDING_TOP,
  FIT_BOUNDS_PADDING_RIGHT,
  FIT_BOUNDS_PADDING_BOTTOM,
  FIT_BOUNDS_PADDING_LEFT
} from "../../../config";

// TODO: move setETA out and instead call it on navigation state change
// in Navigation comp

function useNavigationSimulation({
  map,
  route,
  routeFeature,
  onNavigationStarted,
  onNavigationStopped,
  navigationPaddingTopRef,
  voiceAnnouncementsEnabledRef,
  voice,
  isPedestrian,
  zoomForTravelMode,
  setETA
}) {
  const dispatch = useDispatch();
  const routeOptions = useSelector(getRouteOptions);
  const {
    guidanceVoiceVolume,
    guidanceVoicePlaybackRate,
    isTablet,
    measurementSystem,
    language
  } = useNavigationContext();
  const { speechAvailable, speak, cancelSpeech } = useSpeech();

  useEffect(() => {
    const onMessage = (event) => {
      const {
        data: { type, bearing, fitBounds, fitBoundsOptions }
      } = event;

      switch (type) {
        case `${EVENT_PREFIX}.${ControlEvents.StartNavigation}`:
          startNavigation({ bearing });
          break;
        case `${EVENT_PREFIX}.${ControlEvents.StopNavigation}`:
          stopNavigation({ fitBounds, fitBoundsOptions });
          break;
        default:
        // do nothing
      }
    };

    window.addEventListener("message", onMessage, false);

    return () => window.removeEventListener("message", onMessage, false);
  }, [
    map,
    route,
    routeFeature,
    onNavigationStarted,
    onNavigationStopped,
    navigationPaddingTopRef.current,
    voiceAnnouncementsEnabledRef.current,
    speechAvailable,
    speak,
    voice,
    isPedestrian,
    setETA
  ]);

  const setMapInteractive = (interactive) => {
    map.__om._canvas.parentElement.style.pointerEvents = interactive
      ? "all"
      : "none";
  };

  const startNavigation = ({ bearing }) => {
    const routeCoordinates = routeFeature.geometry.coordinates;
    const center = routeCoordinates[0];
    const firstInstruction = getFirstInstruction(routeFeature);
    const lastInstruction = getLastInstruction(routeFeature);
    const movingMethod = shouldAnimateCamera(map.getBounds(), center)
      ? "flyTo"
      : "jumpTo";

    cancelSpeech();

    map.stop();

    setMapInteractive(false);

    batch(() => {
      dispatch(setViewTransitioning(true));
      dispatch(setIsNavigating(true));
      dispatch(setNextInstruction(firstInstruction));
      dispatch(setLastInstruction(lastInstruction));
      dispatch(
        setCamera({
          movingMethod,
          center,
          pitch: 60,
          zoom: zoomForTravelMode,
          bearing: bearing || map.getBearing(),
          animationOptions: {
            duration: 750,
            padding: {
              top: navigationPaddingTopRef.current,
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
      speak({
        voice,
        text:
          announcementByIndex(routeFeature, 0, measurementSystem, language)
            ?.text || strings.DEPART,
        volume: guidanceVoiceVolume,
        playbackRate: guidanceVoicePlaybackRate
      });
    }

    map.once("moveend", () => dispatch(setViewTransitioning(false)));

    fireEvent(ControlEvents.OnNavigationStarted);
    if (onNavigationStarted) onNavigationStarted();
  };

  const stopNavigation = ({
    fitBounds,
    fitBoundsOptions,
    userCancelled = false
  }) => {
    cancelSpeech();

    const bounds =
      fitBounds ||
      geoJsonBounds(
        featureCollection([
          ...(Array.isArray(routeOptions.locations)
            ? routeOptions.locations
            : []),
          ...route.features
        ])
      );

    map.__om.setPadding({ top: 0, left: 0 });

    batch(() => {
      dispatch(setViewTransitioning(true));
      dispatch(resetNavigation({ routeRemaining: routeFeature }));
      dispatch(setPitch(0));
      dispatch(
        setFitBoundsOptions({
          duration: 750,
          padding: {
            top: FIT_BOUNDS_PADDING_TOP,
            right: FIT_BOUNDS_PADDING_RIGHT,
            bottom: FIT_BOUNDS_PADDING_BOTTOM,
            left: FIT_BOUNDS_PADDING_LEFT
          },
          animate: true,
          ...fitBoundsOptions
        })
      );
      dispatch(setBounds(bounds));
      setETA(routeFeature);
    });

    map.once("moveend", () => dispatch(setViewTransitioning(false)));

    setMapInteractive(true);

    fireEvent(ControlEvents.OnNavigationStopped);
    if (onNavigationStopped) onNavigationStopped({ userCancelled });
  };

  return { startNavigation, stopNavigation };
}

export default useNavigationSimulation;
