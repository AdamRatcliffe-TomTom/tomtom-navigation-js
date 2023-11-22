import React from "react";
import { makeStyles, useTheme, Stack, Text } from "@fluentui/react";
import useTextStyles from "../../hooks/useTextStyles";
import ExitShieldUS from "./ExitShieldUS";
import ExitShieldEU from "./ExitShieldEU";
import RoadShield from "./RoadShield";
import countryCodeFromRoute from "../../functions/countryCodeFromRoute";
import getNextInstructionIcon from "../../functions/getNextInstructionIcon";

const useStyles = makeStyles((theme) => ({
  distanceContainer: {
    marginBottom: theme.spacing.s1
  },
  distance: {
    fontSize: 28,
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

const NextInstructionPanel = ({ route }) => {
  const theme = useTheme();
  const countryCode = countryCodeFromRoute(route);
  const classes = useStyles();
  const textClasses = useTextStyles();
  const nextInstructionIcon = getNextInstructionIcon("STRAIGHT");

  const ExitShield = countryCode === "US" ? ExitShieldUS : ExitShieldEU;

  return (
    <Stack
      className="NextInstructionPanel"
      tokens={{ childrenGap: theme.spacing.m }}
      verticalAlign="start"
      horizontal
    >
      {nextInstructionIcon}
      <Stack grow="1">
        <Stack
          className={classes.distanceContainer}
          verticalAlign="center"
          horizontalAlign="space-between"
          horizontal
        >
          <Text className={`${textClasses.primaryText} ${classes.distance}`}>
            600 ft
          </Text>
          <ExitShield />
        </Stack>
        <Text className={classes.street}>
          Walter P Chrysler Freeway
          <br />
          Detroit, Michigan
        </Text>
        <Stack horizontal>
          <RoadShield />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default NextInstructionPanel;
