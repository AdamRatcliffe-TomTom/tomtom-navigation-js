import React, { useRef, useEffect, useState } from "react";
import ReactMap from "react-tomtom-maps";
import CompassControl from "./CompassControl";
import RouteOverviewPanel from "./RouteOverviewPanel";
import Route from "./Route";
import LocationMarker from "./LocationMarker";
import WaypointMarker from "./WaypointMarker";
import { useCalculateRouteQuery } from "../services/routing";
import usePrevious from "../hooks/usePrevious";
import geoJsonBounds from "../functions/geoJsonBounds";

import { useAppContext } from "../AppContext";

const before = "Borders - Treaty label";

const Map = ({ apiKey, center, zoom, routeWaypoints, fitRouteBounds }) => {
  const mapRef = useRef();

  const { width, height } = useAppContext();
  const prevWidth = usePrevious(width);
  const prevHeight = usePrevious(height);

  const { data: route } = useCalculateRouteQuery({
    key: apiKey,
    locations: routeWaypoints,
    sectionType: ["speedLimit", "lanes"],
    instructionsType: "text",
    instructionAnnouncementPoints: "all",
    instructionRoadShieldReferences: "all"
  });

  useEffect(() => {
    if (width !== prevWidth || height !== prevHeight) {
      const map = mapRef.current.getMap();
      map?.resize();
    }
  });

  const getMapBounds = () =>
    fitRouteBounds && route ? geoJsonBounds(route) : undefined;

  const handleCompassClick = () => {
    const map = mapRef.current.getMap();
    map.easeTo({ bearing: 0, duration: 250 });
  };

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
      movingMethod="easeTo"
    >
      <CompassControl onClick={handleCompassClick} />
      {route && (
        <>
          <Route color="#3baee3" before={before} data={route} />
          <RouteOverviewPanel route={route} />
        </>
      )}
      {renderWaypoints()}
    </ReactMap>
  );
};

export default Map;
