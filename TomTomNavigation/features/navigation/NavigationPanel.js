import { makeStyles } from "@fluentui/react";
import { useSelector } from "react-redux";
import { withMap } from "react-tomtom-maps";
import RouteOverview from "./RouteOverview";
import { useAppContext } from "../../app/AppContext";
import { useCalculateRouteQuery } from "../../services/routing";

import { getRouteOptions } from "../map/mapSlice";

const useStyles = ({ isPhone }) =>
  makeStyles((theme) => ({
    root: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: isPhone ? "100%" : "380px",
      marginLeft: isPhone ? 0 : theme.spacing.m,
      padding: theme.spacing.m,
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
  const { data: route } = useCalculateRouteQuery({
    key: apiKey,
    ...routeOptions
  });

  return route ? (
    <div className={classes.root}>
      <RouteOverview route={route} />
    </div>
  ) : null;
};

export default withMap(NavigationPanel);
