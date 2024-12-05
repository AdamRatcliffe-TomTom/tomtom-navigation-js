import React from "react";
import { useNavigationContext } from "../../../core/NavigationContext";
// import Fade from "../../../components/Fade";
import { makeStyles } from "@fluentui/react";
import {
  TABLET_PANEL_WIDTH,
  TABLET_CHEVRON_BOTTOM_OFFSET,
  PHONE_CHEVRON_BOTTOM_OFFSET
} from "../../../config";

const useStyles = ({ isTablet, bottomPanelHeight }) =>
  makeStyles({
    root: {
      position: "absolute",
      left: "50%",
      bottom: isTablet
        ? TABLET_CHEVRON_BOTTOM_OFFSET
        : bottomPanelHeight + PHONE_CHEVRON_BOTTOM_OFFSET,
      transform: "translate(-50%,50%)",
      zIndex: 10,
      ...(isTablet && { marginLeft: TABLET_PANEL_WIDTH / 2 })
    }
  });

const ChevronMarker = ({ icon, visible }) => {
  const { isTablet, bottomPanelHeight } = useNavigationContext();
  const classes = useStyles({ isTablet, bottomPanelHeight })();

  return visible ? (
    // <Fade show={visible} duration=".15s">
    <div className={`ChevronMarker ${classes.root}`}>{icon}</div>
  ) : // </Fade>
  null;
};

export default ChevronMarker;
