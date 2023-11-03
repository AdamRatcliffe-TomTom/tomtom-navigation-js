import React, { useRef, useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { useAppContext } from "../../app/AppContext";
import ReactMap from "react-tomtom-maps";
import GeolocateControl from "./GeolocateControl";
import CompassControl from "./CompassControl";
import MapSwitcherControlAlt from "./MapSwitcherControlAlt";
import SpeedLimit from "./SpeedLimit";
import SpeedLimitUS from "./SpeedLimitUS";
import Route from "./Route";
import EnhancedRoute from "./EnhancedRoute";
import LocationMarker from "./LocationMarker";
import ChevronMarker from "./ChevronMarker";
import DefaultMarker from "./DefaultMarker";
import Fade from "../../components/Fade";
import { useCalculateRouteQuery } from "../../services/routing";
import geoJsonBounds from "../../functions/geoJsonBounds";
import countryCodeFromRoute from "../../functions/countryCodeFromRoute";

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
  setBounds,
  setFitBoundsOptions
} from "./mapSlice";

import {
  getIsNavigating,
  getHasReachedDestination,
  getNavigationModeTransitioning,
  getCurrentLocation,
  getRemainingRoute
} from "../navigation/navigationSlice";

const before = "Borders - Treaty label";

const easing = (v) => v;

const Map = ({
  enableGeolocation,
  showTrafficFlow,
  showTrafficIncidents,
  showLocationMarker,
  showMapSwitcherControl,
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
  const isNavigating = useSelector(getIsNavigating);
  const hasReachedDestination = useSelector(getHasReachedDestination);
  const navigationModeTransitioning = useSelector(
    getNavigationModeTransitioning
  );
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
        visible={enableGeolocation && !isNavigating}
      />
      <MapSwitcherControlAlt
        visible={showMapSwitcherControl && !isNavigating}
        selected={mapStyle.name}
        onSelected={handleMapStyleSelected}
      />
      <CompassControl
        visible={!hasReachedDestination}
        onClick={handleCompassControlClick}
      />
      {showLocationMarker && userLocation && !isNavigating && (
        <LocationMarker coordinates={userLocation} />
      )}
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
      <Fade show={isNavigating && !navigationModeTransitioning} duration=".15s">
        <ChevronMarker coordinates={center} />
      </Fade>
      <SpeedLimitControl
        value={speedLimit}
        visible={isNavigating && speedLimit && !hasReachedDestination}
      />
      {children}
    </ReactMap>
  );
};

export default Map;
