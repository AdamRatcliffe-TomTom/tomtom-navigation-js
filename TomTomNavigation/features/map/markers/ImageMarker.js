import React from "react";
import { renderToString } from "react-dom/server";
import { Marker } from "react-tomtom-maps";
import PinIcon from "../../../icons/PinIcon";

const ImageMarker = ({ coordinates, icon }) => {
  const {
    url,
    width = 48,
    height = 48,
    anchor = "bottom",
    offset = [0, 0]
  } = icon;

  const handleError = ({ target }) => {
    target.width = 39;
    target.height = 49;
    target.src = `data:image/svg+xml,${encodeURIComponent(
      renderToString(<PinIcon />)
    )}`;
  };

  return (
    <Marker
      className="ImageMarker"
      coordinates={coordinates}
      anchor={anchor}
      offset={offset}
    >
      <img
        src={url}
        width={width}
        height={height}
        alt=""
        onError={handleError}
      />
    </Marker>
  );
};

export default ImageMarker;
