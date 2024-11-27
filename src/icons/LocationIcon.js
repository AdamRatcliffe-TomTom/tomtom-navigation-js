import React from "react";
import { makeStyles } from "@fluentui/react";

const useStyles = ({ size }) =>
  makeStyles({
    root: {
      boxSizing: "border-box",
      width: size,
      height: size,
      background: "rgb(59, 174, 227)",
      border: "3px solid white",
      borderRadius: "50%",
      boxShadow: "0px 0px 16px 2px rgba(0, 0, 0, 0.1)"
    }
  });

const LocationIcon = React.forwardRef(({ size = 20, style }, ref) => {
  const classes = useStyles({ size })();
  return <div ref={ref} className={classes.root} style={style} />;
});

export default LocationIcon;
