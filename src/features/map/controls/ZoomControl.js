import React from "react";
import { makeStyles, useTheme } from "@fluentui/react";
import { withMap } from "react-tomtom-maps";
// import Fade from "../../../components/Fade";
import MapControl from "./MapControl";
import PlusIcon from "../../../icons/PlusIcon";
import MinusIcon from "../../../icons/MinusIcon";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 28,
    boxShadow: theme.floatingElementShadow,
    userSelect: "none",
    cursor: "pointer"
  },
  zoomIn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 60,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: theme.palette.white,
    ":active": {
      backgroundColor: theme.semanticColors.buttonBackgroundPressed
    }
  },
  zoomOut: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 60,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    backgroundColor: theme.palette.white,
    ":active": {
      backgroundColor: theme.semanticColors.buttonBackgroundPressed
    }
  }
}));

const ZoomControl = ({
  map,
  animate = true,
  visible = true,
  position = "bottom-right"
}) => {
  const theme = useTheme();
  const classes = useStyles();

  const handleZoomIn = () => {
    const newZoom = Math.min(map.getZoom() + 1, 20);
    map.easeTo({ zoom: newZoom, animate });
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(map.getZoom() - 1, 0);
    map.easeTo({ zoom: newZoom, animate });
  };

  return visible ? (
    // <Fade show={visible} duration="0.15s">
    <MapControl position={position}>
      <div className={classes.root}>
        <div className={classes.zoomIn} onClick={handleZoomIn}>
          <PlusIcon color={theme.palette.black} size={28} />
        </div>
        <div className={classes.zoomOut} onClick={handleZoomOut}>
          <MinusIcon color={theme.palette.black} size={28} />
        </div>
      </div>
    </MapControl>
  ) : // </Fade>
  null;
};

export default withMap(ZoomControl);
