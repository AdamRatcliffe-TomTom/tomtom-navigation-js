import React, { useMemo } from "react";
import { point, featureCollection } from "@turf/helpers";
import { GeoJSONLayer } from "react-tomtom-maps";

const DeviceMarkerGeoJson = ({ coordinates }) => {
  if (!coordinates) return null;

  const data = useMemo(
    () => featureCollection([point(coordinates)]),
    [JSON.stringify(coordinates)]
  );

  return (
    <GeoJSONLayer
      data={data}
      circlePaint={{
        "circle-color": "blue",
        "circle-pitch-alignment": "map",
        "circle-radius": 20
      }}
    />
  );
};

export default DeviceMarkerGeoJson;
