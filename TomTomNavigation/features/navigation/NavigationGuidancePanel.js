import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@fluentui/react";
import useMeasure from "react-use-measure";
import { useAppContext } from "../../app/AppContext";
import Stack, { StackItem } from "../../components/Stack";
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

const useStyles = ({ isPhone, isTablet, countryCode }) =>
  makeStyles((theme) => ({
    root: {
      position: "absolute",
      top: 0,
      left: 0,
      margin: `${theme.spacing.m} ${theme.spacing.m} 0`,
      ...(isTablet && {
        width: 390
      }),
      ...(isPhone && {
        right: 0,
        margin: `${theme.spacing.s1} ${theme.spacing.s1} 0`
      })
    },
    nip: {
      backgroundColor:
        countryCode === "US"
          ? theme.semanticColors.nipUSBackground
          : theme.semanticColors.nipEUBackground,
      transition: "background-color 0.15s"
    },
    consecutiveInstruction: {
      backgroundColor:
        countryCode === "US"
          ? theme.semanticColors.nipUSHighlight
          : theme.semanticColors.nipEUHighlight,
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
      <StackItem className={classes.nip}>
        <NextInstructionPanel route={route} instruction={nextInstruction} />
        {haveLaneGuidance && <LaneGuidancePanel />}
      </StackItem>
      {haveConsecutiveInstruction && (
        <StackItem className={classes.consecutiveInstruction}>
          <ConsecutiveInstructionPanel instruction={consecutiveInstruction} />
        </StackItem>
      )}
    </Stack>
  );
};

export default NavigationGuidancePanel;
