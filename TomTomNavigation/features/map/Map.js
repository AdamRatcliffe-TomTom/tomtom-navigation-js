import React, { useRef, useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { useAppContext } from "../../app/AppContext";
import ReactMap from "react-tomtom-maps";
import GeolocateControl from "./controls/GeolocateControl";
import MuteControl from "./controls/MuteControl";
import CompassControl from "./controls/CompassControl";
import MapSwitcherControl from "./controls/MapSwitcherControl";
import NavigationPerspectiveControl from "./controls/NavigationPerspectiveControl";
import SpeedLimitEU from "./SpeedLimitEU";
import SpeedLimitUS from "./SpeedLimitUS";
import Route from "./Route";
import LocationMarker from "./markers/LocationMarker";
import ChevronMarker from "./markers/ChevronMarker";
import Chevron2DMarker from "./markers/Chevron2DMarker";
import MarkerFactory from "./markers/MarkerFactory";
import { useCalculateRouteQuery } from "../../services/routing";
import coordinatesToGeoJson from "../../functions/coordinatesToGeoJson";
import geoJsonBounds from "../../functions/geoJsonBounds";
import countryCodeFromRoute from "../../functions/countryCodeFromRoute";
import shouldAnimateCamera from "../../functions/shouldAnimateCamera";
import fireEvent from "../../functions/fireEvent";
import ComponentEvents from "../../constants/ComponentEvents";
import NavigationPerspectives from "../../constants/NavigationPerspectives";

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
  setCenter,
  setBounds,
  setFitBoundsOptions,
  setPitch,
  setMovingMethod,
  setUserLocation
} from "./mapSlice";

import {
  getVoiceAnnouncementsEnabled,
  getIsNavigating,
  getHasReachedDestination,
  getNavigationTransitioning,
  getNavigationPerspective,
  getCurrentLocation,
  getRemainingRoute,
  setVoiceAnnouncementsEnabled,
  setNavigationPerspective,
  setNavigationTransitioning
} from "../navigation/navigationSlice";

const before = "Borders - Treaty label";

const easing = (v) => v;

