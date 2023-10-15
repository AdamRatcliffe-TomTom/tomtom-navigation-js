import React from "react";
import { useTheme, PrimaryButton } from "@fluentui/react";
import { makeStyles } from "@fluentui/react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import ChevronIcon from "../../icons/ChevronIcon";
import useTextStyles from "../../hooks/useTextStyles";
import useButtonStyles from "../../hooks/useButtonStyles";
import formatDuration from "../../functions/formatDuration";
import formatDistance from "../../functions/formatDistance";
import strings from "../../config/strings";

const useStyles = makeStyles({
  root: {
    width: "100%"
  }
});

const RouteOverviewPanel = ({ route }) => {
  const theme = useTheme();
  const classes = useStyles();
  const textClasses = useTextStyles();
  const buttonClasses = useButtonStyles();
  const { summary, legs } = route.features[0].properties;
  const { travelTimeInSeconds, lengthInMeters } = summary;
  const numStops = legs.length;
  const duration = formatDuration(travelTimeInSeconds);
  const distance = formatDistance(lengthInMeters);

  return (
    <Stack className={classes.root} gap={theme.spacing.s1}>
      <Stack gap={theme.spacing.s1}>
        <Text
          className={textClasses.primaryText}
          variant="xLarge"
        >{`${duration} ${duration > 3600 ? "hr" : "min"}`}</Text>
        <Stack
          horizontal
          gap={theme.spacing.s2}
          styles={{ root: { marginBottom: theme.spacing.s1 } }}
        >
          <Text
            className={textClasses.secondaryText}
            variant="xLarge"
          >{`${distance.value} ${distance.units}`}</Text>
          {numStops > 1 && (
            <Text className={textClasses.secondaryText} variant="xLarge">
              {`⸱ ${numStops} stops`}
            </Text>
          )}
        </Stack>
      </Stack>
      <PrimaryButton
        className={buttonClasses.largeButton}
        text={strings.drive}
        styles={{
          textContainer: {
            flexGrow: 0
          }
        }}
        onRenderIcon={() => <ChevronIcon />}
      />
    </Stack>
  );
};

export default RouteOverviewPanel;
