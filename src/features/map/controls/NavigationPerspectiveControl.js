import React from "react";
import { useTheme } from "@fluentui/react";
import MapControl from "./MapControl";
import Fade from "../../../components/Fade";
import RouteIcon from "../../../icons/RouteIcon";
import ChevronOutlineIcon from "../../../icons/ChevronOutlineIcon";
import useButtonStyles from "../../../hooks/useButtonStyles";
import NavigationPerspectives from "../../../constants/NavigationPerspectives";

const NavigationPerspective = ({
  visible,
  navigationPerspective = NavigationPerspectives.FOLLOW,
  onClick = () => {}
}) => {
  const theme = useTheme();
  const buttonClasses = useButtonStyles();

  const handleClick = () => {
    const perspective =
      navigationPerspective === NavigationPerspectives.FOLLOW
        ? NavigationPerspectives.OVERVIEW
        : NavigationPerspectives.FOLLOW;

    onClick(perspective);
  };

  const Icon =
    navigationPerspective === NavigationPerspectives.FOLLOW
      ? RouteIcon
      : ChevronOutlineIcon;

  return (
    <Fade show={visible} duration="0.15s">
      <div className={buttonClasses.mapControlButton} onClick={handleClick}>
        <Icon color={theme.palette.black} size={32} />
      </div>
    </Fade>
  );
};

const NavigationPerspectiveControl = ({
  position = "top-right",
  ...otherProps
}) => {
  return (
    <MapControl position={position}>
      <NavigationPerspective {...otherProps} />
    </MapControl>
  );
};

export default NavigationPerspectiveControl;
