import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { featureCollection, feature } from "@turf/helpers";
import { useAppContext } from "../../app/AppContext";
import ReactMap, { ZoomControls } from "react-tomtom-maps";
import CompassControl from "./CompassControl";
import MapSwitcherControl from "./MapSwitcherControl";
import Route from "./Route";
import LocationMarker from "./LocationMarker";
import DeviceMarker from "./DeviceMarker";
import WaypointMarker from "./WaypointMarker";
import Fade from "../../core/Fade";
import { useCalculateRouteQuery } from "../../services/routing";
import geoJsonBounds from "../../functions/geoJsonBounds";
import tomtom2mapbox from "../../functions/tomtom2mapbox";

import {
  getCenter,
  getZoom,
  getPitch,
  getBounds,
  getMovingMethod,
  getRouteOptions,
  getAutomaticRouteCalculation,
  getFitBoundsOptions,
  setBounds
} from "./mapSlice";

import {
  getIsNavigating,
  getNavigationModeTransitioning,
  setNavigationRoute
} from "../navigation/navigationSlice";

const before = "Borders - Treaty label";

const Map = ({
  showTrafficFlow,
  showTrafficIncidents,
  showPoi,
  showLocationMarker,
  showZoomControl,
  showMapSwitcherControl,
  children
}) => {
  const dispatch = useDispatch();
  const mapRef = useRef();
  const { apiKey, width, height, theme, mapStyles } = useAppContext();
  const isNavigating = useSelector(getIsNavigating);
  const navigationModeTransitioning = useSelector(
    getNavigationModeTransitioning
  );
  const center = useSelector(getCenter);
  const zoom = useSelector(getZoom);
  const pitch = useSelector(getPitch);
  const bounds = useSelector(getBounds);
  const movingMethod = useSelector(getMovingMethod);
  const routeOptions = useSelector(getRouteOptions);
  const automaticRouteCalculation = useSelector(getAutomaticRouteCalculation);
  const fitBoundsOptions = useSelector(getFitBoundsOptions);
  const { data: route } = useCalculateRouteQuery(
    {
      key: apiKey,
      ...routeOptions
    },
    { skip: !automaticRouteCalculation }
  );
  const [mapStyle, setMapStyle] = useState({
    name: "street",
    style: mapStyles.street
  });

  useEffect(() => {
    const { locations } = routeOptions;
    if (locations.length) {
      const bounds = geoJsonBounds(
        featureCollection(
          locations.map((location) =>
            feature({ type: "Point", coordinates: location.toArray() })
          )
        )
      );
      dispatch(setBounds(bounds));
    }
  }, [routeOptions.locations]);

  useEffect(() => {
    if (route) {
      const navigationRoute = tomtom2mapbox(route.features[0]);
      dispatch(setNavigationRoute(navigationRoute));
    }
  }, [route]);

  useEffect(() => {
    const map = mapRef.current.getMap();
    map?.resize();
  }, [width, height]);

  const handleCompassClick = () => {
    const map = mapRef.current.getMap();
    map.easeTo({ bearing: 0, duration: 250 });
  };

  const handleMapStyleSelected = (name) => {
    setMapStyle({
      name,
      style: mapStyles[name]
    });
  };

  const renderWaypoints = () => {
    const { locations } = routeOptions;

    if (!locations) return null;

    return locations.map((location) => (
      <WaypointMarker key={location.toString()} coordinates={location} />
    ));
  };

  return (
    <ReactMap
      ref={mapRef}
      key={apiKey}
      apiKey={apiKey}
      mapStyle={mapStyle.style}
      stylesVisibility={{
        trafficFlow: showTrafficFlow,
        trafficIncidents: showTrafficIncidents,
        poi: showPoi
      }}
      containerStyle={{
        width: `${width}px`,
        height: `${height}px`
      }}
      fitBoundsOptions={fitBoundsOptions}
      movingMethod={movingMethod}
      attributionControl={false}
      center={center}
      zoom={zoom}
      bounds={bounds}
      pitch={pitch}
    >
      <CompassControl onClick={handleCompassClick} />
      {showMapSwitcherControl && !isNavigating && (
        <MapSwitcherControl
          selected={mapStyle.name}
          onSelected={handleMapStyleSelected}
        />
      )}
      {showZoomControl && <ZoomControls />}
      {route && <Route before={before} data={route} />}
      {renderWaypoints()}
      <Fade show={isNavigating && !navigationModeTransitioning} duration=".15s">
        <DeviceMarker />
      </Fade>
      {children}
    </ReactMap>
  );
};

export default Map;
