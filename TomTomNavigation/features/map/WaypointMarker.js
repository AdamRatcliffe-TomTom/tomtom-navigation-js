import React from "react";
import { Marker } from "react-tomtom-maps";
import WaypointIcon from "../../icons/WaypointIcon";

const WaypointMarker = (props) => (
  <Marker className="WaypointMarker" {...props}>
    <WaypointIcon />
  </Marker>
);

export default WaypointMarker;
