import React, { useEffect } from "react";
import { makeStyles, useTheme, Stack, Text } from "@fluentui/react";
import { useAppContext } from "../../app/AppContext";
import useTextStyles from "../../hooks/useTextStyles";
import ExitNumber from "./ExitNumber";
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
      height: 175,
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
    distance: {
      fontSize: 28,
      color: "white"
    },
    street: {
      fontFamily: "Noto Sans",
      fontSize: 18,
      color: "white",
      lineHeight: "1.5"
    }
  }));

const NextInstructionPanel = ({ route }) => {
  const theme = useTheme();
  const { isPhone, isTablet } = useAppContext();
  const countryCode = countryCodeFromRoute(route);
  const classes = useStyles({ isPhone, isTablet, countryCode })();
  const textClasses = useTextStyles();
  const nextInstructionIcon = getNextInstructionIcon("KEEP_RIGHT");

  useEffect(() => {
    if (isPhone) {
      addStyleToDocument(
        "nip-margin-adjustment",
        `.TomTomNavigation .mapboxgl-ctrl-top-right, .TomTomNavigation .mapboxgl-ctrl-top-left {margin-top: 183px}`
      );
    } else {
      removeStyleFromDocument("nip-margin-adjustment");
    }
    return () => removeStyleFromDocument("nip-margin-adjustment");
  }, [isPhone]);

  return (
    <div className={`NextInstructionPanel ${classes.root}`}>
      <Stack
        tokens={{ childrenGap: theme.spacing.m }}
        verticalAlign="start"
        horizontal
      >
        {nextInstructionIcon}
        <Stack tokens={{ childrenGap: theme.spacing.s1 }} grow="1">
          <Stack
            verticalAlign="center"
            horizontalAlign="space-between"
            horizontal
          >
            <Text className={`${textClasses.primaryText} ${classes.distance}`}>
              600 ft
            </Text>
            <ExitNumber />
          </Stack>
          <Text className={classes.street}>
            Walter P Chrysler Freeway
            <br />
            Detroit, Michigan
          </Text>
        </Stack>
      </Stack>
    </div>
  );
};

export default NextInstructionPanel;
