import { makeStyles } from "@fluentui/react";
import RouteOverviewPanel from "./RouteOverviewPanel";
import { useAppContext } from "../../app/AppContext";

const useStyles = (props) =>
  makeStyles((theme) => ({
    root: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: props.isPhone ? "100%" : "380px",
      marginLeft: props.isPhone ? 0 : theme.spacing.m,
      padding: theme.spacing.m,
      background: theme.palette.white,
      borderTopLeftRadius: theme.spacing.m,
      borderTopRightRadius: theme.spacing.m,
      boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.15)",
      zIndex: 10
    }
  }));

const NavigationView = ({ route }) => {
  const { isPhone } = useAppContext();
  const classes = useStyles({ isPhone })();

  return (
    <div className={classes.root}>
      <RouteOverviewPanel route={route} />
    </div>
  );
};

export default NavigationView;
