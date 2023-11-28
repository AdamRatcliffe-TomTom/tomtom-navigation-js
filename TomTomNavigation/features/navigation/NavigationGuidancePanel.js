import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@fluentui/react";
import useMeasure from "react-use-measure";
import { useAppContext } from "../../app/AppContext";
import Stack from "../../components/Stack";
import NextInstructionPanel from "./NextInstructionPanel";
import ConsecutiveInstructionPanel from "./ConsecutiveInstructionPanel";
import LaneGuidancePanel from "./LaneGuidancePanel";
import Maneuvers from "../../constants/Maneuvers";
import countryCodeFromRoute from "../../functions/countryCodeFromRoute";
import {
  addStyleToDocument,
  removeStyleFromDocument
} from "../../functions/styles";

import {
  getNextInstruction,
  getConsecutiveInstruction
} from "./navigationSlice";

import { TABLET_GUIDANCE_PANEL_WIDTH } from "../../config";

const useStyles = ({ appTheme, isPhone, isTablet, countryCode }) =>
  makeStyles((theme) => ({
    root: {
      position: "absolute",
      top: 0,
      left: 0,
      margin: `${theme.spacing.m} ${theme.spacing.m} 0`,
      ...(isTablet && {
        width: TABLET_GUIDANCE_PANEL_WIDTH
      }),
      ...(isPhone && {
        right: 0,
        margin: `${theme.spacing.s1} ${theme.spacing.s1} 0`
      })
    },
    nipPanel: {
      backgroundColor:
        countryCode === "US"
          ? theme.semanticColors.nipUSBackground
          : theme.semanticColors.nipEUBackground,
      transition: "background-color 0.15s"
    },
    consecutiveInstructionPanel: {
      backgroundColor:
        countryCode === "US"
          ? appTheme === "dark"
            ? theme.semanticColors.nipUSHighlight
            : theme.semanticColors.nipUSEmphasis
          : appTheme === "dark"
          ? theme.semanticColors.nipEUHighlight
          : theme.semanticColors.nipEUEmphasis,
      transition: "background-color 0.15s"
    }
  }));

const styleId = "guidance-ctrl-margin-adjustment";

const NavigationGuidancePanel = ({ route }) => {
  const [guidanceRef, bounds] = useMeasure();
  const { theme: appTheme, isPhone, isTablet } = useAppContext();
  const countryCode = countryCodeFromRoute(route);
  const classes = useStyles({ appTheme, isPhone, isTablet, countryCode })();
  const nipHeight = bounds.height;
  const nextInstruction = useSelector(getNextInstruction);
  const consecutiveInstruction = useSelector(getConsecutiveInstruction);
  const haveLaneGuidance = false;
  const haveConsecutiveInstruction =
    !!consecutiveInstruction &&
    ![Maneuvers.ARRIVE, Maneuvers.ARRIVE_LEFT, Maneuvers.ARRIVE_RIGHT].includes(
      consecutiveInstruction.maneuver
    );

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

  // Navigation guidance cannot be shown if there's no next instruction
  if (!nextInstruction) {
    return null;
  }

  return (
    <Stack ref={guidanceRef} className={classes.root}>
      <Stack.Item className={classes.nipPanel}>
        <NextInstructionPanel route={route} instruction={nextInstruction} />
        {haveLaneGuidance && <LaneGuidancePanel />}
      </Stack.Item>
      {haveConsecutiveInstruction && (
        <Stack.Item className={classes.consecutiveInstructionPanel}>
          <ConsecutiveInstructionPanel instruction={consecutiveInstruction} />
        </Stack.Item>
      )}
    </Stack>
  );
};

export default NavigationGuidancePanel;
