import React from "react";
import { useSelector } from "react-redux";
import { makeStyles, Stack, Text, PrimaryButton } from "@fluentui/react";
import useTextStyles from "../../hooks/useTextStyles";
import useButtonStyles from "../../hooks/useButtonStyles";
import strings from "../../config/strings";

import { getRouteOptions } from "../map/mapSlice";

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
  const { locations } = useSelector(getRouteOptions);
  const destination = locations.at(-1);

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
          {destination.name}
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
