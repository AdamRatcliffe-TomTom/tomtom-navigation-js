import React, { useMemo } from "react";
import add from "date-fns/add";
import { useSelector } from "react-redux";
import { useTheme, DefaultButton } from "@fluentui/react";
import { makeStyles } from "@fluentui/react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import CrossIcon from "../../icons/CrossIcon";
import JamIcon from "../../icons/JamIcon";
import useTextStyles from "../../hooks/useTextStyles";
import useButtonStyles from "../../hooks/useButtonStyles";
import formatTime from "../../functions/formatTime";
import formatDuration from "../../functions/formatDuration";
import formatDistance from "../../functions/formatDistance";
import strings from "../../config/strings";

import { getDistanceRemaining } from "./navigationSlice";

const useStyles = makeStyles({
  root: {
    width: "100%"
  }
});

const ETA = ({
  route,
  measurementSystem,
  isNavigating,
  onStartNavigation = () => {},
  onStopNavigation = () => {}
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const textClasses = useTextStyles();
  const buttonClasses = useButtonStyles();
  const distanceRemaining = useSelector(getDistanceRemaining);
  const { summary } = route.features[0].properties;
  const { travelTimeInSeconds, trafficDelayInSeconds } = summary;
  const duration = formatDuration(travelTimeInSeconds);
  const distance = formatDistance(distanceRemaining, measurementSystem);
  const delay = formatDuration(trafficDelayInSeconds);
  const showTrafficDelay = trafficDelayInSeconds >= 60;

  const eta = useMemo(
    () => formatTime(add(new Date(), { seconds: travelTimeInSeconds })),
    [travelTimeInSeconds]
  );

  return (
    <Stack
      className={classes.root}
      tokens={{ childrenGap: theme.spacing.s1 }}
      horizontal
      horizontalAlign="space-between"
      verticalAlign="center"
    >
      <Stack tokens={{ childrenGap: theme.spacing.s1 }}>
        <Stack
          horizontal
          verticalAlign="baseline"
          tokens={{ childrenGap: theme.spacing.s1 }}
        >
          <Stack
            horizontal
            verticalAlign="baseline"
            tokens={{ childrenGap: 3 }}
          >
            <Text className={textClasses.primaryText}>{eta.time}</Text>
            <Text className={textClasses.primaryUnitsText}>{eta.meridiem}</Text>
          </Stack>
          {showTrafficDelay && (
            <Stack
              horizontal
              verticalAlign="center"
              tokens={{ childrenGap: 6 }}
            >
              <Text className={textClasses.secondaryText}>⸱</Text>
              <JamIcon color={theme.semanticColors.warningIcon} />
              <Text className={textClasses.warningText}>{delay}</Text>
            </Stack>
          )}
        </Stack>
        <Stack horizontal tokens={{ childrenGap: theme.spacing.s1 }}>
          <Text
            className={textClasses.secondaryText}
          >{`${distance.value} ${distance.units}`}</Text>
          <Text className={textClasses.secondaryText}>⸱</Text>
          <Text className={textClasses.secondaryText}>{duration}</Text>
        </Stack>
      </Stack>
      {isNavigating ? (
        <DefaultButton
          className={buttonClasses.circleButton}
          onRenderIcon={() => <CrossIcon color={theme.palette.black} />}
          onClick={onStopNavigation}
        />
      ) : (
        <DefaultButton
          className={buttonClasses.pillButton}
          text={strings.go}
          onClick={onStartNavigation}
        />
      )}
    </Stack>
  );
};

export default ETA;