const Map = ({
  enableGeolocation,
  showTrafficFlow,
  showTrafficIncidents,
  showPoi,
  showLocationMarker,
  showMapSwitcherControl,
  showMuteControl,
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
  const voiceAnnouncementsEnabled = useSelector(getVoiceAnnouncementsEnabled);
  const isNavigating = useSelector(getIsNavigating);
  const hasReachedDestination = useSelector(getHasReachedDestination);
  const navigationTransitioning = useSelector(getNavigationTransitioning);
  const navigationPerspective = useSelector(getNavigationPerspective);
  const remainingRoute = useSelector(getRemainingRoute);
  const {
    point: currentLocation,
    bearing: currentLocationBearing,
    speedLimit
  } = useSelector(getCurrentLocation);
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
  const geolocateControlIsVisible = enableGeolocation && !isNavigating;
  const muteControlVisible =
    showMuteControl && isNavigating && !hasReachedDestination;
  const mapSwitcherControlIsVisible = showMapSwitcherControl && !isNavigating;
  const compassControlIsVisible = !hasReachedDestination;
  const speedLimitControlIsVisible =
    isNavigating && speedLimit && !hasReachedDestination;
  const navigationPerspectiveControlIsVisible =
    isNavigating && !hasReachedDestination;
  const locationMarkerIsVisible =
    showLocationMarker && userLocation && !isNavigating;
  const chevronMarkerIsVisible =
    isNavigating &&
    !navigationTransitioning &&
    !hasReachedDestination &&
    navigationPerspective === NavigationPerspectives.DRIVING;
  const chevron2DMarkerIsVisible =
    isNavigating &&
    !navigationTransitioning &&
    !hasReachedDestination &&
    navigationPerspective === NavigationPerspectives.ROUTE_OVERVIEW &&
    currentLocation;

  useEffect(() => {
    setMeasurementSystemAuto(countryCode === "US" ? "imperial" : "metric");
  }, [countryCode]);

  useEffect(() => {
    setMapStyle(mapStyles[mapStyle.name]);
  }, [theme]);

  useEffect(() => {
    if (route) {
      fitRoute({ animate: false });

      fireEvent(
        ComponentEvents.route_calculated,
        route.features[0].properties.summary
      );
    }
  }, [route, JSON.stringify(routeOptions.locations)]);

  useEffect(() => {
    const map = mapRef.current.getMap();
    map?.resize();
  }, [width, height]);

  const fitRoute = (fitBoundsOptions) => {
    const geojson =
      route ||
      (routeOptions.locations?.length
        ? coordinatesToGeoJson(
            routeOptions.locations.map((location) => location.coordinates)
          )
        : null);

    if (geojson) {
      const bounds = geoJsonBounds(geojson);

      batch(() => {
        dispatch(setPitch(0));
        dispatch(
          setFitBoundsOptions({
            duration: 500,
            maxZoom: 16,
            ...fitBoundsOptions
          })
        );
        dispatch(setBounds(bounds));
      });
    }
  };

  const handleMapLoad = (map) => {
    const control = map.getAttributionControl();
    map.removeControl(control);
  };

  const handleGeolocationControlClick = (coords) => {
    if (coords) {
      const map = mapRef.current.getMap();
      const { longitude, latitude } = coords;
      const center = [longitude, latitude];
      const movingMethod = shouldAnimateCamera(map.getBounds(), center)
        ? "flyTo"
        : "jumpTo";

      batch(() => {
        dispatch(setMovingMethod(movingMethod));
        dispatch(setCenter(center));
      });
    }
  };

  const handleUserLocationChange = (coords) => {
    if (coords) {
      const { longitude, latitude } = coords;
      dispatch(setUserLocation([longitude, latitude]));
    }
  };

  const handleMuteControlClick = (enabled) => {
    dispatch(setVoiceAnnouncementsEnabled(enabled));
  };

  const handleNavigationPerspectiveControlClick = (perspective) => {
    const map = mapRef.current.getMap();

    batch(() => {
      dispatch(setNavigationTransitioning(true));
      dispatch(setNavigationPerspective(perspective));

      if (perspective === NavigationPerspectives.DRIVING) {
        dispatch(setCenter(currentLocation));
      } else {
        map.__om.setPadding({ top: 0 });
        fitRoute({
          animate: true,
          padding: { top: 200 }
        });
      }
    });

    map.once("zoomend", () => dispatch(setNavigationTransitioning(false)));
  };

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

    return locations.map((location) => MarkerFactory.createMarker(location));
  }, [routeOptions.locations]);

  const currentStyle = useMemo(
    () =>
      isNavigating && mapStyle.styleDriving
        ? mapStyle.styleDriving
        : mapStyle.style,
    [mapStyle, isNavigating]
  );

  const SpeedLimitControl = countryCode === "US" ? SpeedLimitUS : SpeedLimitEU;

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
      animationOptions={{ ...animationOptions, easing }}
      attributionControl={false}
      center={center}
      zoom={zoom}
      bounds={bounds}
      bearing={bearing}
      pitch={pitch}
      onLoad={handleMapLoad}
    >
      <GeolocateControl
        watchPosition={true}
        visible={geolocateControlIsVisible}
        onClick={handleGeolocationControlClick}
        onLocationChange={handleUserLocationChange}
      />
      <NavigationPerspectiveControl
        navigationPerspective={navigationPerspective}
        visible={navigationPerspectiveControlIsVisible}
        onClick={handleNavigationPerspectiveControlClick}
      />
      <MuteControl
        voiceAnnouncementsEnabled={voiceAnnouncementsEnabled}
        visible={muteControlVisible}
        onClick={handleMuteControlClick}
      />
      <MapSwitcherControl
        visible={mapSwitcherControlIsVisible}
        selected={mapStyle.name}
        onSelected={handleMapStyleSelected}
      />
      <CompassControl
        visible={compassControlIsVisible}
        onClick={handleCompassControlClick}
      />
      {locationMarkerIsVisible && <LocationMarker coordinates={userLocation} />}
      {route && (
        <Route before={before} data={route} remainingRoute={remainingRoute} />
      )}
      {waypoints}
      <ChevronMarker visible={chevronMarkerIsVisible} />
      <Chevron2DMarker
        visible={chevron2DMarkerIsVisible}
        coordinates={currentLocation}
        bearing={currentLocationBearing}
        animationDuration={animationOptions.duration}
      />
      <SpeedLimitControl
        value={speedLimit}
        visible={speedLimitControlIsVisible}
      />
      {children}
    </ReactMap>
  );
};

export default Map;
