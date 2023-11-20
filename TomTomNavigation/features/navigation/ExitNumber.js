import React from "react";
import { makeStyles, useTheme, Stack } from "@fluentui/react";
import strings from "../../config/strings";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 8px",
    color: "#18212a",
    backgroundColor: theme.semanticColors.alert,
    fontSize: 18,
    borderRadius: 4,
    textTransform: "uppercase"
  },
  exitNumberLabel: {
    fontFamily: "Noto Sans",
    fontSize: 16
  },
  exitNumber: {
    fontFamily: "Noto Sans",
    fontSize: 16,
    fontWeight: 600
  }
}));

const ExitNumber = () => {
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
      <span className={classes.exitNumberLabel}>{strings.exit}</span>
      <span className={classes.exitNumber}>82A-B-C</span>
    </Stack>
  );
};

export default ExitNumber;
