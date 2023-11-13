import React, { useRef, useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { useAppContext } from "../../app/AppContext";
import ReactMap from "react-tomtom-maps";
import GeolocateControl from "./controls/GeolocateControl";
import MuteControl from "./controls/MuteControl";
import CompassControl from "./controls/CompassControl";
import MapSwitcherControlAlt from "./controls/MapSwitcherControlAlt";
import RouteOverviewControl from "./controls/RouteOverviewControl";
import SpeedLimit from "./SpeedLimit";
import SpeedLimitUS from "./SpeedLimitUS";
import Route from "./Route";
import EnhancedRoute from "./EnhancedRoute";
import LocationMarker from "./LocationMarker";
import ChevronMarker from "./ChevronMarker";
import Chevron2DMarker from "./Chevron2DMarker";
import DefaultMarker from "./DefaultMarker";
import { useCalculateRouteQuery } from "../../services/routing";
import geoJsonBounds from "../../functions/geoJsonBounds";
import countryCodeFromRoute from "../../functions/countryCodeFromRoute";
import shouldAnimateCamera from "../../functions/shouldAnimateCamera";
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
  setCenter,
  setBounds,
  setFitBoundsOptions,
  setMovingMethod,
  setUserLocation
} from "./mapSlice";

import {
  getVoiceAnnouncementsEnabled,
  getIsNavigating,
  getHasReachedDestination,
  getNavigationModeTransitioning,
  getNavigationPerspective,
  getCurrentLocation,
  getRemainingRoute,
  setVoiceAnnouncementsEnabled
} from "../navigation/navigationSlice";

const before = "Borders - Treaty label";

const easing = (v) => v;

const Map = ({
  enableGeolocation,
  showTrafficFlow,
  showTrafficIncidents,
  showLocationMarker,
  showMapSwitcherControl,
  showMuteControl,
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
    setMeasurementSystemAuto
  } = useAppContext();
  const voiceAnnouncementsEnabled = useSelector(getVoiceAnnouncementsEnabled);
  const isNavigating = useSelector(getIsNavigating);
  const hasReachedDestination = useSelector(getHasReachedDestination);
  const navigationModeTransitioning = useSelector(
    getNavigationModeTransitioning
  );
  const navigationPerspective = useSelector(getNavigationPerspective);
  const remainingRoute = useSelector(getRemainingRoute);
  const { speedLimit } = useSelector(getCurrentLocation);
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
  const [mapStyle, setMapStyle] = useState(mapStyles.street);
  const { data: route } = useCalculateRouteQuery(
    {
      key: apiKey,
      ...routeOptions
    },
    { skip: !automaticRouteCalculation }
  );
  const countryCode = countryCodeFromRoute(route);
  const geolocateControlIsVisible = enableGeolocation && !isNavigating;
  const muteControlVisible = showMuteControl && isNavigating;
  const mapSwitcherControlIsVisible = showMapSwitcherControl && !isNavigating;
  const compassControlIsVisible = !hasReachedDestination;
  const speedLimitControlIsVisible =
    isNavigating && speedLimit && !hasReachedDestination;
  const routeOverviewControlIsVisible = isNavigating && !hasReachedDestination;
  const locationMarkerIsVisible =
    showLocationMarker && userLocation && !isNavigating;
  const chevronMarkerIsVisible =
    isNavigating &&
    !navigationModeTransitioning &&
    !hasReachedDestination &&
    navigationPerspective === NavigationPerspectives.DRIVING;
  const chevron2DMarkerIsVisible =
    isNavigating &&
    !navigationModeTransitioning &&
    !hasReachedDestination &&
    navigationPerspective === NavigationPerspectives.ROUTE_OVERVIEW;

  useEffect(() => {
    setMeasurementSystemAuto(countryCode === "US" ? "imperial" : "metric");
  }, [countryCode]);

  useEffect(() => {
    setMapStyle(mapStyles[mapStyle.name]);
  }, [theme]);

  useEffect(() => {
    const features =
      route || (routeOptions.locations?.length && routeOptions.locations);

    if (features) {
      const bounds = geoJsonBounds(features);
      batch(() => {
        dispatch(setFitBoundsOptions({ animate: false }));
        dispatch(setBounds(bounds));
      });
    }
  }, [route, JSON.stringify(routeOptions.locations)]);

  useEffect(() => {
    const map = mapRef.current.getMap();
    map?.resize();
  }, [width, height]);

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

  const handleCompassControlClick = () => {
    if (isNavigating) return;

    const map = mapRef.current.getMap();
    map.easeTo({ bearing: 0, duration: 250 });
  };

  const handleMapStyleSelected = (name) => {
    setMapStyle(mapStyles[name]);
  };

  const waypoints = useMemo(() => {
    const { locations } = routeOptions;

    if (!locations) return null;

    return locations.map((location) => (
      <DefaultMarker key={location.toString()} coordinates={location} />
    ));
  }, [routeOptions.locations]);

  const currentStyle = useMemo(
    () =>
      isNavigating && mapStyle.styleDriving
        ? mapStyle.styleDriving
        : mapStyle.style,
    [mapStyle, isNavigating]
  );

  const SpeedLimitControl = countryCode === "US" ? SpeedLimitUS : SpeedLimit;

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
    >
      <GeolocateControl
        watchPosition={true}
        visible={geolocateControlIsVisible}
        onClick={handleGeolocationControlClick}
        onLocationChange={handleUserLocationChange}
      />
      <RouteOverviewControl visible={routeOverviewControlIsVisible} />
      <MuteControl
        voiceAnnouncementsEnabled={voiceAnnouncementsEnabled}
        visible={muteControlVisible}
        onClick={handleMuteControlClick}
      />
      <MapSwitcherControlAlt
        visible={mapSwitcherControlIsVisible}
        selected={mapStyle.name}
        onSelected={handleMapStyleSelected}
      />
      <CompassControl
        visible={compassControlIsVisible}
        onClick={handleCompassControlClick}
      />
      {locationMarkerIsVisible && <LocationMarker coordinates={userLocation} />}
      {route &&
        (remainingRoute ? (
          <EnhancedRoute
            before={before}
            data={route}
            remainingRoute={remainingRoute}
          />
        ) : (
          <Route before={before} data={route} />
        ))}
      {waypoints}
      <ChevronMarker visible={chevronMarkerIsVisible} />
      <Chevron2DMarker
        visible={chevron2DMarkerIsVisible}
        coordinates={center}
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
