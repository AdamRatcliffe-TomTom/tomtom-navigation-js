import React from "react";
import { makeStyles, Stack, Text, PrimaryButton } from "@fluentui/react";
import useButtonStyles from "../../hooks/useButtonStyles";
import strings from "../../config/strings";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Noto Sans",
    fontSize: 20,
    fontWeight: 500,
    textAlign: "center",
    marginBottom: theme.spacing.l1
  }
}));

const Arrival = ({ onStopNavigation = () => {} }) => {
  const classes = useStyles();
  const buttonClasses = useButtonStyles();

  return (
    <Stack horizontalAlign="center">
      <Text className={classes.title} variant="large">
        {strings.arrived}
      </Text>
      <Stack.Item grow>
        <PrimaryButton
          className={buttonClasses.pillButton}
          text={strings.endRoute}
          onClick={onStopNavigation}
        />
      </Stack.Item>
    </Stack>
  );
};

export default Arrival;
