import React from "react";
import { Marker } from "react-tomtom-maps";
import ChevronIcon from "../../icons/ChevronIcon";

const DeviceMarker = (props) =>
  props.coordinates ? (
    <Marker className="DeviceMarker" {...props}>
      <ChevronIcon />
    </Marker>
  ) : null;

export default DeviceMarker;
