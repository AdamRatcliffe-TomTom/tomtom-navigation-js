import React, { useEffect } from "react";
import { useDispatch, batch } from "react-redux";
import { makeStyles, useTheme } from "@fluentui/react";
import { useGeolocated } from "react-geolocated";
import { withMap } from "react-tomtom-maps";
import MapControl from "./MapControl";
import CrosshairIcon from "../../icons/CrosshairIcon";
import shouldAnimateCamera from "../../functions/shouldAnimateCamera";

import { setUserLocation, setCenter, setMovingMethod } from "./mapSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: theme.palette.white,
    boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.075)",
    userSelect: "none",
    cursor: "pointer"
  }
}));

const defaultPositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: Infinity
};

const Geolocate = ({
  map,
  watchPosition = false,
  positionOptions = defaultPositionOptions,
  visible = true
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const classes = useStyles();
  const { coords, isGeolocationEnabled } = useGeolocated({
    watchPosition,
    positionOptions
  });

  useEffect(() => {
    if (coords) {
      const { longitude, latitude } = coords;
      dispatch(setUserLocation([longitude, latitude]));
    }
  }, [coords]);

  const handleClick = () => {
    if (coords) {
      const { longitude, latitude } = coords;
      const center = [longitude, latitude];
      const movingMethod = shouldAnimateCamera(map.getBounds(), center)
        ? "easeTo"
        : "jumpTo";

      batch(() => {
        dispatch(setMovingMethod(movingMethod));
        dispatch(setCenter(center));
      });
    }
  };

  return isGeolocationEnabled && visible ? (
    <div className={classes.root} onClick={handleClick}>
      <CrosshairIcon color={theme.palette.black} />
    </div>
  ) : null;
};

const GeolocateControl = ({ position = "top-right", ...otherProps }) => (
  <MapControl position={position}>
    <Geolocate {...otherProps} />
  </MapControl>
);

export default withMap(GeolocateControl);
