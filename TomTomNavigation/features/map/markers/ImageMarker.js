import React from "react";
import { Marker } from "react-tomtom-maps";
import { Image } from "@fluentui/react";

const ImageMarker = ({
  coordinates,
  iconUrl,
  iconWidth = 48,
  iconHeight = 48,
  iconAnchor = "bottom"
}) => {
  return (
    <Marker
      className="ImageMarker"
      anchor={iconAnchor}
      coordinates={coordinates}
    >
      <Image src={iconUrl} width={iconWidth} height={iconHeight} />
    </Marker>
  );
};

export default ImageMarker;
