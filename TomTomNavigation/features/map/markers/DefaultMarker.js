import React from "react";
import { Marker } from "react-tomtom-maps";
import PinIcon from "../../../icons/PinIcon";

const DefaultMarker = (props) => (
  <Marker className="DefaultMarker" anchor="bottom" {...props}>
    <PinIcon />
  </Marker>
);

export default DefaultMarker;
