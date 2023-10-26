import React, { useEffect } from "react";
import { useDispatch, batch } from "react-redux";
import { useTheme } from "@fluentui/react";
import { useGeolocated } from "react-geolocated";
import { withMap } from "react-tomtom-maps";
import MapControl from "./MapControl";
import CrosshairIcon from "../../icons/CrosshairIcon";
import shouldAnimateCamera from "../../functions/shouldAnimateCamera";
import useButtonStyles from "../../hooks/useButtonStyles";

import { setUserLocation, setCenter, setMovingMethod } from "./mapSlice";

const defaultPositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: Infinity
};

const Geolocate = ({
  map,
  watchPosition = false,
  positionOptions = defaultPositionOptions
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const buttonClasses = useButtonStyles();
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
        ? "flyTo"
        : "jumpTo";

      batch(() => {
        dispatch(setMovingMethod(movingMethod));
        dispatch(setCenter(center));
      });
    }
  };

  return isGeolocationEnabled ? (
    <div className={buttonClasses.mapControlButton} onClick={handleClick}>
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
