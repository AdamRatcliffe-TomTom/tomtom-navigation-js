import React, { useMemo } from "react";
import { makeStyles, useTheme, Stack, Text } from "@fluentui/react";
import CheapRuler from "cheap-ruler";
import TimeIcon from "../../icons/TimeIcon";
import { useAppContext } from "../../app/AppContext";
import useTextStyles from "../../hooks/useTextStyles";
import getTrafficEventIcon from "../../functions/getTrafficEventIcon";
import formatDistance from "../../functions/formatDistance";
import formatDuration from "../../functions/formatDuration";
import strings from "../../config/strings";

const useStyles = ({ isTablet }) =>
  makeStyles((theme) => ({
    root: {
      display: "grid",
      gridTemplateColumns: "56px 1fr auto",
      gap: theme.spacing.m,
      alignItems: "center"
    },
    iconWrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    distance: {
      fontFamily: "Noto Sans",
      fontSize: 20,
      fontWeight: 600,
      color: theme.palette.black,
      lineHeight: "1.5"
    },
    delay: {
      lineHeight: "1.5",
      ...(isTablet && { alignSelf: "flex-start" })
    }
  }));

function calculateDistanceToEvent(currentLocation, event, coordinates, ruler) {
  const { pointIndex: currentPointIndex } = currentLocation;
  const { startPointIndex: eventPointIndex } = event;

  if (currentPointIndex >= eventPointIndex) {
    return 0;
  }

  const part = ruler.lineSlice(
    coordinates[currentPointIndex],
    coordinates[eventPointIndex],
    coordinates
  );
  return ruler.lineDistance(part);
}

const TrafficEventPanel = ({ event, currentLocation, route }) => {
  const theme = useTheme();
  const { coordinates } = route.features[0].geometry;
  const { measurementSystem, isTablet } = useAppContext();
  const ruler = useMemo(
    () => new CheapRuler(coordinates[0][1], "meters"),
    [coordinates]
  );
  const classes = useStyles({ isTablet })();
  const textClasses = useTextStyles();
  const icon = getTrafficEventIcon(event);
  const distance = calculateDistanceToEvent(
    currentLocation,
    event,
    coordinates,
    ruler
  );
  const formattedDistance = formatDistance(distance, measurementSystem);
  const { delayInSeconds } = event;
  const formattedDelay = formatDuration(delayInSeconds);
  const showDelay = delayInSeconds >= 60;

  return (
    <div className={classes.root}>
      <div className={classes.iconWrapper}>{icon}</div>
      <Stack tokens={{ childrenGap: theme.spacing.s1 }}>
        <Text
          className={classes.distance}
        >{`${formattedDistance.value} ${formattedDistance.units}`}</Text>
        {isTablet && (
          <Text className={textClasses.secondaryText}>{strings.traffic}</Text>
        )}
      </Stack>
      <Stack
        className={classes.delay}
        horizontal
        verticalAlign="center"
        tokens={{ childrenGap: 4 }}
      >
        {showDelay && (
          <>
            <TimeIcon size={32} color={theme.semanticColors.warningIcon} />
            <Text className={textClasses.warningText}>{formattedDelay}</Text>
          </>
        )}
      </Stack>
    </div>
  );
};

export default TrafficEventPanel;
