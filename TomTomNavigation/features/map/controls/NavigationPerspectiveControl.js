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
  navigationPerspective = NavigationPerspectives.DRIVING,
  onClick = () => {}
}) => {
  const theme = useTheme();
  const buttonClasses = useButtonStyles();

  const handleClick = () => {
    const perspective =
      navigationPerspective === NavigationPerspectives.DRIVING
        ? NavigationPerspectives.ROUTE_OVERVIEW
        : NavigationPerspectives.DRIVING;

    onClick(perspective);
  };

  const Icon =
    navigationPerspective === NavigationPerspectives.DRIVING
      ? RouteIcon
      : ChevronOutlineIcon;

  return (
    <Fade show={visible} duration="0.15s">
      <div className={buttonClasses.mapControlButton} onClick={handleClick}>
        <Icon color={theme.palette.black} />
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
