import React, { useMemo } from "react";
import add from "date-fns/add";
import { useTheme, DefaultButton } from "@fluentui/react";
import { makeStyles } from "@fluentui/react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import DriveIcon from "../../icons/DriveIcon";
import CrossIcon from "../../icons/CrossIcon";
import JamIcon from "../../icons/JamIcon";
import useTextStyles from "../../hooks/useTextStyles";
import useButtonStyles from "../../hooks/useButtonStyles";
import formatTime from "../../functions/formatTime";
import formatDuration from "../../functions/formatDuration";
import formatDistance from "../../functions/formatDistance";

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
          onClick={onStopNavigation}
        />
      ) : (
        <DefaultButton
          className={buttonClasses.circularButton}
          onRenderIcon={() => <DriveIcon color={theme.palette.black} />}
          onClick={onStartNavigation}
        />
      )}
    </Stack>
  );
};

export default ETA;
