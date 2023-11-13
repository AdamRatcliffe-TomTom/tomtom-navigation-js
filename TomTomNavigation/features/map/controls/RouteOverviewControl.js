import React from "react";
import { useTheme } from "@fluentui/react";
import MapControl from "./MapControl";
import Fade from "../../../components/Fade";
import RouteIcon from "../../../icons/RouteIcon";
import ChevronOutlineIcon from "../../../icons/ChevronOutlineIcon";
import useButtonStyles from "../../../hooks/useButtonStyles";
import NavigationPerspectives from "../../../constants/NavigationPerspectives";

const RouteOverview = ({
  visible,
  navigationPerspective = NavigationPerspectives.DRIVING
}) => {
  const theme = useTheme();
  const buttonClasses = useButtonStyles();

  const Icon =
    navigationPerspective === NavigationPerspectives.DRIVING
      ? RouteIcon
      : ChevronOutlineIcon;

  return (
    <Fade show={visible}>
      <div className={buttonClasses.mapControlButton}>
        <Icon color={theme.palette.black} />
      </div>
    </Fade>
  );
};

const RouteOverviewControl = ({ position = "top-right", ...otherProps }) => {
  return (
    <MapControl position={position}>
      <RouteOverview {...otherProps} />
    </MapControl>
  );
};

export default RouteOverviewControl;
