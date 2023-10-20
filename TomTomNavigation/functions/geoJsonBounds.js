import bbox from "@turf/bbox";
import { feature, featureCollection } from "@turf/helpers";

export default function geoJsonBounds(geojson) {
  // If passed an array of coordinates, convert to a GeoJSON FeatureCollection to
  // caculate its bounds
  if (
    Array.isArray(geojson) &&
    Array.isArray(geojson[0]) &&
    geojson[0].length === 2
  ) {
    geojson = featureCollection(
      geojson.map((coordinates) => feature({ type: "Point", coordinates }))
    );
  }

  const [minX, minY, maxX, maxY] = bbox(geojson);
  return [
    [minX, minY],
    [maxX, maxY]
  ];
}
