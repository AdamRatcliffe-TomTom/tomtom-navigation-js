import { useEffect } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { featureCollection } from "@turf/helpers";
import { useAppContext } from "../../../app/AppContext";
import ControlEvents from "../../../constants/ControlEvents";
import fireEvent from "../../../functions/fireEvent";
import geoJsonBounds from "../../../functions/geoJsonBounds";
import shouldAnimateCamera from "../../../functions/shouldAnimateCamera";
import strings from "../../../config/strings";

import {
  getRouteOptions,
  setViewTransitioning,
  setCamera,
  setPitch,
  setFitBoundsOptions,
  setBounds
} from "../../../features/map/mapSlice";
import { setIsNavigating, resetNavigation } from "../navigationSlice";

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
  speechAvailable,
  speak,
  voice,
  isPedestrian,
  setETA
}) {
  const dispatch = useDispatch();
  const routeOptions = useSelector(getRouteOptions);
  const { guidanceVoiceVolume, isTablet } = useAppContext();

  useEffect(() => {
    const onMessage = (event) => {
      const {
        data: { type }
      } = event;

      switch (type) {
        case `${EVENT_PREFIX}.${ControlEvents.StartNavigation}`:
          startNavigation();
          break;
        case `${EVENT_PREFIX}.${ControlEvents.StopNavigation}`:
          stopNavigation();
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

  const startNavigation = () => {
    const routeCoordinates = routeFeature.geometry.coordinates;
    const center = routeCoordinates[0];
    const movingMethod = shouldAnimateCamera(map.getBounds(), center)
      ? "flyTo"
      : "jumpTo";

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
        text: strings.DEPART,
        volume: guidanceVoiceVolume
      });
    }

    map.once("moveend", () => dispatch(setViewTransitioning(false)));

    fireEvent(ControlEvents.OnNavigationStarted);
    if (onNavigationStarted) onNavigationStarted();
  };

  const stopNavigation = (userCancelled = false) => {
    const geojson = featureCollection([
      ...routeOptions.locations.map((loc) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: loc.coordinates }
      })),
      ...route.features
    ]);
    const bounds = geoJsonBounds(geojson);

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
