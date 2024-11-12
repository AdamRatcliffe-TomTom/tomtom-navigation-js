export default function getSectionTypesForTravelMode(travelMode) {
  return travelMode === "pedestrian"
    ? ["lanes", "traffic"]
    : ["speedLimit", "lanes", "traffic"];
}
