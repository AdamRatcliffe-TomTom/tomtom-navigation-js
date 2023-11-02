import React from "react";
import { makeStyles, Stack, Text, PrimaryButton } from "@fluentui/react";
import useTextStyles from "../../hooks/useTextStyles";
import useButtonStyles from "../../hooks/useButtonStyles";
import strings from "../../config/strings";

const useStyles = makeStyles({
  root: {
    textAlign: "center"
  },
  title: {
    marginBottom: 8
  },
  address: {
    marginBottom: 16
  }
});

const Arrival = ({ onStopNavigation = () => {} }) => {
  const classes = useStyles();
  const textClasses = useTextStyles();
  const buttonClasses = useButtonStyles();

  return (
    <div className={classes.root}>
      <Stack horizontalAlign="stretch">
        <Text
          className={`${textClasses.primaryText} ${classes.title}`}
          variant="large"
        >
          {strings.arrived}
        </Text>
        <Text className={`${textClasses.secondaryText} ${classes.address}`}>
          Address goes here
        </Text>
        <PrimaryButton
          className={buttonClasses.pillButton}
          text={strings.endRoute}
          onClick={onStopNavigation}
        />
      </Stack>
    </div>
  );
};

export default Arrival;
