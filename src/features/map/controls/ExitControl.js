import React from "react";
import { useTheme } from "@fluentui/react";
import { withMap } from "react-tomtom-maps";
// import Fade from "../../../components/Fade";
import MapControl from "./MapControl";
import ArrowLeftIcon from "../../../icons/ArrowLeftIcon";
import useButtonStyles from "../../../hooks/useButtonStyles";

const Exit = ({ visible, onClick = () => {} }) => {
  const theme = useTheme();
  const buttonClasses = useButtonStyles();

  const handleClick = () => {
    onClick();
  };

  return visible ? (
    // <Fade show={visible} duration="0.15s">
    <div className={buttonClasses.mapControlButton} onClick={handleClick}>
      <ArrowLeftIcon color={theme.palette.black} size={28} />
    </div>
  ) : null;
};

const ExitControl = ({ position = "top-left", ...otherProps }) => (
  <MapControl position={position}>
    <Exit {...otherProps} />
  </MapControl>
);

export default withMap(ExitControl);
