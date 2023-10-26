import { makeStyles } from "@fluentui/react";
import { useSelector } from "react-redux";
import ETA from "./ETA";
import { useAppContext } from "../../app/AppContext";
import { useCalculateRouteQuery } from "../../services/routing";

import { getRouteOptions, getAutomaticRouteCalculation } from "../map/mapSlice";

const useStyles = ({ isPhone, isTablet }) =>
  makeStyles((theme) => ({
    root: {
      position: "absolute",
      bottom: 0,
      left: 0,
      margin: `${theme.spacing.m} ${theme.spacing.m} 0`,
      padding: theme.spacing.l1,
      background: theme.palette.white,
      borderTopLeftRadius: theme.spacing.m,
      borderTopRightRadius: theme.spacing.m,
      boxShadow: "0 0 35px 0 rgba(0, 0, 0, 0.25)",
      zIndex: 10,
      ...(isTablet && {
        width: 380
      }),
      ...(isPhone && {
        right: 0,
        margin: `${theme.spacing.m} ${theme.spacing.m} 0`
      })
    }
  }));

const NavigationPanel = () => {
  const { apiKey, measurementSystem, isPhone, isTablet } = useAppContext();
  const classes = useStyles({ isPhone, isTablet })();
  const routeOptions = useSelector(getRouteOptions);
  const automaticRouteCalculation = useSelector(getAutomaticRouteCalculation);
  const { data: route } = useCalculateRouteQuery(
    {
      key: apiKey,
      ...routeOptions
    },
    { skip: !automaticRouteCalculation }
  );

  return route ? (
    <div className={classes.root}>
      <ETA route={route} measurementSystem={measurementSystem} />
    </div>
  ) : null;
};

export default NavigationPanel;
