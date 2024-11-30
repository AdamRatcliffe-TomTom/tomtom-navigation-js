import React from "react";
import { makeStyles } from "@fluentui/react";
import { useNavigationContext } from "../../core/NavigationContext";
import Fade from "../../components/Fade";

const useStyles = ({ isPhone, isTablet, bottomPanelHeight }) =>
  makeStyles((theme) => ({
    shield: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      ...(isTablet && { top: 16, right: 88 }),
      ...(isPhone && { bottom: bottomPanelHeight + 16, left: 20 }),
      background: "white",
      width: 56,
      height: 56,
      borderRadius: "50%",
      border: "4px solid #f84545",
      boxShadow: theme.floatingElementShadow
    },
    value: {
      color: "black",
      fontSize: 22,
      lineHeight: "1",
      fontWeight: 500
    }
  }));

const SpeedLimitEU = React.memo(({ value, visible }) => {
  const { isPhone, isTablet, bottomPanelHeight } = useNavigationContext();
  const classes = useStyles({ isPhone, isTablet, bottomPanelHeight })();

  return (
    <Fade show={visible} duration="0.3s">
      <div className={`SpeedLimitEU ${classes.shield}`}>
        <div className={classes.value}>{value}</div>
      </div>
    </Fade>
  );
});

export default SpeedLimitEU;
