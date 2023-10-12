import turfBounds from "@turf/bbox";

export default function geoJsonBounds(geojson) {
  const [minX, minY, maxX, maxY] = turfBounds(geojson);
  return [
    [minX, minY],
    [maxX, maxY]
  ];
}
