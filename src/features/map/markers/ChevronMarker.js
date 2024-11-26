import React from "react";
import useMeasure from "react-use-measure";
import { useNavigationContext } from "../../../core/NavigationContext";
import Fade from "../../../components/Fade";
import { makeStyles } from "@fluentui/react";
import { TABLET_PANEL_WIDTH } from "../../../config";

const useStyles = ({ isTablet, iconHeight }) =>
  makeStyles({
    root: {
      position: "absolute",
      left: "50%",
      bottom: isTablet ? 78 + iconHeight : 168 + iconHeight,
      transform: "translateX(-50%)",
      zIndex: 10,
      ...(isTablet && { marginLeft: TABLET_PANEL_WIDTH / 2 })
    }
  });

const ChevronMarker = ({ icon, visible }) => {
  const [iconRef, bounds] = useMeasure({ offsetSize: true });
  const { isTablet } = useNavigationContext();
  const iconHeight = bounds.height;
  const classes = useStyles({ isTablet, iconHeight })();

  return (
    <Fade show={visible} duration=".15s">
      <div className={`ChevronMarker ${classes.root}`}>
        {React.cloneElement(icon, { ref: iconRef })}
      </div>
    </Fade>
  );
};

export default ChevronMarker;
