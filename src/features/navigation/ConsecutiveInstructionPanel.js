import React from "react";
import { makeStyles, Stack, Text } from "@fluentui/react";
import getManeuverIcon from "../../functions/getManeuverIcon";
import strings from "../../config/strings";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "56px 1fr",
    gap: theme.spacing.m,
    alignItems: "center"
  },
  instruction: {
    fontFamily: "Noto Sans",
    fontSize: 20,
    color: theme.palette.black,
    lineHeight: "1.5"
  }
}));

const ConsecutiveInstructionPanel = ({ instruction }) => {
  if (!instruction) {
    return null;
  }

  const classes = useStyles();
  const { maneuver } = instruction;
  const maneuverIcon = getManeuverIcon(maneuver, { size: 40 });
  const maneuverText = strings[maneuver].toLowerCase();
  const instructionText = strings.formatString(
    strings.consecutiveInstructionTemplate,
    {
      maneuverText
    }
  );

  return (
    <div className={classes.root}>
      <Stack horizontalAlign="center" horizontal>
        {maneuverIcon}
      </Stack>
      <Text className={classes.instruction}>{instructionText}</Text>
    </div>
  );
};

export default ConsecutiveInstructionPanel;
