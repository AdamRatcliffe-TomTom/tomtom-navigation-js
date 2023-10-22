import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAppContext } from "../../app/AppContext";
import ReactMap from "react-tomtom-maps";
import GeolocateControl from "./GeolocateControl";
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
  addStyleToDocument,
  removeStyleFromDocument
} from "../../functions/styles";

import {
  getCenter,
  getZoom,
  getPitch,
  getBounds,
  getMovingMethod,
  getRouteOptions,
  getAutomaticRouteCalculation,
  getFitBoundsOptions,
  getUserLocation,
  setBounds,
  setFitBoundsOptions
} from "./mapSlice";

import {
  getShowNavigationPanel,
  getIsNavigating,
  getNavigationModeTransitioning,
  setNavigationRoute
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
  const { apiKey, language, width, height, mapStyles, theme, isPhone } =
    useAppContext();
  const showNavigationPanel = useSelector(getShowNavigationPanel);
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
  const userLocation = useSelector(getUserLocation);
  const { data: route } = useCalculateRouteQuery(
    {
      key: apiKey,
      ...routeOptions
    },
    { skip: !automaticRouteCalculation }
  );
  const [mapStyle, setMapStyle] = useState(mapStyles.street);

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
    if (route) {
      const navigationRoute = tomtom2mapbox(route.features[0]);
      dispatch(setNavigationRoute(navigationRoute));
    }
  }, [route]);

  useEffect(() => {
    const map = mapRef.current.getMap();
    map?.resize();
  }, [width, height]);

  useEffect(() => {
    if (route && showNavigationPanel) {
      if (isPhone) {
        addStyleToDocument(
          "bottom-control-margin",
          ".TomTomNavigation .mapboxgl-ctrl-bottom-left .mapboxgl-ctrl, .TomTomNavigation .mapboxgl-ctrl-bottom-right .mapboxgl-ctrl {margin-bottom: 112px;}"
        );
      } else {
        removeStyleFromDocument("bottom-control-margin");
      }
      dispatch(
        setFitBoundsOptions({
          padding: { bottom: 150 }
        })
      );
    } else {
      removeStyleFromDocument("bottom-control-margin");

      dispatch(
        setFitBoundsOptions({
          padding: { bottom: 40 }
        })
      );
    }
  }, [route, showNavigationPanel, isPhone]);

  const handleCompassControlClick = () => {
    const map = mapRef.current.getMap();
    map.easeTo({ bearing: 0, duration: 250 });
  };

  const handleMapStyleSelected = (name) => {
    setMapStyle(mapStyles[name]);
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
      pitch={pitch}
    >
      {enableGeolocation && <GeolocateControl watchPosition={true} />}
      <CompassControl onClick={handleCompassControlClick} />
      {showMapSwitcherControl && !isNavigating && (
        <MapSwitcherControl
          selected={mapStyle.name}
          onSelected={handleMapStyleSelected}
        />
      )}
      {showLocationMarker && userLocation && (
        <LocationMarker coordinates={userLocation} />
      )}
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
