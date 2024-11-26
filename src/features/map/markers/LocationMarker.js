import React from "react";
import { Marker } from "react-tomtom-maps";
import LocationIcon from "../../../icons/LocationIcon";

const LocationMarker = (props) => (
  <Marker className="LocationMarker" anchor="center" {...props}>
    <LocationIcon />
  </Marker>
);

export default LocationMarker;
