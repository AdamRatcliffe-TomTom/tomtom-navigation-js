import React from "react";
import { makeStyles } from "@fluentui/react";
import Fade from "../../components/Fade";
import metersToMiles from "../../functions/metersToMiles";
import strings from "../../config/strings";

const useStyles = makeStyles({
  shield: {
    position: "absolute",
    bottom: 112,
    left: 20,
    background: "white",
    padding: 3,
    borderRadius: 6,
    border: "2.5px solid black",
    textAlign: "center",
    boxShadow: "white 0px 0px 0px 2px, 0 0 35px 0 rgba(0, 0, 0, 0.25)"
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
});

const SpeedLimitUS = ({ value, visible }) => {
  const classes = useStyles();
  const speedLimit = value ? Math.round(metersToMiles(value * 1000)) : "\u2014";

  return (
    <Fade show={visible} duration="0.3s">
      <div className={classes.shield}>
        <div className={classes.label}>{strings.speedLimit}</div>
        <div className={classes.value}>{speedLimit}</div>
      </div>
    </Fade>
  );
};

export default SpeedLimitUS;
