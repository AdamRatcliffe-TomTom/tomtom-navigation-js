import React from "react";
import { Marker } from "react-tomtom-maps";
import Fade from "../../../components/Fade";

const Chevron2DMarker = ({
  visible,
  coordinates,
  bearing,
  animationDuration,
  icon,
  ...otherProps
}) => {
  const style = {
    transform: `rotate(${bearing}deg)`,
    transition: `transform ${animationDuration}ms linear`
  };

  return (
    <Fade show={visible} duration=".15s">
      {coordinates && (
        <Marker
          className="Chevron2DMarker"
          style={style}
          coordinates={coordinates}
          anchor="center"
          {...otherProps}
        >
          {icon}
        </Marker>
      )}
    </Fade>
  );
};

export default Chevron2DMarker;
