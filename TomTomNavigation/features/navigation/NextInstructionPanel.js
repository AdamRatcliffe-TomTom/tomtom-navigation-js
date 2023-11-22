import React, { useEffect } from "react";
import { makeStyles, useTheme, Stack, Text } from "@fluentui/react";
import useMeasure from "react-use-measure";
import { useAppContext } from "../../app/AppContext";
import useTextStyles from "../../hooks/useTextStyles";
import ExitShieldUS from "./ExitShieldUS";
import ExitShieldEU from "./ExitShieldEU";
import RoadShield from "./RoadShield";
import countryCodeFromRoute from "../../functions/countryCodeFromRoute";
import getNextInstructionIcon from "../../functions/getNextInstructionIcon";
import {
  addStyleToDocument,
  removeStyleFromDocument
} from "../../functions/styles";

const useStyles = ({ isPhone, isTablet, countryCode }) =>
  makeStyles((theme) => ({
    root: {
      position: "absolute",
      top: 0,
      left: 0,
      margin: `${theme.spacing.m} ${theme.spacing.m} 0`,
      padding: theme.spacing.l1,
      borderRadius: theme.spacing.m,
      backgroundColor:
        countryCode === "US"
          ? theme.semanticColors.nipUSBackground
          : theme.semanticColors.nipEUBackground,
      boxShadow: theme.floatingElementShadow,
      ...(isTablet && {
        width: 380
      }),
      ...(isPhone && {
        right: 0,
        margin: `${theme.spacing.s1} ${theme.spacing.s1} 0`
      }),
      transition: "background-color 0.15s"
    },
    distanceContainer: {
      marginBottom: theme.spacing.s1
    },
    distance: {
      fontSize: 28,
      color: "white"
    },
    street: {
      fontFamily: "Noto Sans",
      fontSize: 18,
      color: "white",
      lineHeight: "1.5",
      marginBottom: theme.spacing.s2
    }
  }));

const styleId = "nip-ctrl-margin-adjustment";

const NextInstructionPanel = ({ route }) => {
  const theme = useTheme();
  const [nipRef, bounds] = useMeasure();
  const { isPhone, isTablet } = useAppContext();
  const countryCode = countryCodeFromRoute(route);
  const classes = useStyles({ isPhone, isTablet, countryCode })();
  const textClasses = useTextStyles();
  const nextInstructionIcon = getNextInstructionIcon("STRAIGHT");
  const nipHeight = bounds.height;

  useEffect(() => {
    if (isPhone) {
      removeStyleFromDocument(styleId);
      addStyleToDocument(
        styleId,
        `.TomTomNavigation .mapboxgl-ctrl-top-right, .TomTomNavigation .mapboxgl-ctrl-top-left {margin-top: ${
          nipHeight + 8
        }px}`
      );
    } else {
      removeStyleFromDocument(styleId);
    }
    return () => removeStyleFromDocument(styleId);
  }, [isPhone, nipHeight]);

  const ExitShield = countryCode === "US" ? ExitShieldUS : ExitShieldEU;

  return (
    <div ref={nipRef} className={`NextInstructionPanel ${classes.root}`}>
      <Stack
        tokens={{ childrenGap: theme.spacing.m }}
        verticalAlign="start"
        horizontal
      >
        {nextInstructionIcon}
        <Stack grow="1">
          <Stack
            className={classes.distanceContainer}
            verticalAlign="center"
            horizontalAlign="space-between"
            horizontal
          >
            <Text className={`${textClasses.primaryText} ${classes.distance}`}>
              600 ft
            </Text>
            <ExitShield />
          </Stack>
          <Text className={classes.street}>
            Walter P Chrysler Freeway
            <br />
            Detroit, Michigan
          </Text>
          <Stack horizontal>
            <RoadShield />
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default NextInstructionPanel;
