import React, { useEffect } from "react";
import { makeStyles } from "@fluentui/react";
import { useSelector } from "react-redux";
import useMeasure from "react-use-measure";
import ETAPanel from "./ETAPanel";
import ArrivalPanel from "./ArrivalPanel";
import { useNavigationContext } from "../../core/NavigationContext";

import {
  getIsNavigating,
  getHasReachedDestination,
  getShowETAPanel,
  getShowArrivalPanel
} from "./navigationSlice";

import { TABLET_PANEL_WIDTH } from "../../config";

const useStyles = ({ isPhone, isTablet }) =>
  makeStyles((theme) => ({
    root: {
      position: "absolute",
      bottom: 0,
      left: 0,
      margin: `${theme.spacing.m} ${theme.spacing.m} 0`,
      backgroundColor: theme.palette.white,
      borderTopLeftRadius: theme.spacing.m,
      borderTopRightRadius: theme.spacing.m,
      boxShadow: theme.floatingElementShadow,
      ...(isTablet && {
        width: TABLET_PANEL_WIDTH
      }),
      ...(isPhone && {
        right: 0,
        margin: `${theme.spacing.s1} ${theme.spacing.s1} 0`
      }),
      transition: "background-color 0.15s"
    }
  }));

const BottomPanel = ({
  etaPanel,
  route,
  onStartNavigation,
  onStopNavigation,
  onNavigationContinue
}) => {
  const [bottomPanelRef, bounds] = useMeasure({
    offsetSize: true
  });
  const { measurementSystem, isPhone, isTablet, setBottomPanelHeight } =
    useNavigationContext();
  const classes = useStyles({ isPhone, isTablet })();
  const isNavigating = useSelector(getIsNavigating);
  const showETAPanel = useSelector(getShowETAPanel);
  const showArrivalPanel = useSelector(getShowArrivalPanel);
  const hasReachedDestination = useSelector(getHasReachedDestination);
  const bottomPanelHeight = bounds.height;

  useEffect(() => {
    setBottomPanelHeight(bottomPanelHeight);
  }, [bottomPanelHeight]);

  const handleStopNavigation = () => onStopNavigation(true);

  if (!route) {
    return null;
  }

  if (!hasReachedDestination && showETAPanel) {
    return (
      <div ref={bottomPanelRef} className={`BottomPanel ${classes.root}`}>
        {etaPanel ? (
          React.cloneElement(etaPanel, {
            route,
            measurementSystem,
            isNavigating,
            onStartNavigation,
            onStopNavigation: handleStopNavigation
          })
        ) : (
          <ETAPanel
            route={route}
            measurementSystem={measurementSystem}
            isNavigating={isNavigating}
            onStartNavigation={onStartNavigation}
            onStopNavigation={handleStopNavigation}
          />
        )}
      </div>
    );
  }

  if (hasReachedDestination && showArrivalPanel) {
    return (
      <div ref={bottomPanelRef} className={`BottomPanel ${classes.root}`}>
        <ArrivalPanel
          onStopNavigation={onStopNavigation}
          onNavigationContinue={onNavigationContinue}
        />
      </div>
    );
  }

  return null;
};

export default BottomPanel;
