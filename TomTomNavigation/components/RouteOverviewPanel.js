import React from "react";
import { useTheme, PrimaryButton } from "@fluentui/react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import ChevronIcon from "./icons/ChevronIcon";
import useButtonStyles from "./styles/useButtonStyles";
import { useAppContext } from "../AppContext";
import formatDuration from "../functions/formatDuration";
import formatDistance from "../functions/formatDistance";
import strings from "../strings";

const RouteOverviewPanel = ({ route }) => {
  const theme = useTheme();
  const buttonStyles = useButtonStyles();
  const { isPhone } = useAppContext();
  const { summary, legs } = route.features[0]?.properties;
  const { travelTimeInSeconds, lengthInMeters } = summary;
  const numStops = legs.length;
  const duration = formatDuration(travelTimeInSeconds);
  const distance = formatDistance(lengthInMeters);

  const routeOverviewPanelStyles = {
    root: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: isPhone ? "100%" : "380px",
      marginLeft: isPhone ? 0 : theme.spacing.m,
      padding: theme.spacing.m,
      background: theme.palette.white,
      borderTopLeftRadius: theme.spacing.m,
      borderTopRightRadius: theme.spacing.m,
      boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.15)",
      zIndex: 10
    }
  };

  return (
    <Stack
      className="RouteOverviewPanel"
      styles={routeOverviewPanelStyles}
      gap={theme.spacing.s1}
    >
      <Stack gap={theme.spacing.s1}>
        <Text variant="xxLarge">{`${duration} ${
          duration > 3600 ? "hr" : "min"
        }`}</Text>
        <Stack
          horizontal
          gap={theme.spacing.s2}
          styles={{ root: { marginBottom: theme.spacing.s1 } }}
        >
          <Text
            variant="xLarge"
            styles={{
              root: {
                color: theme.palette.neutralSecondaryAlt,
                fontWeight: 600
              }
            }}
          >{`${distance.value} ${distance.units}`}</Text>
          {numStops > 1 && (
            <Text
              variant="xLarge"
              styles={{
                root: {
                  color: theme.palette.neutralSecondaryAlt,
                  fontWeight: 600
                }
              }}
            >
              {`⸱ ${numStops} stops`}
            </Text>
          )}
        </Stack>
      </Stack>
      <PrimaryButton
        className={buttonStyles.largeButton}
        text={strings.drive}
        size="large"
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
