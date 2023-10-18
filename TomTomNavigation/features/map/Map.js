import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { featureCollection, feature } from "@turf/helpers";
import { useAppContext } from "../../app/AppContext";
import ReactMap, { ZoomControls } from "react-tomtom-maps";
import CompassControl from "./CompassControl";
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
  children
}) => {
  const dispatch = useDispatch();
  const mapRef = useRef();
  const { apiKey, width, height, theme } = useAppContext();
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
  const mapStyle = `https://api.tomtom.com/style/1/style/24.*?map=10-test/basic_street-${theme}&traffic_flow=2/flow_relative-${theme}&traffic_incidents=2/incidents_${theme}&poi=2/poi_${theme}`;

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
      mapStyle={mapStyle}
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
      center={center}
      zoom={zoom}
      bounds={bounds}
      pitch={pitch}
    >
      <CompassControl onClick={handleCompassClick} />
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
