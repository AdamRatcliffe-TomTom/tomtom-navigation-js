import React, { useRef, useEffect, useMemo } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import ReactMap from "react-tomtom-maps";
import CompassControl from "./CompassControl";
import Route from "./Route";
import LocationMarker from "./LocationMarker";
import WaypointMarker from "./WaypointMarker";
import { useCalculateRouteQuery } from "../../services/routing";
import geoJsonBounds from "../../functions/geoJsonBounds";
import { useAppContext } from "../../app/AppContext";

import {
  getCenter,
  getZoom,
  getPitch,
  getMovingMethod,
  getRouteOptions,
  setCenter,
  setZoom,
  setPitch
} from "./mapSlice";

const before = "Borders - Treaty label";

const Map = ({
  initialCenter,
  initialZoom,
  showTrafficFlow,
  showTrafficIncidents,
  showPoi,
  showLocationMarker,
  children
}) => {
  const dispatch = useDispatch();
  const mapRef = useRef();
  const { apiKey, width, height, theme } = useAppContext();
  const center = useSelector(getCenter) || initialCenter;
  const zoom = useSelector(getZoom) || initialZoom;
  const pitch = useSelector(getPitch);
  const movingMethod = useSelector(getMovingMethod);
  const routeOptions = useSelector(getRouteOptions);
  const { data: route } = useCalculateRouteQuery({
    key: apiKey,
    ...routeOptions
  });
  const bounds = useMemo(
    () => (route ? geoJsonBounds(route) : undefined),
    [route]
  );
  const mapStyle = `https://api.tomtom.com/style/1/style/24.*?map=10-test/basic_street-${theme}&traffic_flow=2/flow_relative-${theme}&traffic_incidents=2/incidents_${theme}&poi=2/poi_${theme}`;

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

    const items = [];
    for (let i = 0; i < locations.length; i++) {
      const waypoint = locations[i];
      if (i === 0) {
        if (showLocationMarker) {
          items.push(
            <LocationMarker key={waypoint.toString()} coordinates={waypoint} />
          );
        }
      } else {
        items.push(
          <WaypointMarker key={waypoint.toString()} coordinates={waypoint} />
        );
      }
    }
    return items;
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
      fitBoundsOptions={{
        padding: { top: 80, right: 40, bottom: 150, left: 40 },
        animate: false
      }}
      movingMethod={movingMethod}
      center={center}
      zoom={zoom}
      bounds={bounds}
      pitch={pitch}
    >
      <CompassControl onClick={handleCompassClick} />
      {route && <Route before={before} data={route} />}
      {renderWaypoints()}
      {children}
    </ReactMap>
  );
};

export default Map;
