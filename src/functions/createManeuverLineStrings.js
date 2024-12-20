import CheapRuler from "cheap-ruler";
import { featureCollection, lineString } from "@turf/helpers";
import isPedestrianRoute from "./isPedestrianRoute";

const VEHICLE_BEFORE_LENGTH_METERS = 20;
const VEHICLE_AFTER_LENGTH_METERS = 20;

const PEDESTRIAN_BEFORE_LENGTH_METERS = 2.5;
const PEDESTRIAN_AFTER_LENGTH_METERS = 2.5;

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

  // Compute cumulative distances along the route
  const cumulativeDistances = [0];
  for (let i = 1; i < coordinates.length; i++) {
    const [lon1, lat1] = coordinates[i - 1];
    const [lon2, lat2] = coordinates[i];
    cumulativeDistances.push(
      cumulativeDistances[i - 1] + ruler.distance([lon1, lat1], [lon2, lat2])
    );
  }

  const lines = [];

  instructions.slice(0, instructions.length - 1).forEach((instruction) => {
    const { routeOffsetInMeters, pointIndex } = instruction;
    const startOffset = Math.max(routeOffsetInMeters - BEFORE_LENGTH_METERS, 0);
    const endOffset = Math.min(
      routeOffsetInMeters + AFTER_LENGTH_METERS,
      lengthInMeters
    );

    // Extract the part of the route within the desired range
    const part = [];
    for (let i = 0; i < coordinates.length - 1; i++) {
      if (
        cumulativeDistances[i] >= startOffset &&
        cumulativeDistances[i] <= endOffset
      ) {
        part.push(coordinates[i]);
      }

      if (
        cumulativeDistances[i] < startOffset &&
        cumulativeDistances[i + 1] > startOffset
      ) {
        const fraction =
          (startOffset - cumulativeDistances[i]) /
          (cumulativeDistances[i + 1] - cumulativeDistances[i]);
        const interpolated = interpolate3D(
          coordinates[i],
          coordinates[i + 1],
          fraction
        );
        part.push(interpolated);
      }

      if (
        cumulativeDistances[i] < endOffset &&
        cumulativeDistances[i + 1] > endOffset
      ) {
        const fraction =
          (endOffset - cumulativeDistances[i]) /
          (cumulativeDistances[i + 1] - cumulativeDistances[i]);
        const interpolated = interpolate3D(
          coordinates[i],
          coordinates[i + 1],
          fraction
        );
        part.push(interpolated);
        break;
      }
    }

    if (part.length > 1) {
      lines.push(lineString(part, { pointIndex }));
    }
  });

  return featureCollection(lines);
}

function interpolate3D(coord1, coord2, fraction) {
  const [lon1, lat1, ele1] = coord1;
  const [lon2, lat2, ele2] = coord2;

  const lon = lon1 + fraction * (lon2 - lon1);
  const lat = lat1 + fraction * (lat2 - lat1);
  const ele =
    ele1 !== undefined && ele2 !== undefined
      ? ele1 + fraction * (ele2 - ele1)
      : undefined;

  return ele !== undefined ? [lon, lat, ele] : [lon, lat];
}
