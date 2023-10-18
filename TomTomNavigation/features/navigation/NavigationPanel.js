import { makeStyles } from "@fluentui/react";
import { useSelector } from "react-redux";
import RouteOverview from "./RouteOverview";
import { useAppContext } from "../../app/AppContext";
import { useCalculateRouteQuery } from "../../services/routing";

import { getRouteOptions, getAutomaticRouteCalculation } from "../map/mapSlice";

const useStyles = ({ isPhone }) =>
  makeStyles((theme) => ({
    root: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: isPhone ? "100%" : "380px",
      marginLeft: isPhone ? 0 : theme.spacing.m,
      padding: theme.spacing.l1,
      background: theme.palette.white,
      borderTopLeftRadius: theme.spacing.m,
      borderTopRightRadius: theme.spacing.m,
      boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.15)",
      zIndex: 10
    }
  }));

const NavigationPanel = () => {
  const { apiKey, isPhone } = useAppContext();
  const classes = useStyles({ isPhone })();
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
      <RouteOverview route={route} />
    </div>
  ) : null;
};

export default NavigationPanel;
