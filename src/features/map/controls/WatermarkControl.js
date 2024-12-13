import React from "react";
import { withMap } from "react-tomtom-maps";
import { useTheme } from "@fluentui/react";
import MapControl from "./MapControl";
import { useNavigationContext } from "../../../core/NavigationContext";
import Logo from "../Logo";

const Watermark = ({ visible = true, onClick = () => {} }) => {
  const theme = useTheme();
  const { isPhone } = useNavigationContext();

  const handleClick = () => {
    onClick();
  };

  return visible ? (
    <div onClick={handleClick}>
      <Logo
        color={theme.palette.black}
        {...(isPhone && { width: 91, height: 18 })}
      />
    </div>
  ) : null;
};

const WatermarkControl = ({ position = "bottom-right", ...otherProps }) => (
  <MapControl position={position} style={{ pointerEvents: "none" }}>
    <Watermark {...otherProps} />
  </MapControl>
);

export default withMap(WatermarkControl);
