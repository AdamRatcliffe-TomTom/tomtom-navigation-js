import React from "react";
import { useAppContext } from "../../../app/AppContext";
import Fade from "../../../components/Fade";
import ChevronIcon from "../../../icons/ChevronIcon";
import { makeStyles } from "@fluentui/react";

import { TABLET_PANEL_WIDTH } from "../../../config";

const useStyles = ({ isTablet }) =>
  makeStyles({
    root: {
      position: "absolute",
      left: "50%",
      bottom: isTablet ? 105 : 185,
      transform: "translate(-50%, 30%)",
      zIndex: 10,
      ...(isTablet && { marginLeft: TABLET_PANEL_WIDTH / 2 })
    }
  });

const ChevronMarker = ({ visible }) => {
  const { isTablet } = useAppContext();
  const classes = useStyles({ isTablet })();

  return (
    <Fade show={visible} duration=".15s">
      <div className={classes.root}>
        <ChevronIcon />
      </div>
    </Fade>
  );
};

export default ChevronMarker;
