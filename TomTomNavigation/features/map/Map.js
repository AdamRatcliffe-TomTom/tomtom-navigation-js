import React, { useRef, useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAppContext } from "../../app/AppContext";
import ReactMap from "react-tomtom-maps";
import GeolocateControl from "./GeolocateControl";
import CompassControl from "./CompassControl";
import MapSwitcherControlAlt from "./MapSwitcherControlAlt";
import SpeedLimitUS from "./SpeedLimitUS";
import Route from "./Route";
import LocationMarker from "./LocationMarker";
import DeviceMarker from "./DeviceMarker";
import WaypointMarker from "./WaypointMarker";
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
  getRouteOptions,
  getAutomaticRouteCalculation,
  getFitBoundsOptions,
  getUserLocation,
  setBounds
} from "./mapSlice";

import {
  getIsNavigating,
  getNavigationModeTransitioning,
  getCurrentLocation
} from "../navigation/navigationSlice";

const before = "Borders - Treaty label";

const Map = ({
  enableGeolocation,
  showTrafficFlow,
  showTrafficIncidents,
  showPoi,
  showLocationMarker,
  showMapSwitcherControl,
  children
}) => {
  const dispatch = useDispatch();
  const mapRef = useRef();
  const { apiKey, language, width, height, mapStyles, theme } = useAppContext();
  const isNavigating = useSelector(getIsNavigating);
  const navigationModeTransitioning = useSelector(
    getNavigationModeTransitioning
  );
  const { speedLimit } = useSelector(getCurrentLocation);
  const center = useSelector(getCenter);
  const zoom = useSelector(getZoom);
  const bearing = useSelector(getBearing);
  const pitch = useSelector(getPitch);
  const bounds = useSelector(getBounds);
  const movingMethod = useSelector(getMovingMethod);
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
    setMapStyle(mapStyles[mapStyle.name]);
  }, [theme]);

  useEffect(() => {
    const features =
      route || (routeOptions.locations?.length && routeOptions.locations);

    if (features) {
      const bounds = geoJsonBounds(features);
      dispatch(setBounds(bounds));
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
      <WaypointMarker key={location.toString()} coordinates={location} />
    ));
  }, [routeOptions.locations]);

  const currentStyle = useMemo(
    () =>
      isNavigating && mapStyle.styleDriving
        ? mapStyle.styleDriving
        : mapStyle.style,
    [mapStyle, isNavigating]
  );

  return (
    <ReactMap
      ref={mapRef}
      key={apiKey}
      apiKey={apiKey}
      mapStyle={currentStyle}
      stylesVisibility={{
        trafficFlow: showTrafficFlow,
        trafficIncidents: showTrafficIncidents,
        poi: showPoi
      }}
      language={language}
      containerStyle={{
        width: `${width}px`,
        height: `${height}px`
      }}
      fitBoundsOptions={fitBoundsOptions}
      movingMethod={movingMethod}
      animationOptions={{ essential: true }}
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
      <CompassControl visible onClick={handleCompassControlClick} />
      {showLocationMarker && userLocation && (
        <LocationMarker coordinates={userLocation} />
      )}
      {route && <Route before={before} data={route} />}
      {waypoints}
      <Fade show={isNavigating && !navigationModeTransitioning} duration=".15s">
        <DeviceMarker coordinates={center} />
      </Fade>
      {countryCode === "US" && (
        <SpeedLimitUS value={speedLimit} visible={isNavigating && speedLimit} />
      )}
      {children}
    </ReactMap>
  );
};

export default Map;
