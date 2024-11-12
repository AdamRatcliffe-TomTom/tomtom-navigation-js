import bbox from "@turf/bbox";

export default function geoJsonBounds(geojson) {
  const [minX, minY, maxX, maxY] = bbox(geojson);
  return [
    [minX, minY],
    [maxX, maxY]
  ];
}
