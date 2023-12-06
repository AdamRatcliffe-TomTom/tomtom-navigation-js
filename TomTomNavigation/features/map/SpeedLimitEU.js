import React from "react";
import { makeStyles } from "@fluentui/react";
import { useAppContext } from "../../app/AppContext";
import Fade from "../../components/Fade";

const useStyles = ({ isPhone, isTablet }) =>
  makeStyles((theme) => ({
    shield: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      ...(isTablet && { top: 16, right: 88 }),
      ...(isPhone && { bottom: 108, left: 20 }),
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

const SpeedLimitEU = ({ value, visible }) => {
  const { isPhone, isTablet } = useAppContext();
  const classes = useStyles({ isPhone, isTablet })();

  return (
    <Fade show={visible} duration="0.3s">
      <div className={classes.shield}>
        <div className={classes.value}>{value}</div>
      </div>
    </Fade>
  );
};

export default SpeedLimitEU;
