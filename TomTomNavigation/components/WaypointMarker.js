import React from "react";
import { Marker } from "react-tomtom-maps";
import WaypointIcon from "./icons/WaypointIcon";

const WaypointMarker = (props) => (
  <Marker {...props}>
    <WaypointIcon />
  </Marker>
);

export default WaypointMarker;
