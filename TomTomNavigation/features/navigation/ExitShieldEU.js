import React from "react";
import { makeStyles, useTheme, Stack } from "@fluentui/react";
import ExitRightIcon from "../../icons/ExitRightIcon";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `0 ${theme.spacing.s1}`,
    color: "white",
    fontFamily: "Noto Sans",
    fontSize: 16,
    fontWeight: 600,
    lineHeight: "1.5",
    border: "2.5px solid white",
    borderRadius: 3,
    textTransform: "uppercase"
  }
}));

const ExitShieldEU = () => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Stack
      className={classes.root}
      tokens={{ childrenGap: theme.spacing.s1 }}
      verticalAlign="center"
      horizontal
      disableShrink
    >
      <ExitRightIcon />
      <span>32a</span>
    </Stack>
  );
};

export default ExitShieldEU;
