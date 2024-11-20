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
  const imageKey = (url, width, height) => `${url}-${width}-${height}`;

  const features = data.map(
    ({ coordinates, icon: { url, width, height, anchor, offset } }) =>
      point(coordinates, {
        iconImage: imageKey(url, width, height),
        iconAnchor: anchor,
        iconOffset: offset
      })
  );

  const geojson = featureCollection(features);

  useEffect(() => {
    if (map) {
      data.forEach(({ icon: { url, width, height } }) => {
        const key = imageKey(url, width, height);

        if (!map.hasImage(key)) {
          const img = new Image(width, height);
          img.crossOrigin = "Anonymous";
          img.addEventListener("load", () => {
            map.addImage(key, img);
            map.on("styleimagemissing", ({ id }) => {
              if (id === key) {
                map.addImage(key, img);
              }
            });
          });
          img.src = url;
        }
      });
    }
  }, [map, data]);

  return data ? (
    <GeoJSONLayer
      id={id}
      data={geojson}
      symbolLayout={{
        "icon-image": ["get", "iconImage"],
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
