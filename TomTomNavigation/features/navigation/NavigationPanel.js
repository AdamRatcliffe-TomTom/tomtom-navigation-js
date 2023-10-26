import { makeStyles } from "@fluentui/react";
import { withMap } from "react-tomtom-maps";
import { useSelector, useDispatch, batch } from "react-redux";
import ETA from "./ETA";
import { useAppContext } from "../../app/AppContext";
import { useCalculateRouteQuery } from "../../services/routing";
import shouldAnimateCamera from "../../functions/shouldAnimateCamera";
import geoJsonBounds from "../../functions/geoJsonBounds";

import {
  getRouteOptions,
  getAutomaticRouteCalculation,
  setMovingMethod,
  setCenter,
  setZoom,
  setPitch,
  setBounds,
  setFitBoundsOptions
} from "../map/mapSlice";

import {
  setIsNavigating,
  setNavigationModeTransitioning
} from "./navigationSlice";

import { getIsNavigating } from "./navigationSlice";

const useStyles = ({ isPhone, isTablet }) =>
  makeStyles((theme) => ({
    root: {
      position: "absolute",
      bottom: 0,
      left: 0,
      margin: `${theme.spacing.m} ${theme.spacing.m} 0`,
      padding: theme.spacing.l1,
      background: theme.palette.white,
      borderTopLeftRadius: theme.spacing.m,
      borderTopRightRadius: theme.spacing.m,
      boxShadow: "0 0 35px 0 rgba(0, 0, 0, 0.25)",
      zIndex: 10,
      ...(isTablet && {
        width: 380
      }),
      ...(isPhone && {
        right: 0,
        margin: `${theme.spacing.m} ${theme.spacing.m} 0`
      })
    }
  }));

const NavigationPanel = ({ map }) => {
  const dispatch = useDispatch();
  const { apiKey, measurementSystem, isPhone, isTablet } = useAppContext();
  const classes = useStyles({ isPhone, isTablet })();
  const routeOptions = useSelector(getRouteOptions);
  const automaticRouteCalculation = useSelector(getAutomaticRouteCalculation);
  const isNavigating = useSelector(getIsNavigating);
  const { data: route } = useCalculateRouteQuery(
    {
      key: apiKey,
      ...routeOptions
    },
    { skip: !automaticRouteCalculation }
  );

  const handleStartNavigation = () => {
    // Center the map on the first coordinate of the route
    const center = route.features[0].geometry.coordinates[0];
    const movingMethod = shouldAnimateCamera(map.getBounds(), center)
      ? "flyTo"
      : "jumpTo";

    batch(() => {
      dispatch(setIsNavigating(true));
      dispatch(setNavigationModeTransitioning(true));
      dispatch(setMovingMethod(movingMethod));
      dispatch(setCenter(center));
      dispatch(setPitch(60));
      dispatch(setZoom(18));
    });

    // Make map non-interactive when navigating
    getMapCanvas().style.pointerEvents = "none";

    map.once("moveend", () => dispatch(setNavigationModeTransitioning(false)));
  };

  const handleStopNavigation = () => {
    const bounds = geoJsonBounds(route);

    batch(() => {
      dispatch(setIsNavigating(false));
      dispatch(setNavigationModeTransitioning(true));
      dispatch(setFitBoundsOptions({ animate: true }));
      dispatch(setZoom(undefined));
      dispatch(setPitch(0));
      dispatch(setBounds(bounds));
    });

    // Restore map interaction
    getMapCanvas().style.pointerEvents = "all";

    map.once("moveend", () => dispatch(setNavigationModeTransitioning(false)));
  };

  const getMapCanvas = () => map.__om._canvas;

  return route ? (
    <div className={classes.root}>
      <ETA
        route={route}
        measurementSystem={measurementSystem}
        isNavigating={isNavigating}
        onStartNavigation={handleStartNavigation}
        onStopNavigation={handleStopNavigation}
      />
    </div>
  ) : null;
};

export default withMap(NavigationPanel);
