import React from "react";
import { makeStyles, Text } from "@fluentui/react";
import strings from "../../config/strings";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)"
  },
  message: {
    color: theme.palette.black
  }
}));

const NoApiKeyMessage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Text variant="xLarge">{strings.noApiKey}</Text>
    </div>
  );
};

export default NoApiKeyMessage;
