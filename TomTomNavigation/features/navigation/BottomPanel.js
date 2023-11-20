import { makeStyles } from "@fluentui/react";
import { useSelector } from "react-redux";
import ETAPanel from "./ETAPanel";
import ArrivalPanel from "./ArrivalPanel";
import { useAppContext } from "../../app/AppContext";

import { getIsNavigating, getHasReachedDestination } from "./navigationSlice";

const useStyles = ({ isPhone, isTablet }) =>
  makeStyles((theme) => ({
    root: {
      position: "absolute",
      bottom: 0,
      left: 0,
      margin: `${theme.spacing.m} ${theme.spacing.m} 0`,
      background: theme.palette.white,
      borderTopLeftRadius: theme.spacing.m,
      borderTopRightRadius: theme.spacing.m,
      boxShadow: theme.floatingElementShadow,
      ...(isTablet && {
        width: 380
      }),
      ...(isPhone && {
        right: 0,
        margin: `${theme.spacing.s1} ${theme.spacing.s1} 0`
      })
    }
  }));

const BottomPanel = ({ route, onStartNavigation, onStopNavigation }) => {
  const { measurementSystem, isPhone, isTablet } = useAppContext();
  const classes = useStyles({ isPhone, isTablet })();
  const isNavigating = useSelector(getIsNavigating);
  const hasReachedDestination = useSelector(getHasReachedDestination);

  return route ? (
    <div className={classes.root}>
      {hasReachedDestination ? (
        <ArrivalPanel onStopNavigation={onStopNavigation} />
      ) : (
        <ETAPanel
          route={route}
          measurementSystem={measurementSystem}
          isNavigating={isNavigating}
          onStartNavigation={onStartNavigation}
          onStopNavigation={onStopNavigation}
        />
      )}
    </div>
  ) : null;
};

export default BottomPanel;
