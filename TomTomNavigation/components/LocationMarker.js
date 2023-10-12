import React from "react";
import styled from "styled-components";
import { Marker } from "react-tomtom-maps";

const Circle = styled.div`
  width: 16px;
  height: 16px;
  background: rgb(59, 174, 227);
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.15);
`;

const LocationMarker = (props) => {
  return (
    <Marker {...props} anchor="bottom">
      <Circle />
    </Marker>
  );
};

export default LocationMarker;
