import React, { useRef, useEffect, useMemo } from "react";
import ReactMap from "react-tomtom-maps";
import CompassControl from "./CompassControl";
import RouteOverviewPanel from "../navigation/RouteOverviewPanel";
import Route from "./Route";
import LocationMarker from "./LocationMarker";
import WaypointMarker from "./WaypointMarker";
import { useCalculateRouteQuery } from "../../services/routing";
import geoJsonBounds from "../../functions/geoJsonBounds";
import { useAppContext } from "../../app/AppContext";

const before = "Borders - Treaty label";

const Map = ({
  apiKey,
  theme,
  showTrafficFlow,
  showTrafficIncidents,
  showPoi,
  center,
  zoom,
  showLocationMarker,
  routeWaypoints,
  travelMode,
  traffic,
  fitRouteBounds
}) => {
  const mapRef = useRef();
  const { width, height } = useAppContext();
  const { data: route } = useCalculateRouteQuery({
    key: apiKey,
    locations: routeWaypoints,
    travelMode,
    traffic,
    sectionType: ["speedLimit", "lanes"],
    instructionsType: "text",
    instructionAnnouncementPoints: "all",
    instructionRoadShieldReferences: "all",
    language: navigator.language
  });
  const bounds = useMemo(
    () => (fitRouteBounds && route ? geoJsonBounds(route) : undefined),
    [fitRouteBounds, route]
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
    if (!routeWaypoints) return null;

    const items = [];
    for (let i = 0; i < routeWaypoints.length; i++) {
      const waypoint = routeWaypoints[i];
      if (i === 0) {
        if (showLocationMarker) {
          items.push(
            <LocationMarker
              key={waypoint.toString()}
              coordinates={routeWaypoints[0]}
            />
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
        padding: { top: 80, right: 40, bottom: 150, left: 40 }
      }}
      center={center}
      zoom={zoom}
      bounds={bounds}
      movingMethod="easeTo"
    >
      <CompassControl onClick={handleCompassClick} />
      {route && (
        <>
          <Route before={before} data={route} />
          <RouteOverviewPanel route={route} />
        </>
      )}
      {renderWaypoints()}
    </ReactMap>
  );
};

export default Map;
