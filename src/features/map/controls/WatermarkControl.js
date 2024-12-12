import React from "react";
import { withMap } from "react-tomtom-maps";
import { useTheme } from "@fluentui/react";
import MapControl from "./MapControl";
import Logo from "../Logo";

const Watermark = ({ visible = true, onClick = () => {} }) => {
  const theme = useTheme();

  const handleClick = () => {
    onClick();
  };

  return visible ? (
    <div onClick={handleClick}>
      <Logo width={81} height={16} color={theme.palette.black} />
    </div>
  ) : null;
};

const WatermarkControl = ({ position = "bottom-right", ...otherProps }) => (
  <MapControl position={position}>
    <Watermark {...otherProps} />
  </MapControl>
);

export default withMap(WatermarkControl);
