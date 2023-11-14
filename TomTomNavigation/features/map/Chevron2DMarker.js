import React from "react";
import { Marker } from "react-tomtom-maps";
import Fade from "../../components/Fade";
import Chevron2DIcon from "../../icons/Chevron2DIcon";

const Chevron2DMarker = ({ visible, coordinates, bearing, ...otherProps }) => {
  const style = {
    transform: `rotate(${bearing}deg)`
  };

  return (
    <Fade show={visible} duration=".15s">
      <Marker
        className="Chevron2DMarker"
        style={style}
        coordinates={coordinates}
        anchor="center"
        {...otherProps}
      >
        <Chevron2DIcon />
      </Marker>
    </Fade>
  );
};

export default Chevron2DMarker;
