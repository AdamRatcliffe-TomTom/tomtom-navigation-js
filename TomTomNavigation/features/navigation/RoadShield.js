import React from "react";
import { makeStyles, useTheme, Stack, Text } from "@fluentui/react";
import RoadShieldIcon from "../../icons/RoadShieldIcon";

const useStyles = makeStyles({
  affixes: {
    fontFamily: "Noto Sans",
    fontSize: 18,
    fontWeight: 600,
    color: "white",
    lineHeight: "1.5"
  }
});

const RoadShield = () => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Stack
      tokens={{ childrenGap: theme.spacing.s1 }}
      verticalAlign="center"
      horizontal
    >
      <RoadShieldIcon />
      <Text className={classes.affixes}>South</Text>
    </Stack>
  );
};

export default RoadShield;
