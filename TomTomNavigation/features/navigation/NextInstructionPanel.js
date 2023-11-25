import React from "react";
import { useSelector } from "react-redux";
import { makeStyles, useTheme, Stack, Text } from "@fluentui/react";
import { useAppContext } from "../../app/AppContext";
import useTextStyles from "../../hooks/useTextStyles";
import ExitShieldUS from "./ExitShieldUS";
import ExitShieldEU from "./ExitShieldEU";
import getRoadShield from "./roadshield/getRoadShield";
import countryCodeFromRoute from "../../functions/countryCodeFromRoute";
import getNextInstructionIcon from "../../functions/getNextInstructionIcon";
import formatDistance from "../../functions/formatDistance";
import expandDirectionAbbreviation from "../../functions/expandDirectionAbbreviation";

import { getDistanceToNextManeuver } from "./navigationSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "56px 1fr",
    gap: theme.spacing.m
  },
  distanceContainer: {
    marginBottom: theme.spacing.s1
  },
  distance: {
    color: "white"
  },
  street: {
    fontFamily: "Noto Sans",
    fontSize: 20,
    color: "white",
    lineHeight: "1.5",
    marginBottom: 2
  },
  affixes: {
    fontFamily: "Noto Sans",
    fontSize: 20,
    fontWeight: 600,
    color: "white"
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
  const { maneuver, street, signpostText } = nextInstruction;
  const nextInstructionIcon = getNextInstructionIcon(maneuver);
  const roadShield = getRoadShieldForInstruction(nextInstruction);

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
        {roadShield && (
          <Stack
            tokens={{ childrenGap: theme.spacing.s2 }}
            verticalAlign="center"
            horizontal
          >
            {roadShield.icon}
            {roadShield.affixes && roadShield.affixes.length > 0 && (
              <Text className={classes.affixes}>
                {roadShield.affixes.map(expandDirectionAbbreviation).join(" ")}
              </Text>
            )}
          </Stack>
        )}
      </Stack>
    </div>
  );
};

function getRoadShieldForInstruction(instruction) {
  const { roadShieldReferences } = instruction;

  if (roadShieldReferences) {
    const { reference, shieldContent, affixes } = roadShieldReferences[0];
    return { icon: getRoadShield(reference, shieldContent), affixes };
  }

  return null;
}

export default NextInstructionPanel;
