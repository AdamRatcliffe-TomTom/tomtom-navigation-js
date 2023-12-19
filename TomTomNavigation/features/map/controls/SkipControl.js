import React from "react";
import { makeStyles, Text } from "@fluentui/react";
import { withMap } from "react-tomtom-maps";
import Fade from "../../../components/Fade";
import MapControl from "./MapControl";
import useButtonStyles from "../../../hooks/useButtonStyles";
import strings from "../../../config/strings";

const useStyles = makeStyles({
  root: {
    minWidth: 75
  },
  text: {
    fontFamily: "Noto Sans",
    fontWeight: 400,
    fontSize: 16
  }
});

const Skip = ({ visible, onClick = () => {} }) => {
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
