import React from "react";
import { makeStyles } from "@fluentui/react";
import Fade from "../../components/Fade";

const useStyles = makeStyles({
  shield: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 108,
    left: 20,
    background: "white",
    width: 56,
    height: 56,
    borderRadius: "50%",
    border: "4px solid #f84545",
    boxShadow: "0 0 35px 0 rgba(0, 0, 0, 0.25)"
  },
  value: {
    color: "black",
    fontSize: 22,
    lineHeight: "1",
    fontWeight: 500
  }
});

const SpeedLimit = ({ value, visible }) => {
  const classes = useStyles();

  return (
    <Fade show={visible} duration="0.3s">
      <div className={classes.shield}>
        <div className={classes.value}>{value}</div>
      </div>
    </Fade>
  );
};

export default SpeedLimit;
