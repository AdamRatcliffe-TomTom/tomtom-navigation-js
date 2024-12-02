import React from "react";
import { makeStyles } from "@fluentui/react";
import { useNavigationContext } from "../../core/NavigationContext";
// import Fade from "../../components/Fade";
import metersToMiles from "../../functions/metersToMiles";

const useStyles = ({ isPhone, isTablet, bottomPanelHeight }) =>
  makeStyles((theme) => ({
    shield: {
      position: "absolute",
      ...(isTablet && { top: 16, right: 88 }),
      ...(isPhone && { bottom: bottomPanelHeight + 18, left: 20 }),
      background: "white",
      padding: 3,
      borderRadius: 6,
      border: "2.5px solid black",
      textAlign: "center",
      boxShadow: `white 0px 0px 0px 2px, ${theme.floatingElementShadow}`
    },
    label: {
      color: "black",
      fontSize: 11,
      fontWeight: 600,
      lineHeight: "1.1",
      textTransform: "uppercase",
      wordWrap: "break-word",
      maxWidth: 40
    },
    value: {
      color: "black",
      fontSize: 26,
      lineHeight: "1.1",
      fontWeight: 500
    }
  }));

const SpeedLimitUS = React.memo(({ value, visible }) => {
  const { isPhone, isTablet, bottomPanelHeight } = useNavigationContext();
  const classes = useStyles({ isPhone, isTablet, bottomPanelHeight })();
  const speedLimit = value ? Math.round(metersToMiles(value * 1000)) : "\u2014";

  return visible ? (
    // <Fade show={visible} duration="0.3s">
    <div className={`SpeedLimitUS ${classes.shield}`}>
      <div className={classes.label}>Speed Limit</div>
      <div className={classes.value}>{speedLimit}</div>
    </div>
  ) : null;
});

export default SpeedLimitUS;
