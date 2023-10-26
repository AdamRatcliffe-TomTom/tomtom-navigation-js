import React from "react";
import { useTheme } from "@fluentui/react";
import MapControl from "./MapControl";
import LayersIcon from "../../icons/LayersIcon";
import Fade from "../../components/Fade";
import useButtonStyles from "../../hooks/useButtonStyles";

const MapSwitcher = ({ visible = true }) => {
  const theme = useTheme();
  const buttonStyles = useButtonStyles();

  return (
    <Fade show={visible} duration="0.3s">
      <div className={buttonStyles.mapControlButton}>
        <LayersIcon color={theme.palette.black} />
      </div>
    </Fade>
  );
};

const MapSwitcherControlAlt = ({ position = "top-right", ...otherProps }) => (
  <MapControl position={position}>
    <MapSwitcher {...otherProps} />
  </MapControl>
);

export default MapSwitcherControlAlt;
