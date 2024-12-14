import CheapRuler from "cheap-ruler";
import { lineString, featureCollection } from "@turf/helpers";

export default function createWalkingLeg(waypoints, geojson) {
  const route = geojson.features[0];
  const {
    geometry: { coordinates }
  } = route;

  const lastCoordinate = coordinates.at(-1);

  let lastWaypointCoordinate;
  if (Array.isArray(waypoints)) {
    lastWaypointCoordinate = waypoints.at(-1)?.geometry?.coordinates;
  } else {
    throw new Error(
      "Invalid waypoints format. Expected an array of GeoJSON Point features."
    );
  }

  if (!lastWaypointCoordinate) {
    throw new Error(
      "Unable to determine the coordinates of the last waypoint."
    );
  }

  const ruler = new CheapRuler(lastCoordinate[1], "meters");
  const distance = ruler.distance(lastCoordinate, lastWaypointCoordinate);

  // Create a walking leg if the distance between the last point of the route
  // and the destination waypoint is > 10 meters
  if (distance > 10) {
    return featureCollection([
      lineString([lastCoordinate, lastWaypointCoordinate])
    ]);
  } else {
    return null;
  }
}
