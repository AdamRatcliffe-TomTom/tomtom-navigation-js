import expandBoundsByPercentage from "./expandBoundsByPercentage";
import turfBboxPolygon from "@turf/bbox-polygon";
import turfBooleanContains from "@turf/boolean-contains";

export default function shouldAnimateCamera(bounds, feature) {
  if (Array.isArray(feature)) {
    feature = { type: "Point", coordinates: feature };
  }
  const extendedBounds = expandBoundsByPercentage(bounds, 50);
  const extendedBoundsPoly = turfBboxPolygon(extendedBounds.toArray().flat());
  return turfBooleanContains(extendedBoundsPoly, feature);
}
