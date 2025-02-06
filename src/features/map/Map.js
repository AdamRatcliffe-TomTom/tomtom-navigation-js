import React, { useRef, useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { featureCollection } from "@turf/helpers";
import isPlainObject from "lodash.isplainobject";
import turfCenter from "@turf/center";
import ReactMap from "react-tomtom-maps";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { GeoJsonLayer } from "@deck.gl/layers";
import { useLayers } from "./hooks/LayersContext";
import { useNavigationContext } from "../../core/NavigationContext";
import { useFieldOfView } from "./hooks/useFieldOfView";
import GeolocateControl from "./controls/GeolocateControl";
import MuteControl from "./controls/MuteControl";
import CompassControl from "./controls/CompassControl";
import MapSwitcherControl from "./controls/MapSwitcherControl";
import NavigationPerspectiveControl from "./controls/NavigationPerspectiveControl";
import WatermarkControl from "./controls/WatermarkControl";
import ZoomControl from "./controls/ZoomControl";
import ExitControl from "./controls/ExitControl";
import SkipControl from "./controls/SkipControl";
import SpeedLimitEU from "./SpeedLimitEU";
import SpeedLimitUS from "./SpeedLimitUS";
import Route from "./Route";
import MarkerLayer from "./MarkerLayer";
import ManeuverArrows from "./ManeuverArrowsDeck";
import LocationMarker from "./markers/LocationMarker";
import LocationIcon from "../../icons/LocationIcon";
import ChevronIcon from "../../icons/ChevronIcon";
import Chevron2DIcon from "../../icons/Chevron2DIcon";
import ChevronMarker from "./markers/ChevronMarker";
import Chevron2DMarker from "./markers/Chevron2DMarker";
import { useCalculateRouteQuery } from "../../services/routing";
import calculateFitBoundsOptions from "../../functions/calculateFitBoundsOptions";
import geoJsonBounds from "../../functions/geoJsonBounds";
import countryCodeFromRoute from "../../functions/countryCodeFromRoute";
import shouldAnimateCamera from "../../functions/shouldAnimateCamera";
import fireEvent from "../../functions/fireEvent";
import isPedestrianRoute from "../../functions/isPedestrianRoute";
import { processRouteFeatures } from "./RouteMarkers";
import ControlEvents from "../../constants/ControlEvents";
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
  getViewTransitioning,
  getCountryCode,
  setCenter,
  setBounds,
  setFitBoundsOptions,
  setMovingMethod,
  setUserLocation,
  setViewTransitioning,
  setSpriteImageUrl,
  setSpriteJson,
  setCountryCode
} from "./mapSlice";

import {
  getVoiceAnnouncementsEnabled,
  getIsNavigating,
  getHasReachedDestination,
  getNavigationPerspective,
  getCurrentLocation,
  getNextInstruction,
  getRouteTravelled,
  setVoiceAnnouncementsEnabled,
  setNavigationPerspective,
  setSimulationShouldEnd,
  resetNavigation
} from "../navigation/navigationSlice";

const poiLayerId = "POI";
const buildings3DLayerId = "3D - Building";
const routeBeforeId = "TransitLabels - Ferry";
const pedestrianRouteBeforeId = "Borders - Treaty";
const maneuverArrowsBeforeId = "Places - Country name";

const easing = (v) => v;
const defaultMapOptions = { maxZoom: 20 };

