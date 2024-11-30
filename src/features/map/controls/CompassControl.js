import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@fluentui/react";
import { withMap } from "react-tomtom-maps";
import MapControl from "./MapControl";
import CompassIcon from "../../../icons/CompassIcon";
import Fade from "../../../components/Fade";

const useStyles = makeStyles((theme) => ({
  control: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.white,
    width: 56,
    height: 56,
    boxShadow: theme.floatingElementShadow,
    borderRadius: "50%",
    overflow: "hidden",
    transition: "background-color 0.15s ease",
    cursor: "pointer"
  }
}));

function Compass({ map, visible = true, onClick = () => {} }) {
  const theme = useTheme();
  const classes = useStyles();
  const [bearing, setBearing] = useState(0);

  useEffect(() => {
    map.on("rotate", handleMapRotate);
    return () => map.off("rotate", handleMapRotate);
  }, []);

  const handleMapRotate = (e) => {
    const newBearing = e.target.getBearing();
    setBearing(newBearing);
  };

  const iconStyle = {
    transform: `rotate(${-bearing}deg)`,
    transition: "transform 0.1s"
  };

  return (
    <Fade show={visible && bearing !== 0} duration="0.15s">
      <div className={classes.control} onClick={onClick}>
        <CompassIcon color={theme.palette.black} style={iconStyle} size={28} />
      </div>
    </Fade>
  );
}

const CompassControl = ({ position = "top-right", ...otherProps }) => (
  <MapControl position={position}>
    <Compass {...otherProps} />
  </MapControl>
);

export default withMap(CompassControl);
