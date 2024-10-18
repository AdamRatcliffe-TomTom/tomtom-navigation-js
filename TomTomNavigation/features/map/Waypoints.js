import React, { useEffect } from "react";
import { point, featureCollection } from "@turf/helpers";
import { GeoJSONLayer } from "react-tomtom-maps";
import { withMap } from "react-tomtom-maps";
import { v4 as uuid } from "uuid";

const Waypoints = ({
  id = `Waypoints-${uuid()}`,
  map,
  data = [],
  ...otherProps
}) => {
  const features = data.map(({ coordinates, icon: { url, anchor, offset } }) =>
    point(coordinates, {
      iconUrl: url,
      iconAnchor: anchor,
      iconOffset: offset
    })
  );
  const geojson = featureCollection(features);

  useEffect(() => {
    if (map) {
      data.forEach(({ icon: { url, width, height } }) => {
        if (!map.hasImage(url)) {
          const img = new Image(width, height);
          img.addEventListener("load", () => {
            map.addImage(url, img);
            map.on("styleimagemissing", ({ id }) => {
              if (id === url) {
                map.addImage(url, img);
              }
            });
          });
          img.src = url;
        }
      });
    }
  }, [map]);

  return data ? (
    <GeoJSONLayer
      id={id}
      data={geojson}
      symbolLayout={{
        "icon-image": ["get", "iconUrl"],
        "icon-anchor": ["get", "iconAnchor"],
        "icon-offset": ["get", "iconOffset"],
        "icon-allow-overlap": true
      }}
      layerOptions={{
        maxzoom: 24
      }}
      {...otherProps}
    />
  ) : null;
};

export default withMap(Waypoints);
