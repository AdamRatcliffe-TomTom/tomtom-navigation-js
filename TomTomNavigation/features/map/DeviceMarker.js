import React from "react";
import { Marker } from "react-tomtom-maps";
import ChevronIcon from "../../icons/ChevronIcon";

const DeviceMarker = (props) => (
  <Marker className="DeviceMarker" {...props}>
    <ChevronIcon />
  </Marker>
);

export default DeviceMarker;
