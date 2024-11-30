import CheapRuler from "cheap-ruler";
import { featureCollection, lineString } from "@turf/helpers";
import isPedestrianRoute from "./isPedestrianRoute";

const VEHICLE_BEFORE_LENGTH_METERS = 20;
const VEHICLE_AFTER_LENGTH_METERS = 20;

const PEDESTRIAN_BEFORE_LENGTH_METERS = 2.5;
const PEDESTRIAN_AFTER_LENGTH_METERS = 2.5;

const MIN_ARROW_GAP_METERS = 50;

export default function createManeuverLineStrings(geojson) {
  const route = geojson.features[0];
  const {
    geometry: { coordinates },
    properties: {
      summary: { lengthInMeters },
      guidance: { instructions }
    }
  } = route;

  const BEFORE_LENGTH_METERS = isPedestrianRoute(route)
    ? PEDESTRIAN_BEFORE_LENGTH_METERS
    : VEHICLE_BEFORE_LENGTH_METERS;
  const AFTER_LENGTH_METERS = isPedestrianRoute(route)
    ? PEDESTRIAN_AFTER_LENGTH_METERS
    : VEHICLE_AFTER_LENGTH_METERS;

  const ruler = new CheapRuler(coordinates[0][1], "meters");
  const lines = [];

  instructions.slice(0, instructions.length - 1).forEach((instruction) => {
    const { routeOffsetInMeters, pointIndex } = instruction;
    const startOffset = Math.max(routeOffsetInMeters - BEFORE_LENGTH_METERS, 0);
    const endOffset = Math.min(
      routeOffsetInMeters + AFTER_LENGTH_METERS,
      lengthInMeters
    );

    const part = ruler.lineSliceAlong(startOffset, endOffset, coordinates);

    if (part.length > 1) {
      lines.push(lineString(part, { pointIndex }));
    }
  });

  return featureCollection(lines);
}
