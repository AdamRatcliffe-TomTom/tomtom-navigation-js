import React from "react";
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

import {
  getDistanceRemaining,
  getTimeRemaining,
  getEta
} from "./navigationSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: theme.spacing.l1
  },
  button: {
    marginRight: -8
  }
}));

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
  const timeRemaining = useSelector(getTimeRemaining);
  const eta = useSelector(getEta);
  const { summary } = route.features[0].properties;
  const { trafficDelayInSeconds } = summary;
  const duration = formatDuration(timeRemaining);
  const formattedDistanceRemaining = formatDistance(
    distanceRemaining,
    measurementSystem
  );
  const formattedArrival = formatTime(new Date(eta));
  const formattedDelay = formatDuration(trafficDelayInSeconds);
  const showTrafficDelay = trafficDelayInSeconds >= 60;

  return (
    <Stack
      className={classes.root}
      tokens={{ childrenGap: theme.spacing.s1 }}
      horizontal
      horizontalAlign="space-between"
      verticalAlign="center"
    >
      <Stack tokens={{ childrenGap: 12 }}>
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
            <Text className={textClasses.primaryText}>
              {formattedArrival.time}
            </Text>
            <Text className={textClasses.primaryUnitsText}>
              {formattedArrival.meridiem}
            </Text>
          </Stack>
          {showTrafficDelay && (
            <Stack
              horizontal
              verticalAlign="center"
              tokens={{ childrenGap: 6 }}
            >
              <Text className={textClasses.secondaryText}>⸱</Text>
              <JamIcon color={theme.semanticColors.warningIcon} />
              <Text className={textClasses.warningText}>{formattedDelay}</Text>
            </Stack>
          )}
        </Stack>
        <Stack horizontal tokens={{ childrenGap: theme.spacing.s1 }}>
          <Text
            className={textClasses.secondaryText}
          >{`${formattedDistanceRemaining.value} ${formattedDistanceRemaining.units}`}</Text>
          <Text className={textClasses.secondaryText}>⸱</Text>
          <Text className={textClasses.secondaryText}>{duration}</Text>
          {/* {showTrafficDelay && (
            <Stack
              horizontal
              verticalAlign="center"
              tokens={{ childrenGap: 6 }}
            >
              <Text className={textClasses.secondaryText}>⸱</Text>
              <JamIcon color={theme.semanticColors.warningIcon} />
              <Text className={textClasses.warningText}>{formattedDelay}</Text>
            </Stack>
          )} */}
        </Stack>
      </Stack>
      {isNavigating ? (
        <DefaultButton
          className={`${buttonClasses.circleButton} ${classes.button}`}
          onRenderIcon={() => <CrossIcon color={theme.palette.black} />}
          onClick={onStopNavigation}
        />
      ) : (
        <DefaultButton
          className={`${buttonClasses.pillButtonLarge} ${classes.button}`}
          text={strings.go}
          onClick={onStartNavigation}
        />
      )}
    </Stack>
  );
};

export default ETA;
