import React from "react";
import { useSelector } from "react-redux";
import {
  makeStyles,
  useTheme,
  Stack,
  Text,
  DefaultButton,
  PrimaryButton
} from "@fluentui/react";
import _isEmpty from "lodash.isempty";
import ArrivalPanelBackgroundImages from "./ArrivalPanelBackgroundImages";
import Divider from "../../components/Divider";
import CrossIcon from "../../icons/CrossIcon";
import Maneuvers from "../../constants/Maneuvers";
import useTextStyles from "../../hooks/useTextStyles";
import useButtonStyles from "../../hooks/useButtonStyles";
import breakAfterFirstWord from "../../functions/breakAfterFirstWord";
import fireEvent from "../../functions/fireEvent";
import ControlEvents from "../../constants/ControlEvents";
import strings from "../../config/strings";

import { getRouteOptions } from "../map/mapSlice";
import { getShowContinueButton, getLastInstruction } from "./navigationSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "left"
  },
  header: {
    padding: `${theme.spacing.m} ${theme.spacing.l1}`,
    borderTopLeftRadius: theme.spacing.m,
    borderTopRightRadius: theme.spacing.m,
    backgroundPosition: "right center",
    backgroundRepeat: "no-repeat"
  },
  title: {
    fontSize: 22,
    lineHeight: "1.5"
  },
  closeButton: {
    marginRight: -8
  },
  content: {
    padding: theme.spacing.m
  },
  name: {
    lineHeight: "1.5"
  },
  address: {
    fontSize: 18,
    lineHeight: "1.5"
  },
  continueButton: {
    margin: `${theme.spacing.s1} ${theme.spacing.l1} ${theme.spacing.l1}`
  }
}));

const arrivalMessages = {
  ARRIVE: strings.arrivalStraightAhead,
  ARRIVE_LEFT: strings.arrivalLeft,
  ARRIVE_RIGHT: strings.arrivalRight
};

const ArrivalPanel = ({
  onStopNavigation = () => {},
  onNavigationContinue = () => {}
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const textClasses = useTextStyles();
  const buttonClasses = useButtonStyles();
  const showContinueButton = useSelector(getShowContinueButton);
  const { maneuver } = useSelector(getLastInstruction) || {};
  const { locations } = useSelector(getRouteOptions);
  const destination = locations?.at(-1);

  if (!destination) return null;

  const { name, address, coordinates } = destination;
  const arrivalMessage = arrivalMessages[maneuver];
  const haveNameAddress = !_isEmpty(name) || !_isEmpty(address);

  const headerStyle =
    maneuver === Maneuvers.ARRIVE_LEFT
      ? {
          backgroundImage: `url(data:image/svg+xml;base64,${ArrivalPanelBackgroundImages.left})`
        }
      : maneuver === Maneuvers.ARRIVE_RIGHT
      ? {
          backgroundImage: `url(data:image/svg+xml;base64,${ArrivalPanelBackgroundImages.right})`
        }
      : null;

  const handleContinue = () => {
    fireEvent(ControlEvents.OnContinue);
    onNavigationContinue();
  };

  return (
    <div className={classes.root}>
      <Stack>
        <Stack
          className={classes.header}
          style={headerStyle}
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
        >
          <Text
            className={`${textClasses.primaryText} ${classes.title}`}
            variant="large"
          >
            {breakAfterFirstWord(arrivalMessage)}
          </Text>
          <DefaultButton
            className={`${buttonClasses.circleButton} ${classes.closeButton}`}
            onRenderIcon={() => <CrossIcon color={theme.palette.black} />}
            onClick={onStopNavigation}
          />
        </Stack>
        <Divider />
        <Stack
          className={classes.content}
          tokens={{ childrenGap: theme.spacing.s2 }}
        >
          {haveNameAddress ? (
            <>
              {name && (
                <Text className={`${textClasses.primaryText} ${classes.name}`}>
                  {name}
                </Text>
              )}
              {address && (
                <Text
                  className={`${textClasses.secondaryText} ${classes.address}`}
                >
                  {address}
                </Text>
              )}
            </>
          ) : (
            <>
              <Text className={`${textClasses.primaryText} ${classes.name}`}>
                {strings.markedLocation}
              </Text>
              <Text
                className={`${textClasses.secondaryText} ${classes.address}`}
              >
                {`${coordinates[1].toFixed(6)} N`}
                <br />
                {`${coordinates[0].toFixed(6)} E`}
              </Text>
            </>
          )}
        </Stack>
        {showContinueButton && (
          <PrimaryButton
            className={`${buttonClasses.pillButtonLarge} ${classes.continueButton}`}
            text={strings.continueWalking}
            onClick={handleContinue}
          />
        )}
      </Stack>
    </div>
  );
};

export default ArrivalPanel;
