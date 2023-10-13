import React from "react";
import styled from "styled-components";
import { Marker } from "react-tomtom-maps";

const Circle = styled.div`
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  background: rgb(59, 174, 227);
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.075);
`;

const LocationMarker = (props) => {
  return (
    <Marker {...props} anchor="bottom">
      <Circle />
    </Marker>
  );
};

export default LocationMarker;
