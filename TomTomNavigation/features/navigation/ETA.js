import React, { useMemo } from "react";
import add from "date-fns/add";
import { useDispatch, useSelector, batch } from "react-redux";
import { withMap } from "react-tomtom-maps";
import { useTheme, DefaultButton } from "@fluentui/react";
import { makeStyles } from "@fluentui/react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import DriveIcon from "../../icons/DriveIcon";
import CrossIcon from "../../icons/CrossIcon";
import JamIcon from "../../icons/JamIcon";
import useTextStyles from "../../hooks/useTextStyles";
import useButtonStyles from "../../hooks/useButtonStyles";
import shouldAnimateCamera from "../../functions/shouldAnimateCamera";
import formatTime from "../../functions/formatTime";
import formatDuration from "../../functions/formatDuration";
import formatDistance from "../../functions/formatDistance";
import geoJsonBounds from "../../functions/geoJsonBounds";

import {
  getIsNavigating,
  setIsNavigating,
  setNavigationModeTransitioning
} from "./navigationSlice";

import {
  setMovingMethod,
  setCenter,
  setZoom,
  setPitch,
  setBounds,
  setFitBoundsOptions
} from "../map/mapSlice";

const useStyles = makeStyles({
  root: {
    width: "100%"
  }
});

const ETA = ({ map, route, measurementSystem }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const classes = useStyles();
  const textClasses = useTextStyles();
  const buttonClasses = useButtonStyles();
  const isNavigating = useSelector(getIsNavigating);
  const { summary } = route.features[0].properties;
  const { travelTimeInSeconds, lengthInMeters, trafficDelayInSeconds } =
    summary;
  const duration = formatDuration(travelTimeInSeconds);
  const distance = formatDistance(lengthInMeters, measurementSystem);
  const delay = formatDuration(trafficDelayInSeconds);
  const showTrafficDelay = trafficDelayInSeconds >= 60;

  const eta = useMemo(
    () => formatTime(add(new Date(), { seconds: travelTimeInSeconds })),
    [travelTimeInSeconds]
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

  return (
    <Stack
      className={classes.root}
      tokens={{ childrenGap: theme.spacing.s1 }}
      horizontal
      horizontalAlign="space-between"
      verticalAlign="center"
    >
      <Stack tokens={{ childrenGap: theme.spacing.s1 }}>
        <Stack horizontal verticalAlign="baseline" tokens={{ childrenGap: 6 }}>
          <Text className={textClasses.primaryText}>{eta.time}</Text>
          <Text className={textClasses.primaryUnitsText}>{eta.meridiem}</Text>
        </Stack>
        <Stack horizontal tokens={{ childrenGap: theme.spacing.s1 }}>
          <Text
            className={textClasses.secondaryText}
          >{`${distance.value} ${distance.units}`}</Text>
          <Text className={textClasses.secondaryText}>⸱</Text>
          <Text className={textClasses.secondaryText}>{duration}</Text>
          {showTrafficDelay && (
            <Stack horizontal tokens={{ childrenGap: 6 }}>
              <Text className={textClasses.secondaryText}>⸱</Text>
              <JamIcon color={theme.semanticColors.surfaceContentCritical} />
              <Text className={textClasses.warningText}>{delay}</Text>
            </Stack>
          )}
        </Stack>
      </Stack>
      {isNavigating ? (
        <DefaultButton
          className={buttonClasses.circularButton}
          onRenderIcon={() => <CrossIcon color={theme.palette.black} />}
          onClick={handleStopNavigation}
        />
      ) : (
        <DefaultButton
          className={buttonClasses.circularButton}
          onRenderIcon={() => <DriveIcon color={theme.palette.black} />}
          onClick={handleStartNavigation}
        />
      )}
    </Stack>
  );
};

export default withMap(ETA);
