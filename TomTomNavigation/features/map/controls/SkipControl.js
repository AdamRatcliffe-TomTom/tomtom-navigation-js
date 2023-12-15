import React from "react";
import { useTheme } from "@fluentui/react";
import { withMap } from "react-tomtom-maps";
import Fade from "../../../components/Fade";
import MapControl from "./MapControl";
import ArrowRightIcon from "../../../icons/ArrowRightIcon";
import useButtonStyles from "../../../hooks/useButtonStyles";

const Skip = ({ visible, onClick = () => {} }) => {
  const theme = useTheme();
  const buttonClasses = useButtonStyles();

  const handleClick = () => {
    onClick();
  };

  return (
    <Fade show={visible} duration="0.15s">
      <div className={buttonClasses.mapControlButton} onClick={handleClick}>
        <ArrowRightIcon color={theme.palette.black} />
      </div>
    </Fade>
  );
};

const SkipControl = ({ position = "bottom-right", ...otherProps }) => (
  <MapControl position={position}>
    <Skip {...otherProps} />
  </MapControl>
);

export default withMap(SkipControl);
