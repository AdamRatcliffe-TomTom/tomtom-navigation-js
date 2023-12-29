import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@fluentui/react";
import useMeasure from "react-use-measure";
import { useAppContext } from "../../app/AppContext";
import Stack from "../../components/Stack";
import NextInstructionPanel from "./NextInstructionPanel";
import ConsecutiveInstructionPanel from "./ConsecutiveInstructionPanel";
import LaneGuidancePanel from "./LaneGuidancePanel";
import TrafficEventsPanel from "./TrafficEventsPanel";
import Maneuvers from "../../constants/Maneuvers";
import countryCodeFromRoute from "../../functions/countryCodeFromRoute";
import {
  addStyleToDocument,
  removeStyleFromDocument
} from "../../functions/styles";

import {
  getCurrentLocation,
  getNextInstruction,
  getConsecutiveInstruction
} from "./navigationSlice";

import { TABLET_PANEL_WIDTH, ETA_PANEL_HEIGHT } from "../../config";

const useStyles = ({
  appTheme,
  isPhone,
  isTablet,
  landscapeMinimal,
  countryCode
}) =>
  makeStyles((theme) => ({
    root: {
      position: "absolute",
      top: 0,
      left: 0,
      margin: `${theme.spacing.m} ${theme.spacing.m} 0`,
      ...(isTablet && {
        width: TABLET_PANEL_WIDTH
      }),
      ...(isPhone && {
        right: 0,
        margin: `${theme.spacing.s1} ${theme.spacing.s1} 0`
      }),
      ...(landscapeMinimal && {
        ".StackItem": {
          padding: `${theme.spacing.m} ${theme.spacing.l1}`
        },
        ".StackItem:not(:first-child)": {
          padding: `${parseInt(theme.spacing.m) * 2}px ${theme.spacing.l1} ${
            theme.spacing.m
          }`
        }
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
    },
    trafficEventsPanel: {
      backgroundColor: theme.palette.white,
      transition: "background-color 0.15s"
    }
  }));

const styleId = "guidance-ctrl-margin-adjustment";

const NavigationGuidancePanel = ({ route }) => {
  // Using offsetSize option to useMeasure is necessary to ignore the parent scale
  // transformation Power Apps will apply if "Scale to fit" is enabled
  const [guidancePanelRef, bounds] = useMeasure({ offsetSize: true });
  const {
    theme: appTheme,
    isPhone,
    isTablet,
    landscapeMinimal,
    setGuidancePanelHeight
  } = useAppContext();
  const countryCode = countryCodeFromRoute(route);
  const classes = useStyles({
    appTheme,
    isPhone,
    isTablet,
    landscapeMinimal,
    countryCode
  })();
  const guidancePanelHeight = bounds.height;
  const currentLocation = useSelector(getCurrentLocation);
  const { laneGuidance, trafficEvents } = currentLocation;
  const nextInstruction = useSelector(getNextInstruction);
  const consecutiveInstruction = useSelector(getConsecutiveInstruction);
  const haveLaneGuidance = !!laneGuidance;
  const haveConsecutiveInstruction =
    !!consecutiveInstruction &&
    ![Maneuvers.ARRIVE, Maneuvers.ARRIVE_LEFT, Maneuvers.ARRIVE_RIGHT].includes(
      consecutiveInstruction.maneuver
    );
  const haveTrafficEvents = !!!landscapeMinimal && trafficEvents.length;

  useEffect(() => {
    if (isPhone) {
      removeStyleFromDocument(styleId);
      addStyleToDocument(
        styleId,
        `.TomTomNavigation .mapboxgl-ctrl-top-right, .TomTomNavigation .mapboxgl-ctrl-top-left {
           margin-top: ${guidancePanelHeight + 8}px;
         }
         .TomTomNavigation .mapboxgl-ctrl-bottom-right, .TomTomNavigation .mapboxgl-ctrl-bottom-left {
           margin-bottom: ${ETA_PANEL_HEIGHT}px;
         }
        `
      );
    } else {
      removeStyleFromDocument(styleId);
    }
    setGuidancePanelHeight(guidancePanelHeight);

    return () => removeStyleFromDocument(styleId);
  }, [isPhone, guidancePanelHeight]);

  // Navigation guidance cannot be shown if there's no next instruction
  if (!nextInstruction) {
    return null;
  }

  return (
    <Stack ref={guidancePanelRef} className={classes.root}>
      <Stack.Item className={classes.nipPanel}>
        <NextInstructionPanel route={route} instruction={nextInstruction} />
        {haveLaneGuidance && <LaneGuidancePanel lanes={laneGuidance.lanes} />}
      </Stack.Item>
      {haveConsecutiveInstruction && (
        <Stack.Item className={classes.consecutiveInstructionPanel}>
          <ConsecutiveInstructionPanel instruction={consecutiveInstruction} />
        </Stack.Item>
      )}
      {haveTrafficEvents && (
        <Stack.Item className={classes.trafficEventsPanel}>
          <TrafficEventsPanel
            events={trafficEvents}
            currentLocation={currentLocation}
            route={route}
          />
        </Stack.Item>
      )}
    </Stack>
  );
};

export default NavigationGuidancePanel;
