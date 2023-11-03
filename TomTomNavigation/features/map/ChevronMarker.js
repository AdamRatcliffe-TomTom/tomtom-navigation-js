import React from "react";
import ChevronIcon from "../../icons/ChevronIcon";
import { makeStyles } from "@fluentui/react";

const useStyles = makeStyles({
  root: {
    position: "absolute",
    left: "50%",
    bottom: 185,
    transform: "translate(-50%, 50%)",
    zIndex: 10
  }
});

const ChevronMarker = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ChevronIcon />
    </div>
  );
};

export default ChevronMarker;
