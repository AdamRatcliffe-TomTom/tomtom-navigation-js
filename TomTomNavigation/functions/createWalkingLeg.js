import CheapRuler from "cheap-ruler";
import { lineString, featureCollection } from "@turf/helpers";

export default function createWalkingLeg(waypoints, geojson) {
  const route = geojson.features[0];
  const {
    geometry: { coordinates }
  } = route;
  const lastCoordinate = coordinates.at(-1);
  const lastWaypointCoordinate = waypoints.at(-1).coordinates;

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
