import React, { useEffect } from "react";
import { makeStyles } from "@fluentui/react";
import useMeasure from "react-use-measure";
import { useAppContext } from "../../app/AppContext";
import NextInstructionPanel from "./NextInstructionPanel";
import LaneGuidancePanel from "./LaneGuidancePanel";
import Divider from "../../components/Divider";
import countryCodeFromRoute from "../../functions/countryCodeFromRoute";
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
    }
  }));

const styleId = "guidance-ctrl-margin-adjustment";

const NavigationGuidancePanel = ({ route }) => {
  const [guidanceRef, bounds] = useMeasure();
  const { isPhone, isTablet } = useAppContext();
  const countryCode = countryCodeFromRoute(route);
  const classes = useStyles({ isPhone, isTablet, countryCode })();
  const nipHeight = bounds.height;
  const showLaneGuidance = false;

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

  return (
    <div ref={guidanceRef} className={classes.root}>
      <NextInstructionPanel route={route} />
      {showLaneGuidance && (
        <>
          <Divider />
          <LaneGuidancePanel />
        </>
      )}
    </div>
  );
};

export default NavigationGuidancePanel;
