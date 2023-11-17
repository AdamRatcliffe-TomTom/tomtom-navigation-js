import React from "react";
import { useSelector } from "react-redux";
import {
  makeStyles,
  useTheme,
  Stack,
  Text,
  DefaultButton
} from "@fluentui/react";
import Divider from "../../components/Divider";
import CrossIcon from "../../icons/CrossIcon";
import useTextStyles from "../../hooks/useTextStyles";
import useButtonStyles from "../../hooks/useButtonStyles";
import strings from "../../config/strings";

import { getRouteOptions } from "../map/mapSlice";
import { getCurrentInstruction } from "./navigationSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "left"
  },
  header: {
    padding: `${theme.spacing.m} ${theme.spacing.l1}`
  },
  title: {
    fontSize: 22,
    lineHeight: "1.5"
  },
  closeButton: {
    marginRight: `-${theme.spacing.s1}`
  },
  content: {
    padding: `${theme.spacing.m} ${theme.spacing.l1}`
  },
  address: {
    marginBottom: 16
  }
}));

const arrivalMessages = {
  ARRIVE: strings.arrivalStraightAhead,
  ARRIVE_LEFT: strings.arrivalLeft,
  ARRIVE_RIGHT: strings.arrivalRight
};

const Arrival = ({ onStopNavigation = () => {} }) => {
  const theme = useTheme();
  const classes = useStyles();
  const textClasses = useTextStyles();
  const buttonClasses = useButtonStyles();
  const { maneuver } = useSelector(getCurrentInstruction);
  const { locations } = useSelector(getRouteOptions);
  const destination = locations.at(-1);
  const arrivalMessage = arrivalMessages[maneuver];

  return (
    <div className={classes.root}>
      <Stack>
        <Stack
          className={classes.header}
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
        >
          <Text
            className={`${textClasses.primaryText} ${classes.title}`}
            variant="large"
          >
            {arrivalMessage}
          </Text>
          <DefaultButton
            className={`${buttonClasses.circleButton} ${classes.closeButton}`}
            onRenderIcon={() => <CrossIcon color={theme.palette.black} />}
            onClick={onStopNavigation}
          />
        </Stack>
        <Divider />
        <div className={classes.content}>
          <Text className={`${textClasses.secondaryText} ${classes.address}`}>
            {destination.name}
          </Text>
        </div>
      </Stack>
    </div>
  );
};

export default Arrival;
