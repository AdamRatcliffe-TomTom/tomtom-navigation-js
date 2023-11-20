import React from "react";
import { makeStyles, useTheme, Stack } from "@fluentui/react";
import strings from "../../config/strings";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `0 ${theme.spacing.s1}`,
    color: "#18212a",
    backgroundColor: theme.semanticColors.alert,
    fontFamily: "Noto Sans",
    fontSize: 16,
    lineHeight: "1.5",
    borderRadius: 3,
    textTransform: "uppercase"
  },
  exitNumber: {
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
      <span>{strings.exit}</span>
      <span className={classes.exitNumber}>82A-B-C</span>
    </Stack>
  );
};

export default ExitNumber;
