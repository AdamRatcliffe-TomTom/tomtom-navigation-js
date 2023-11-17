import React from "react";
import { Marker } from "react-tomtom-maps";
import { Image } from "@fluentui/react";

const ImageMarker = ({ coordinates, icon }) => {
  const {
    url,
    width = 48,
    height = 48,
    anchor = "bottom",
    offset = [0, 0]
  } = icon;

  return (
    <Marker
      className="ImageMarker"
      coordinates={coordinates}
      anchor={anchor}
      offset={offset}
    >
      <Image src={url} width={width} height={height} />
    </Marker>
  );
};

export default ImageMarker;
