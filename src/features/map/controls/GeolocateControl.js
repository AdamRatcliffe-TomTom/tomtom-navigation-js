import React, { useEffect } from "react";
import { useTheme } from "@fluentui/react";
import { useGeolocated } from "react-geolocated";
import { withMap } from "react-tomtom-maps";
import MapControl from "./MapControl";
import CrosshairIcon from "../../../icons/CrosshairIcon";
import useButtonStyles from "../../../hooks/useButtonStyles";

const defaultPositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: Infinity
};

const GeolocateButton = ({
  watchPosition,
  positionOptions,
  onClick,
  onLocationChange
}) => {
  const theme = useTheme();
  const buttonClasses = useButtonStyles();

  const { coords, isGeolocationEnabled } = useGeolocated({
    watchPosition,
    positionOptions
  });

  useEffect(() => {
    onLocationChange(coords);
  }, [coords]);

  const handleClick = () => {
    onClick(coords);
  };

  if (!isGeolocationEnabled) return null;

  return (
    <div className={buttonClasses.mapControlButton} onClick={handleClick}>
      <CrosshairIcon color={theme.palette.black} size={28} />
    </div>
  );
};

const Geolocate = ({
  watchPosition = false,
  positionOptions = defaultPositionOptions,
  visible,
  onClick = () => {},
  onLocationChange = () => {}
}) => {
  return visible ? (
    <GeolocateButton
      watchPosition={watchPosition}
      positionOptions={positionOptions}
      onClick={onClick}
      onLocationChange={onLocationChange}
    />
  ) : null;
};

const GeolocateControl = ({ position = "top-right", ...otherProps }) => (
  <MapControl position={position}>
    <Geolocate {...otherProps} />
  </MapControl>
);

export default withMap(GeolocateControl);
