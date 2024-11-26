import React from "react";
import { makeStyles } from "@fluentui/react";

const useStyles = makeStyles({
  root: {
    boxSizing: "border-box",
    width: 20,
    height: 20,
    background: "rgb(59, 174, 227)",
    border: "3px solid white",
    borderRadius: "50%",
    boxShadow: "0px 0px 16px 4px rgba(0, 0, 0, 0.15)"
  }
});

const LocationIcon = React.forwardRef((_, ref) => {
  const classes = useStyles();
  return <div ref={ref} className={classes.root} />;
});

export default LocationIcon;
