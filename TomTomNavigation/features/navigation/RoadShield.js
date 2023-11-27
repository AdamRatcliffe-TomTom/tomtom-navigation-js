import React from "react";
import { makeStyles, useTheme, Stack, Text } from "@fluentui/react";
import expandDirectionAbbreviation from "../../functions/expandDirectionAbbreviation";

const useStyles = makeStyles({
  affixes: {
    fontFamily: "Noto Sans",
    fontSize: 20,
    fontWeight: 600,
    color: "white",
    lineHeight: "1.5"
  }
});

const RoadShield = ({ icon, affixes }) => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Stack
      tokens={{ childrenGap: theme.spacing.s2 }}
      verticalAlign="center"
      horizontal
    >
      {icon}
      {affixes && affixes.length > 0 && (
        <Text className={classes.affixes}>
          {affixes.map(expandDirectionAbbreviation).join(" ")}
        </Text>
      )}
    </Stack>
  );
};

export default RoadShield;
