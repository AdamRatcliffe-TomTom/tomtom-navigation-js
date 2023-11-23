import React from "react";
import { useSelector } from "react-redux";
import { makeStyles, useTheme, Stack, Text } from "@fluentui/react";
import { useAppContext } from "../../app/AppContext";
import useTextStyles from "../../hooks/useTextStyles";
import ExitShieldUS from "./ExitShieldUS";
import ExitShieldEU from "./ExitShieldEU";
import RoadShield from "./RoadShield";
import countryCodeFromRoute from "../../functions/countryCodeFromRoute";
import getNextInstructionIcon from "../../functions/getNextInstructionIcon";
import formatDistance from "../../functions/formatDistance";

import { getDistanceToNextManeuver } from "./navigationSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "56px 1fr",
    gap: theme.spacing.m
  },
  iconContainer: {
    width: 56
  },
  distanceContainer: {
    marginBottom: theme.spacing.s1
  },
  distance: {
    color: "white"
  },
  street: {
    fontFamily: "Noto Sans",
    fontSize: 18,
    color: "white",
    lineHeight: "1.5",
    marginBottom: theme.spacing.s2
  }
}));

const NextInstructionPanel = ({ route, nextInstruction }) => {
  const theme = useTheme();
  const { measurementSystem } = useAppContext();
  const countryCode = countryCodeFromRoute(route);
  const classes = useStyles();
  const textClasses = useTextStyles();
  const distanceToNextManeuver = useSelector(getDistanceToNextManeuver);
  const formattedDistanceToNextManeuver = formatDistance(
    distanceToNextManeuver,
    measurementSystem
  );

  if (!nextInstruction) {
    return null;
  }

  const { maneuver, street, signpostText } = nextInstruction;
  const nextInstructionIcon = getNextInstructionIcon(maneuver);

  const ExitShield = countryCode === "US" ? ExitShieldUS : ExitShieldEU;

  return (
    <div className={`NextInstructionPanel ${classes.root}`}>
      {nextInstructionIcon}
      <Stack grow="1">
        <Stack
          className={classes.distanceContainer}
          verticalAlign="center"
          horizontalAlign="space-between"
          horizontal
        >
          <Text className={`${textClasses.primaryText} ${classes.distance}`}>
            {`${formattedDistanceToNextManeuver.value} ${formattedDistanceToNextManeuver.units}`}
          </Text>
          <ExitShield />
        </Stack>
        <Text className={classes.street}>{street || signpostText}</Text>
        <Stack horizontal>
          <RoadShield />
        </Stack>
      </Stack>
    </div>
  );
};

export default NextInstructionPanel;
