import React, { useRef, useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { featureCollection } from "@turf/helpers";
import { useNavigationContext } from "../../core/NavigationContext";
import ReactMap from "react-tomtom-maps";
import GeolocateControl from "./controls/GeolocateControl";
import MuteControl from "./controls/MuteControl";
import CompassControl from "./controls/CompassControl";
import MapSwitcherControl from "./controls/MapSwitcherControl";
import NavigationPerspectiveControl from "./controls/NavigationPerspectiveControl";
import ZoomControl from "./controls/ZoomControl";
import ExitControl from "./controls/ExitControl";
import SkipControl from "./controls/SkipControl";
import SpeedLimitEU from "./SpeedLimitEU";
import SpeedLimitUS from "./SpeedLimitUS";
import Route from "./Route";
import Waypoints from "./Waypoints";
import ManeuverArrows from "./ManeuverArrows";
import LocationMarker from "./markers/LocationMarker";
import ChevronMarker from "./markers/ChevronMarker";
import Chevron2DMarker from "./markers/Chevron2DMarker";
import { useCalculateRouteQuery } from "../../services/routing";
import coordinatesToGeoJson from "../../functions/coordinatesToGeoJson";
import geoJsonBounds from "../../functions/geoJsonBounds";
import countryCodeFromRoute from "../../functions/countryCodeFromRoute";
import shouldAnimateCamera from "../../functions/shouldAnimateCamera";
import fireEvent from "../../functions/fireEvent";
import isPedestrianRoute from "../../functions/isPedestrianRoute";
import ControlEvents from "../../constants/ControlEvents";
import NavigationPerspectives from "../../constants/NavigationPerspectives";

import {
  getCenter,
  getZoom,
  getBearing,
  getPitch,
  getBounds,
  getMovingMethod,
  getAnimationOptions,
  getRouteOptions,
  getAutomaticRouteCalculation,
  getFitBoundsOptions,
  getUserLocation,
  getViewTransitioning,
  getCountryCode,
  setCenter,
  setBounds,
  setFitBoundsOptions,
  setMovingMethod,
  setUserLocation,
  setViewTransitioning,
  setSpriteImageUrl,
  setSpriteJson,
  setCountryCode
} from "./mapSlice";

import {
  getVoiceAnnouncementsEnabled,
  getIsNavigating,
  getHasReachedDestination,
  getNavigationPerspective,
  getCurrentLocation,
  getNextInstruction,
  getRouteProgress,
  setVoiceAnnouncementsEnabled,
  setNavigationPerspective,
  setSimulationShouldEnd
} from "../navigation/navigationSlice";

import {
  TABLET_PANEL_WIDTH,
  FIT_BOUNDS_PADDING_TOP,
  FIT_BOUNDS_PADDING_LEFT
} from "../../config";

const poiLayerId = "POI";
const before = "Borders - Treaty label";

const easing = (v) => v;

const Map = ({
  enableGeolocation = true,
  simulatedLocation,
  showTrafficFlow = false,
  showTrafficIncidents = false,
  showPoi = false,
  showLocationMarker = true,
  showMapSwitcherControl = true,
  showMuteControl = true,
  showExitControl = false,
  showZoomControl = false,
  showSkipControl = false,
  showManeuverArrows = true,
  preCalculatedRoute,
  fitRoute = true,
  alwaysUseDrivingStyle = false,
  onRouteCalculated = () => {},
  onComponentExit = () => {},
  children
}) => {
  const dispatch = useDispatch();
  const mapRef = useRef();
  const {
    apiKey,
    language,
    width,
    height,
    mapStyles,
    theme,
    guidancePanelHeight,
    setMeasurementSystemAuto,
    isPhone
  } = useNavigationContext();
  const voiceAnnouncementsEnabled = useSelector(getVoiceAnnouncementsEnabled);
  const isNavigating = useSelector(getIsNavigating);
  const hasReachedDestination = useSelector(getHasReachedDestination);
  const viewTransitioning = useSelector(getViewTransitioning);
  const navigationPerspective = useSelector(getNavigationPerspective);
  const routeProgress = useSelector(getRouteProgress);
  const {
    point: currentLocation,
    bearing: currentLocationBearing,
    speedLimit
  } = useSelector(getCurrentLocation);
  const nextInstruction = useSelector(getNextInstruction);
  const center = useSelector(getCenter);
  const zoom = useSelector(getZoom);
  const bearing = useSelector(getBearing);
  const pitch = useSelector(getPitch);
  const bounds = useSelector(getBounds);
  const movingMethod = useSelector(getMovingMethod);
  const animationOptions = useSelector(getAnimationOptions);
  const routeOptions = useSelector(getRouteOptions);
  const automaticRouteCalculation = useSelector(getAutomaticRouteCalculation);
  const fitBoundsOptions = useSelector(getFitBoundsOptions);
  const userLocation = useSelector(getUserLocation);
  const countryCode = useSelector(getCountryCode);
  const [mapStyle, setMapStyle] = useState(mapStyles.street);
  const [isResizing, setIsResizing] = useState(false);
  const {
    data: { route, sectionedRoute, walkingLeg, maneuverLineStrings } = {}
  } = useCalculateRouteQuery({
    key: apiKey,
    preCalculatedRoute,
    automaticRouteCalculation,
    ...routeOptions
  });
  const pedestrianRoute = isPedestrianRoute(route);

  const routeIsVisible = !!route;
  const maneuverArrowsAreVisible =
    showManeuverArrows && !!route && isNavigating;
  const geolocateControlIsVisible =
    enableGeolocation && !simulatedLocation && !isNavigating;
  const muteControlVisible =
    showMuteControl && isNavigating && !hasReachedDestination;
  const mapSwitcherControlIsVisible = showMapSwitcherControl && !isNavigating;
  const compassControlIsVisible = !isNavigating;
  const speedLimitControlIsVisible =
    isNavigating && speedLimit && !hasReachedDestination;
  const navigationPerspectiveControlIsVisible =
    isNavigating && !hasReachedDestination;
  const exitControlIsVisible = showExitControl && !isNavigating;
  const zoomControlIsVisible = showZoomControl && !isPhone && !isNavigating;
  const skipControlIsVisible =
    showSkipControl && isNavigating && !hasReachedDestination;
  const locationMarkerIsVisible =
    enableGeolocation && showLocationMarker && userLocation && !isNavigating;
  const chevronMarkerIsVisible =
    isNavigating &&
    !isResizing &&
    !viewTransitioning &&
    !hasReachedDestination &&
    navigationPerspective === NavigationPerspectives.FOLLOW;
  const chevron2DMarkerIsVisible =
    isNavigating &&
    !isResizing &&
    !viewTransitioning &&
    navigationPerspective === NavigationPerspectives.OVERVIEW &&
    currentLocation;
  const haveWaypoints = routeOptions?.locations.length > 0;

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const handleResizeStart = () => {
      setIsResizing(true);

      setTimeout(() => handleResizeEnd(), 2000);
    };

    const handleResizeEnd = () => setIsResizing(false);

    map.on("resize", handleResizeStart);

    return () => {
      map.off("resize", handleResizeStart);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current?.getMap();

    if (map) {
      const container = map.getContainer();
      const observer = new ResizeObserver(() => map.resize());
      observer.observe(container);
      return () => observer?.unobserve(container);
    }
  }, [mapRef.current]);

  useEffect(() => {
    setMeasurementSystemAuto(countryCode === "US" ? "imperial" : "metric");
  }, [countryCode]);

  useEffect(() => {
    setMapStyle(mapStyles[mapStyle.name]);
  }, [theme]);

  useEffect(() => {
    if (fitRoute && (routeOptions?.locations.length || route)) {
      fitRouteOrWaypoints({ animate: false });
    }
  }, [JSON.stringify(routeOptions.locations), route]);

  useEffect(() => {
    const setCountryCodeFromRoute = async () => {
      const countryCode = await countryCodeFromRoute(apiKey, route);
      dispatch(setCountryCode(countryCode));
    };

    if (route) {
      setCountryCodeFromRoute();

      const summary = route.features[0].properties.summary;
      fireEvent(ControlEvents.OnRouteCalculated, { summary });

      onRouteCalculated();
    }
  }, [route, apiKey, dispatch]);

  useEffect(() => {
    const map = mapRef.current?.getMap();

    if (map.isStyleLoaded()) {
      if (map.getLayer(poiLayerId)) {
        map.setLayoutProperty(poiLayerId, "visibility", "none");
      }
    } else {
      map.on("style.load", () => {
        if (map.getLayer(poiLayerId)) {
          map.setLayoutProperty(poiLayerId, "visibility", "none");
        }
      });
    }
  }, [mapRef.current, showPoi]);

  useEffect(() => {
    if (simulatedLocation) {
      dispatch(setUserLocation(simulatedLocation));
    }
  }, [simulatedLocation]);

  const setMapSprite = async (map) => {
    try {
      const spriteUrl = map.getStyle().sprite;
      const [baseUrl, queryParams] = spriteUrl.split("?");
      const spriteImageUrl = `${baseUrl}@2x.png?${queryParams}`;
      const spriteJsonUrl = `${baseUrl}@2x.json?${queryParams}`;
      const response = await fetch(spriteJsonUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch sprite JSON");
      }

      const spriteJson = await response.json();

      batch(() => {
        dispatch(setSpriteImageUrl(spriteImageUrl));
        dispatch(setSpriteJson(spriteJson));
      });
    } catch (error) {
      console.error("Error fetching sprite JSON:", error);
    }
  };

  const fitRouteOrWaypoints = (fitBoundsOptions) => {
    // Convert the route waypoints to geojson
    let geojson = coordinatesToGeoJson(
      routeOptions.locations?.map((location) => location.coordinates)
    );

    // If we have a route, extend the location geojson to include
    // the route geometry
    if (route) {
      const mergedFeatures = [...route.features, ...geojson.features];
      geojson = featureCollection(mergedFeatures);
    }

    if (geojson) {
      const bounds = geoJsonBounds(geojson);

      batch(() => {
        dispatch(
          setFitBoundsOptions({
            pitch: 0,
            duration: 500,
            ...fitBoundsOptions
          })
        );
        dispatch(setBounds(bounds));
      });
    }
  };

  const handleMapLoad = async (map) => {
    try {
      const control = map.getAttributionControl();
      map.removeControl(control);
    } catch (e) {}
    setMapSprite(map);
  };

  const handleGeolocationControlClick = (coords) => {
    if (coords) {
      const map = mapRef.current.getMap();
      const { longitude, latitude } = coords;
      const center = [longitude, latitude];
      const movingMethod = shouldAnimateCamera(map.getBounds(), center)
        ? "flyTo"
        : "jumpTo";

      batch(() => {
        dispatch(setMovingMethod(movingMethod));
        dispatch(setCenter(center));
      });
    }
  };

  const handleUserLocationChange = (coords) => {
    if (coords) {
      const { longitude, latitude } = coords;
      dispatch(setUserLocation([longitude, latitude]));
    }
  };

  const handleMuteControlClick = (enabled) => {
    dispatch(setVoiceAnnouncementsEnabled(enabled));
  };

  const handleNavigationPerspectiveControlClick = (perspective) => {
    const map = mapRef.current.getMap();

    batch(() => {
      dispatch(setViewTransitioning(true));
      dispatch(setNavigationPerspective(perspective));

      if (perspective === NavigationPerspectives.FOLLOW) {
        dispatch(setCenter(currentLocation));
      } else {
        map.__om.setPadding({ top: 0, left: 0 });

        fitRouteOrWaypoints({
          animate: true,
          padding: {
            top: isPhone ? guidancePanelHeight + 24 : FIT_BOUNDS_PADDING_TOP,
            left: isPhone
              ? FIT_BOUNDS_PADDING_LEFT
              : TABLET_PANEL_WIDTH + FIT_BOUNDS_PADDING_LEFT
          }
        });
      }
    });

    map.once("zoomend", () => dispatch(setViewTransitioning(false)));
  };

  const handleCompassControlClick = () => {
    if (isNavigating) {
      return;
    }

    const map = mapRef.current.getMap();
    map.easeTo({ bearing: 0, duration: 250 });
  };

  const handleMapStyleSelected = (name) => {
    setMapStyle(mapStyles[name]);
  };

  const handleSkip = () => {
    if (isNavigating) {
      dispatch(setSimulationShouldEnd(true));
    }
  };

  const currentStyle = useMemo(
    () =>
      (isNavigating || alwaysUseDrivingStyle) && mapStyle.styleDriving
        ? mapStyle.styleDriving
        : mapStyle.style,
    [mapStyle, isNavigating]
  );

  const SpeedLimitControl = countryCode === "US" ? SpeedLimitUS : SpeedLimitEU;

  return (
    <ReactMap
      ref={mapRef}
      key={apiKey}
      apiKey={apiKey}
      mapStyle={currentStyle}
      stylesVisibility={{
        trafficFlow: showTrafficFlow,
        trafficIncidents: showTrafficIncidents
      }}
      language={language}
      containerStyle={{
        width: `${width}px`,
        height: `${height}px`
      }}
      fitBoundsOptions={fitBoundsOptions}
      movingMethod={movingMethod}
      animationOptions={{ ...animationOptions, easing }}
      attributionControl={false}
      center={center}
      zoom={zoom}
      bounds={bounds}
      bearing={bearing}
      pitch={pitch}
      onLoad={handleMapLoad}
    >
      <GeolocateControl
        watchPosition={true}
        visible={geolocateControlIsVisible}
        onClick={handleGeolocationControlClick}
        onLocationChange={handleUserLocationChange}
      />
      <NavigationPerspectiveControl
        navigationPerspective={navigationPerspective}
        visible={navigationPerspectiveControlIsVisible}
        onClick={handleNavigationPerspectiveControlClick}
      />
      <MuteControl
        voiceAnnouncementsEnabled={voiceAnnouncementsEnabled}
        visible={muteControlVisible}
        onClick={handleMuteControlClick}
      />
      <MapSwitcherControl
        visible={mapSwitcherControlIsVisible}
        selected={mapStyle.name}
        onSelected={handleMapStyleSelected}
      />
      <CompassControl
        visible={compassControlIsVisible}
        onClick={handleCompassControlClick}
      />
      <ExitControl visible={exitControlIsVisible} onClick={onComponentExit} />
      <SkipControl visible={skipControlIsVisible} onClick={handleSkip} />
      <ZoomControl visible={zoomControlIsVisible} />
      {locationMarkerIsVisible && <LocationMarker coordinates={userLocation} />}
      {routeIsVisible && (
        <Route
          before={before}
          data={sectionedRoute}
          progress={routeProgress}
          walkingLeg={walkingLeg}
          isPedestrianRoute={pedestrianRoute}
        />
      )}
      {haveWaypoints && (
        <Waypoints id="Waypoints" data={routeOptions.locations} />
      )}
      {maneuverArrowsAreVisible && (
        <ManeuverArrows
          before="Waypoints-symbol"
          data={maneuverLineStrings}
          nextInstructionPointIndex={nextInstruction?.pointIndex}
        />
      )}
      <ChevronMarker visible={chevronMarkerIsVisible} />
      <Chevron2DMarker
        visible={chevron2DMarkerIsVisible}
        coordinates={currentLocation}
        bearing={currentLocationBearing}
        animationDuration={animationOptions.duration}
      />
      <SpeedLimitControl
        value={speedLimit}
        visible={speedLimitControlIsVisible}
      />
      {children}
    </ReactMap>
  );
};

export default Map;
