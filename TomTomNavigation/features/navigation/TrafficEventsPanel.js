import React, { useMemo } from "react";
import { makeStyles, useTheme, Stack, Text } from "@fluentui/react";
import CheapRuler from "cheap-ruler";
import Divider from "../../components/Divider";
import TimeIcon from "../../icons/TimeIcon";
import { useAppContext } from "../../app/AppContext";
import useTextStyles from "../../hooks/useTextStyles";
import getTrafficEventIcon from "../../functions/getTrafficEventIcon";
import formatDistance from "../../functions/formatDistance";
import formatDuration from "../../functions/formatDuration";
import strings from "../../config/strings";

import { MAX_TRAFFIC_EVENTS } from "../../config";

const useStyles = ({ isTablet }) =>
  makeStyles((theme) => ({
    root: {
      "& .Divider": {
        position: "relative",
        left: 72,
        right: `-${theme.spacing.l1}`,
        margin: `${theme.spacing.m} 0`
      }
    },
    event: {
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
      lineHeight: "1"
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

const TrafficEvent = ({ event, distance }) => {
  const theme = useTheme();
  const { measurementSystem, isTablet } = useAppContext();
  const { delayInSeconds } = event;
  const classes = useStyles({ isTablet })();
  const textClasses = useTextStyles();
  const icon = getTrafficEventIcon(event);
  const formattedDistance = formatDistance(distance, measurementSystem);
  const formattedDelay = formatDuration(delayInSeconds);
  const showDelay = delayInSeconds > 0;

  return (
    <div className={`TrafficEvent ${classes.event}`}>
      <div className={classes.iconWrapper}>{icon}</div>
      <Stack tokens={{ childrenGap: theme.spacing.m }}>
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

const TrafficEventsPanel = ({ events, currentLocation, route }) => {
  const { isPhone, isTablet } = useAppContext();
  const classes = useStyles({ isTablet })();
  const { coordinates } = route.features[0].geometry;
  const ruler = useMemo(
    () => new CheapRuler(coordinates[0][1], "meters"),
    [coordinates]
  );

  const trafficEvents = useMemo(() => {
    const visibleEvents = events.slice(0, isPhone ? 1 : MAX_TRAFFIC_EVENTS);

    return visibleEvents.map((event, index) => {
      const distance = calculateDistanceToEvent(
        currentLocation,
        event,
        coordinates,
        ruler
      );
      return (
        <React.Fragment key={index}>
          <TrafficEvent event={event} distance={distance} />
          {index < visibleEvents.length - 1 && <Divider />}
        </React.Fragment>
      );
    });
  }, [events, currentLocation, coordinates, ruler]);

  return (
    <div className={`TrafficEventsPanel ${classes.root}`}>{trafficEvents}</div>
  );
};

export default TrafficEventsPanel;
