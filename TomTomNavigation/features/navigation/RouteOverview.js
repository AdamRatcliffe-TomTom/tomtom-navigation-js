import React from "react";
import { useDispatch, useSelector, batch } from "react-redux";
import { withMap } from "react-tomtom-maps";
import { useTheme, PrimaryButton } from "@fluentui/react";
import { makeStyles } from "@fluentui/react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import DriveIcon from "../../icons/DriveIcon";
import useTextStyles from "../../hooks/useTextStyles";
import useButtonStyles from "../../hooks/useButtonStyles";
import formatDuration from "../../functions/formatDuration";
import formatDistance from "../../functions/formatDistance";
import geoJsonBounds from "../../functions/geoJsonBounds";
import strings from "../../config/strings";

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

const RouteOverview = ({ map, route }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const classes = useStyles();
  const textClasses = useTextStyles();
  const buttonClasses = useButtonStyles();
  const isNavigating = useSelector(getIsNavigating);
  const { summary, legs } = route.features[0].properties;
  const { travelTimeInSeconds, lengthInMeters } = summary;
  const numStops = legs.length;
  const duration = formatDuration(travelTimeInSeconds);
  const distance = formatDistance(lengthInMeters);

  const handleStartNavigation = () => {
    // Center the map on the first coordinate of the route
    const center = route.features[0].geometry.coordinates[0];

    batch(() => {
      dispatch(setIsNavigating(true));
      dispatch(setNavigationModeTransitioning(true));
      dispatch(setMovingMethod("flyTo"));
      dispatch(setCenter(center));
      dispatch(setPitch(60));
      dispatch(setZoom(18));
      dispatch(setBounds(undefined));
    });

    map.once("moveend", () => dispatch(setNavigationModeTransitioning(false)));
  };

  const handleStopNavigation = () => {
    const bounds = geoJsonBounds(route);

    batch(() => {
      dispatch(setIsNavigating(false));
      dispatch(setNavigationModeTransitioning(true));
      dispatch(setFitBoundsOptions({ animate: true }));
      dispatch(setCenter(undefined));
      dispatch(setZoom(undefined));
      dispatch(setPitch(0));
      dispatch(setBounds(bounds));
    });

    map.once("moveend", () => dispatch(setNavigationModeTransitioning(false)));
  };

  return (
    <Stack
      className={classes.root}
      tokens={{ childrenGap: theme.spacing.s1 }}
      horizontal
      horizontalAlign="space-between"
      verticalAlign="center"
    >
      <Stack tokens={{ childrenGap: theme.spacing.s1 }}>
        <Text
          className={textClasses.primaryText}
          variant="xLarge"
        >{`${duration} ${duration > 3600 ? "hr" : "min"}`}</Text>
        <Stack horizontal tokens={{ childrenGap: theme.spacing.s2 }}>
          <Text
            className={textClasses.secondaryText}
            variant="xLarge"
          >{`${distance.value} ${distance.units}`}</Text>
          {numStops > 1 && (
            <Text className={textClasses.secondaryText} variant="xLarge">
              {`⸱ ${numStops} ${strings.stops}`}
            </Text>
          )}
        </Stack>
      </Stack>
      {isNavigating ? (
        <PrimaryButton
          className={[buttonClasses.largeButton, buttonClasses.warningButton]}
          text={strings.exit}
          onClick={handleStopNavigation}
        />
      ) : (
        <PrimaryButton
          className={buttonClasses.largeButton}
          text={strings.drive}
          styles={{
            textContainer: {
              flexGrow: 0
            }
          }}
          onRenderIcon={() => <DriveIcon />}
          onClick={handleStartNavigation}
        />
      )}
    </Stack>
  );
};

export default withMap(RouteOverview);
