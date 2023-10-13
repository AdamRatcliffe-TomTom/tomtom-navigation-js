import React from "react";
import { useTheme } from "@fluentui/react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import ChevronIcon from "./icons/ChevronIcon";
import { useAppContext } from "../AppContext";
import formatDuration from "../functions/formatDuration";
import formatDistance from "../functions/formatDistance";

const getRouteSummary = (route) => route.features[0].properties.summary;

const RouteOverviewPanel = ({ route }) => {
  const theme = useTheme();
  const { isPhone } = useAppContext();
  const { travelTimeInSeconds, lengthInMeters } = getRouteSummary(route);
  const duration = formatDuration(travelTimeInSeconds);
  const distance = formatDistance(lengthInMeters);

  const routeOverviewPanelStyles = {
    root: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: isPhone ? "100%" : "400px",
      marginRight: isPhone ? 0 : theme.spacing.s1,
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
      <Text variant="xLarge">San Francisco</Text>
      <Stack horizontal={true} gap={theme.spacing.s1}>
        <Text variant="large">{`${duration} ${
          duration > 3600 ? "hr" : "min"
        }`}</Text>
        <Text variant="large">{`${distance.value} ${distance.units}`}</Text>
      </Stack>
      <PrimaryButton
        text="Drive"
        style={{
          marginTop: theme.spacing.m
        }}
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
