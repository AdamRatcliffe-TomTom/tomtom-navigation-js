import React, { useRef, useEffect } from "react";
import ReactMap from "react-tomtom-maps";
import Route from "./Route";
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
        padding: 30
      }}
      center={center}
      zoom={zoom}
      bounds={getMapBounds()}
    >
      {route && <Route color="#3baee3" before={before} data={route} />}
    </ReactMap>
  );
};

export default Map;
