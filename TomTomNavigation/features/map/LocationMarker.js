import React from "react";
import { makeStyles } from "@fluentui/react";
import { Marker } from "react-tomtom-maps";

const useStyles = makeStyles({
  root: {
    boxSizing: "border-box",
    width: "24px",
    height: "24px",
    background: "rgb(59, 174, 227)",
    border: "3px solid white",
    borderRadius: "50%",
    boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.075)"
  }
});

const LocationMarker = (props) => {
  const classes = useStyles();
  return (
    <Marker className="LocationMarker" {...props} anchor="bottom">
      <div className={classes.root} />
    </Marker>
  );
};

export default LocationMarker;