const Map = ({
  enableGeolocation = true,
  simulatedLocation,
  showTrafficFlow = false,
  showTrafficIncidents = false,
  showWatermark = true,
  showPoi = false,
  showBuildings3D = true,
  showLocationMarker = true,
  showMapSwitcherControl = true,
  showMuteControl = true,
  showExitControl = false,
  showZoomControl = false,
  showSkipControl = false,
  showManeuverArrows = true,
  showWalkingLeg = true,
  mapConfig = {},
  renderLayers,
  preCalculatedRoute,
  fitRoute = true,
  animateFitRoute = false,
  alwaysUseDrivingStyle = false,
  debugFOV = false,
  onMapReady = () => {},
  onRouteUpdated = () => {},
  onComponentExit = () => {},
  children
}) => {
  const dispatch = useDispatch();
  const mapRef = useRef();
  const deckOverlayRef = useRef();
  const styleLoaded = useRef(false);

  const {
    apiKey,
    language,
    width,
    height,
    mapStyles,
    theme,
    guidancePanelHeight,
    bottomPanelHeight,
    setMeasurementSystemAuto,
    isPhone,
    safeAreaInsets
  } = useNavigationContext();
  const { layers, addLayer, removeLayer } = useLayers();
  const voiceAnnouncementsEnabled = useSelector(getVoiceAnnouncementsEnabled);
  const isNavigating = useSelector(getIsNavigating);
  const hasReachedDestination = useSelector(getHasReachedDestination);
  const viewTransitioning = useSelector(getViewTransitioning);
  const navigationPerspective = useSelector(getNavigationPerspective);
  const routeTravelled = useSelector(getRouteTravelled);
  const {
    point: currentLocation,
    bearing: currentLocationBearing,
    speedLimit
  } = useSelector(getCurrentLocation);
  const nextInstruction = useSelector(getNextInstruction);
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
  const countryCode = useSelector(getCountryCode);
  const [mapStyle, setMapStyle] = useState(mapStyles.street);
  const [isResizing, setIsResizing] = useState(false);
  const {
    data: { route, sectionedRoute, walkingLeg, maneuverLineStrings } = {}
  } = useCalculateRouteQuery({
    key: apiKey,
    preCalculatedRoute,
    automaticRouteCalculation,
    ...routeOptions
  });

  const fieldOfView = useFieldOfView(mapRef, debugFOV, safeAreaInsets, [
    safeAreaInsets,
    animationOptions,
    fitBoundsOptions
  ]);
  const pedestrianRoute = isPedestrianRoute(route);
  const routeFitBoundsOptions = useMemo(
    () =>
      calculateFitBoundsOptions({
        isPhone,
        guidancePanelHeight,
        bottomPanelHeight,
        safeAreaInsets,
        animate: animateFitRoute
      }),
    [
      isPhone,
      animateFitRoute,
      guidancePanelHeight,
      bottomPanelHeight,
      safeAreaInsets
    ]
  );
  const locationIconStyle = useMemo(
    () =>
      pedestrianRoute
        ? {
            transform: `rotateX(${pitch}deg)`,
            transformOrigin: "center",
            transition: "transform 0.1s"
          }
        : {
            marginBottom: 28
          },
    [pedestrianRoute, pitch]
  );

  const markerLayerData = useMemo(() => {
    if (
      preCalculatedRoute?.features?.some(
        (feature) => feature.geometry.type === "Point"
      )
    ) {
      return processRouteFeatures(preCalculatedRoute);
    }

    if (routeOptions.locations) {
      return processRouteFeatures(routeOptions.locations);
    }

    return null;
  }, [preCalculatedRoute, routeOptions.locations]);

  const stylesVisibility = useMemo(
    () => ({
      trafficFlow: showTrafficFlow,
      trafficIncidents: showTrafficIncidents
    }),
    [showTrafficFlow, showTrafficIncidents]
  );

  const memoizedAnimationOptions = useMemo(
    () => ({ ...animationOptions, easing }),
    [animationOptions, easing]
  );

  const containerStyle = useMemo(
    () => ({
      width,
      height
    }),
    [width, height]
  );

  const mapOptions = useMemo(
    () => ({
      ...defaultMapOptions,
      ...mapConfig
    }),
    [mapConfig]
  );

  const routeIsVisible = !!route;
  const maneuverArrowsAreVisible =
    showManeuverArrows &&
    !!route &&
    isNavigating &&
    navigationPerspective === NavigationPerspectives.FOLLOW;
  const watermarkControlVisible = showWatermark && !isNavigating;
  const geolocateControlIsVisible =
    enableGeolocation && !simulatedLocation && !isNavigating;
  const muteControlVisible =
    showMuteControl && isNavigating && !hasReachedDestination;
  const mapSwitcherControlIsVisible = showMapSwitcherControl && !isNavigating;
  const compassControlIsVisible = !isNavigating;
  const speedLimitControlIsVisible =
    isNavigating && speedLimit && !hasReachedDestination;
  const navigationPerspectiveControlIsVisible =
    isNavigating && !hasReachedDestination;
  const exitControlIsVisible = showExitControl && !isNavigating;
  const zoomControlIsVisible = showZoomControl && !isPhone && !isNavigating;
  const skipControlIsVisible =
    showSkipControl && isNavigating && !hasReachedDestination;
  const locationMarkerIsVisible =
    enableGeolocation && showLocationMarker && userLocation && !isNavigating;
  const chevronMarkerIsVisible =
    isNavigating &&
    !isResizing &&
    !viewTransitioning &&
    !hasReachedDestination &&
    navigationPerspective === NavigationPerspectives.FOLLOW;
  const chevron2DMarkerIsVisible =
    isNavigating &&
    !isResizing &&
    !viewTransitioning &&
    navigationPerspective === NavigationPerspectives.OVERVIEW &&
    currentLocation;

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const handleResizeStart = () => {
      setIsResizing(true);

      setTimeout(() => handleResizeEnd(), 2000);
    };

    const handleResizeEnd = () => setIsResizing(false);

    map.on("resize", handleResizeStart);

    const eventData = { map };

    onMapReady(eventData);

    return () => {
      map.off("resize", handleResizeStart);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current?.getMap();

    if (map) {
      const deckOverlay = new MapboxOverlay({ interleaved: true, layers: [] });
      map.addControl(deckOverlay);
      deckOverlayRef.current = deckOverlay;

      const container = map.getContainer();
      const observer = new ResizeObserver(() => map.resize());
      observer.observe(container);

      const onStyleLoad = () => (styleLoaded.current = true);

      map.on("style.load", onStyleLoad);

      return () => {
        observer?.unobserve(container);
        map.off("style.load", onStyleLoad);
      };
    }
  }, [mapRef.current]);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    const deckOverlay = deckOverlayRef.current;

    if (map && deckOverlay) {
      const instantiatedLayers = layers.map((layer) =>
        isPlainObject(layer) ? new GeoJsonLayer(layer) : layer
      );

      if (styleLoaded.current) {
        deckOverlay.setProps({
          layers: instantiatedLayers
        });
      } else {
        map.once("style.load", () => {
          deckOverlay.setProps({
            layers: instantiatedLayers
          });
          1;
        });
      }
    }
  }, [mapRef.current, deckOverlayRef.current, styleLoaded.current, layers]);

  useEffect(() => {
    setMeasurementSystemAuto(countryCode === "US" ? "imperial" : "metric");
  }, [countryCode]);

  useEffect(() => {
    setMapStyle(mapStyles[mapStyle.name]);
  }, [theme]);

  useEffect(() => {
    if (
      !viewTransitioning &&
      !isNavigating &&
      fitRoute &&
      (routeOptions?.locations || route)
    ) {
      fitRouteOrWaypoints(routeFitBoundsOptions);
    }
  }, [
    useMemo(
      () => JSON.stringify(routeOptions.locations),
      [routeOptions.locations]
    ),
    route,
    fitRoute,
    isNavigating,
    routeFitBoundsOptions,
    viewTransitioning
  ]);

  useEffect(() => {
    const setCountryCodeFromRoute = async () => {
      const countryCode = await countryCodeFromRoute(apiKey, route);
      dispatch(setCountryCode(countryCode));
    };

    const updateRoute = () => {
      const routeFeature = route.features[0];
      const eventData = { route: routeFeature };

      dispatch(resetNavigation());

      // TODO: timeout should not be necessary as store should already be updated using
      // the thunk
      setTimeout(() => {
        fireEvent(ControlEvents.OnRouteUpdated, eventData);
        onRouteUpdated(eventData);
      }, 50);
    };

    if (route) {
      setCountryCodeFromRoute();
      updateRoute();
    }
  }, [route, apiKey, dispatch]);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    const visibility = showPoi ? "visible" : "none";

    if (styleLoaded.current) {
      if (map.getLayer(poiLayerId)) {
        map.setLayoutProperty(poiLayerId, "visibility", visibility);
      }
    } else {
      map.on("style.load", () => {
        if (map.getLayer(poiLayerId)) {
          map.setLayoutProperty(poiLayerId, "visibility", visibility);
        }
      });
    }
  }, [mapRef.current, showPoi]);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    const visibility = showBuildings3D ? "visible" : "none";

    if (styleLoaded.current) {
      if (map.getLayer(buildings3DLayerId)) {
        map.setLayoutProperty(buildings3DLayerId, "visibility", visibility);
      }
    } else {
      map.on("style.load", () => {
        if (map.getLayer(buildings3DLayerId)) {
          map.setLayoutProperty(buildings3DLayerId, "visibility", visibility);
        }
      });
    }
  }, [mapRef.current, showBuildings3D]);

  useEffect(() => {
    if (simulatedLocation) {
      dispatch(setUserLocation(simulatedLocation));
    }
  }, [simulatedLocation]);

  const setMapSprite = async (map) => {
    try {
      const spriteUrl = map.getStyle().sprite;
      const [baseUrl, queryParams] = spriteUrl.split("?");
      const spriteImageUrl = `${baseUrl}@2x.png?${queryParams}`;
      const spriteJsonUrl = `${baseUrl}@2x.json?${queryParams}`;
      const response = await fetch(spriteJsonUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch sprite JSON");
      }

      const spriteJson = await response.json();

      batch(() => {
        dispatch(setSpriteImageUrl(spriteImageUrl));
        dispatch(setSpriteJson(spriteJson));
      });
    } catch (error) {
      console.error("Error fetching sprite JSON:", error);
    }
  };

  const fitRouteOrWaypoints = (fitBoundsOptions) => {
    if (
      !route &&
      (!routeOptions.locations ||
        (Array.isArray(routeOptions.locations) &&
          routeOptions.locations.length === 0))
    ) {
      return;
    }

    let geojson = null;

    if (Array.isArray(routeOptions.locations)) {
      geojson = featureCollection(routeOptions.locations);
    } else if (routeOptions.locations?.type === "FeatureCollection") {
      geojson = routeOptions.locations;
    }

    if (route && geojson) {
      geojson = featureCollection([...route.features, ...geojson.features]);
    }

    if (geojson) {
      const map = mapRef.current.getMap();
      const bounds = geoJsonBounds(geojson);
      const center = turfCenter(geojson);
      const shouldAnimate =
        fitBoundsOptions.animate &&
        shouldAnimateCamera(map.getBounds(), center);

      batch(() => {
        dispatch(
          setFitBoundsOptions({
            bearing: 0,
            pitch: 0,
            duration: 750,
            ...fitBoundsOptions,
            animate: shouldAnimate
          })
        );
        dispatch(setBounds(bounds));
      });
    }
  };

  const handleMapLoad = async (map) => {
    try {
      const control = map.getAttributionControl();
      map.removeControl(control);
    } catch (e) {}
    setMapSprite(map);
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
      dispatch(setViewTransitioning(true));
      dispatch(setNavigationPerspective(perspective));

      if (perspective === NavigationPerspectives.FOLLOW) {
        dispatch(setCenter(currentLocation));
      } else {
        map.__om.setPadding({ top: 0, left: 0 });
        fitRouteOrWaypoints(routeFitBoundsOptions);
      }
    });

    map.once("zoomend", () => dispatch(setViewTransitioning(false)));
  };

  const handleCompassControlClick = () => {
    if (isNavigating) {
      return;
    }

    const map = mapRef.current.getMap();
    map.easeTo({ bearing: 0, duration: 250 });
  };

  const handleMapStyleSelected = (name) => {
    setMapStyle(mapStyles[name]);
  };

  const handleSkip = () => {
    if (isNavigating) {
      dispatch(setSimulationShouldEnd(true));
    }
  };

  const currentStyle = useMemo(
    () =>
      (isNavigating || alwaysUseDrivingStyle) && mapStyle.styleDriving
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
      stylesVisibility={stylesVisibility}
      language={language}
      containerStyle={containerStyle}
      mapOptions={mapOptions}
      fitBoundsOptions={fitBoundsOptions}
      movingMethod={movingMethod}
      animationOptions={memoizedAnimationOptions}
      attributionControl={false}
      center={center}
      zoom={zoom}
      bounds={bounds}
      bearing={bearing}
      pitch={pitch}
      onLoad={handleMapLoad}
    >
      <WatermarkControl visible={watermarkControlVisible} />
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
      <ExitControl visible={exitControlIsVisible} onClick={onComponentExit} />
      <SkipControl visible={skipControlIsVisible} onClick={handleSkip} />
      <ZoomControl visible={zoomControlIsVisible} />
      {locationMarkerIsVisible && <LocationMarker coordinates={userLocation} />}
      {routeIsVisible && (
        <Route
          before={routeBeforeId}
          pedestrianBefore={pedestrianRouteBeforeId}
          routeTravelled={routeTravelled}
          routeRemaining={sectionedRoute}
          walkingLeg={showWalkingLeg ? walkingLeg : null}
          isPedestrianRoute={pedestrianRoute}
        />
      )}
      {maneuverArrowsAreVisible && (
        <ManeuverArrows
          before={maneuverArrowsBeforeId}
          data={maneuverLineStrings}
          nextInstructionPointIndex={nextInstruction?.pointIndex}
        />
      )}
      {renderLayers &&
        renderLayers({
          map: mapRef.current?.getMap(),
          addLayer,
          removeLayer
        })}
      {markerLayerData && <MarkerLayer data={markerLayerData} />}
      <ChevronMarker
        visible={chevronMarkerIsVisible}
        icon={
          pedestrianRoute ? (
            <LocationIcon size={34} style={locationIconStyle} />
          ) : (
            <ChevronIcon style={locationIconStyle} />
          )
        }
      />
      <Chevron2DMarker
        visible={chevron2DMarkerIsVisible}
        coordinates={currentLocation}
        bearing={currentLocationBearing}
        animationDuration={animationOptions.duration}
        icon={pedestrianRoute ? <LocationIcon /> : <Chevron2DIcon />}
      />
      <SpeedLimitControl
        value={speedLimit}
        visible={speedLimitControlIsVisible}
      />
      {children}
      {fieldOfView}
    </ReactMap>
  );
};

export default Map;
