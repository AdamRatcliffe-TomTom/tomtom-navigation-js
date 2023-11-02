import React from "react";
import ChevronIcon from "../../icons/ChevronIcon";
import { makeStyles } from "@fluentui/react";

const useStyles = makeStyles({
  root: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginTop: 200,
    transform: "translate(-50%, -50%)",
    zIndex: 10
  }
});

const DeviceMarker = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ChevronIcon />
    </div>
  );
};

export default DeviceMarker;
