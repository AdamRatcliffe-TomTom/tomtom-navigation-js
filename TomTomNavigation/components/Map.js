import React, { useRef, useEffect } from "react";
import ReactMap from "react-tomtom-maps";
import CompassControl from "./CompassControl";
import RouteOverviewPanel from "./RouteOverviewPanel";
import Route from "./Route";
import LocationMarker from "./LocationMarker";
import WaypointMarker from "./WaypointMarker";
import { useCalculateRouteQuery } from "../services/routing";
import usePrevious from "../hooks/usePrevious";
import geoJsonBounds from "../functions/geoJsonBounds";

const before = "Borders - Treaty label";

const Map = ({
  apiKey,
  center,
  zoom,
  routeWaypoints,
  fitRouteBounds,
  width,
  height
}) => {
  const mapRef = useRef();
  const prevWidth = usePrevious(width);
  const prevHeight = usePrevious(height);
  const isPhone = width <= 428;

  const { data: route } = useCalculateRouteQuery({
    key: apiKey,
    locations: routeWaypoints
  });

  useEffect(() => {
    if (width !== prevWidth || height !== prevHeight) {
      const map = mapRef.current.getMap();
      map?.resize();
    }
  });

  const getMapBounds = () =>
    fitRouteBounds && route ? geoJsonBounds(route) : undefined;

  const renderWaypoints = () => {
    if (!routeWaypoints) return null;

    return routeWaypoints.map((waypoint, index) =>
      index === 0 ? (
        <LocationMarker
          key={waypoint.toString()}
          coordinates={routeWaypoints[0]}
        />
      ) : (
        <WaypointMarker key={waypoint.toString()} coordinates={waypoint} />
      )
    );
  };

  return (
    <ReactMap
      ref={mapRef}
      key={apiKey}
      apiKey={apiKey}
      mapStyle="https://api.tomtom.com/style/1/style/24.*?map=10-test/basic_street-light"
      containerStyle={{
        width: `${width}px`,
        height: `${height}px`
      }}
      fitBoundsOptions={{
        padding: { top: 50, right: 50, bottom: 150, left: 50 }
      }}
      center={center}
      zoom={zoom}
      bounds={getMapBounds()}
    >
      <CompassControl />
      {route && (
        <>
          <Route color="#3baee3" before={before} data={route} />
          <RouteOverviewPanel route={route} isPhone={isPhone} />
        </>
      )}
      {renderWaypoints()}
    </ReactMap>
  );
};

export default Map;
