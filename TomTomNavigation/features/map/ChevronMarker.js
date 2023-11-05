import React from "react";
import Fade from "../../components/Fade";
import ChevronIcon from "../../icons/ChevronIcon";
import { makeStyles } from "@fluentui/react";

const useStyles = makeStyles({
  root: {
    position: "absolute",
    left: "50%",
    bottom: 185,
    transform: "translate(-50%, 30%)",
    zIndex: 10
  }
});

const ChevronMarker = ({ visible }) => {
  const classes = useStyles();

  return (
    <Fade show={visible} duration=".15s">
      <div className={classes.root}>
        <ChevronIcon />
      </div>
    </Fade>
  );
};

export default ChevronMarker;
