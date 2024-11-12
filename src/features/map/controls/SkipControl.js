import React from "react";
import { makeStyles, useTheme, Text } from "@fluentui/react";
import { withMap } from "react-tomtom-maps";
import Fade from "../../../components/Fade";
import MapControl from "./MapControl";
import SkipForwardIcon from "../../../icons/SkipForwardIcon";
import useButtonStyles from "../../../hooks/useButtonStyles";
import strings from "../../../config/strings";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.s2,
    minWidth: 85
  },
  text: {
    fontFamily: "Noto Sans",
    fontWeight: 400,
    fontSize: 16
  }
}));

const Skip = ({ visible, onClick = () => {} }) => {
  const theme = useTheme();
  const classes = useStyles();
  const buttonClasses = useButtonStyles();

  const handleClick = () => {
    onClick();
  };

  return (
    <Fade show={visible} duration="0.15s">
      <div
        className={`${buttonClasses.mapControlButton} ${classes.root}`}
        onClick={handleClick}
      >
        <Text className={classes.text}>{strings.skip}</Text>
        <SkipForwardIcon color={theme.palette.black} size={16} />
      </div>
    </Fade>
  );
};

const SkipControl = ({ position = "bottom-right", ...otherProps }) => (
  <MapControl position={position}>
    <Skip {...otherProps} />
  </MapControl>
);

export default withMap(SkipControl);
