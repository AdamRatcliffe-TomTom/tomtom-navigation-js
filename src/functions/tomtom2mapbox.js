import turfBearing from "@turf/bearing";
import { point as turfPoint } from "@turf/helpers";
import turfCleanCoords from "@turf/clean-coords";
import coordinatesEqual from "./coordinatesEqual";

const MANEUVERS = {
  ARRIVE: "arrive",
  ARRIVE_LEFT: "arrive",
  ARRIVE_RIGHT: "arrive",
  ARRIVING: "continue",
  DEPART: "depart",
  STRAIGHT: "continue",
  KEEP_RIGHT: "right",
  BEAR_RIGHT: "bear right",
  TURN_RIGHT: "turn right",
  SHARP_RIGHT: "sharp right",
  KEEP_LEFT: "left",
  BEAR_LEFT: "bear left",
  TURN_LEFT: "turn left",
  SHARP_LEFT: "sharp left",
  MAKE_UTURN: "u-turn",
  ENTER_MOTORWAY: "continue",
  ENTER_FREEWAY: "continue",
  ENTER_HIGHWAY: "continue",
  TAKE_EXIT: "continue",
  AHEAD_EXIT_LEFT: "continue",
  AHEAD_EXIT_RIGHT: "continue",
  MOTORWAY_EXIT_LEFT: "bear left",
  MOTORWAY_EXIT_RIGHT: "bear right",
  TAKE_FERRY: "continue",
  TAKE_ELEVATOR: "continue",
  ROUNDABOUT_CROSS: "enter roundabout",
  ROUNDABOUT_RIGHT: "turn right",
  ROUNDABOUT_LEFT: "turn left",
  ROUNDABOUT_BACK: "enter roundabout",
  TRY_MAKE_UTURN: "u-turn",
  FOLLOW: "continue",
  SWITCH_PARALLEL_ROAD: "continue",
  SWITCH_MAIN_ROAD: "continue",
  ENTRANCE_RAMP: "continue",
  WAYPOINT_LEFT: "waypoint",
  WAYPOINT_RIGHT: "waypoint",
  WAYPOINT_REACHED: "waypoint"
};

export default function tomtom2mapbox(route) {
  const { geometry, properties } = route;
  const {
    summary,
    guidance: { instructions }
  } = properties;
  const { lengthInMeters: distance, travelTimeInSeconds: duration } = summary;
  const { coordinates } = route.geometry;
  const origin = coordinates[0];
  const destination = coordinates[coordinates.length - 1];
  const mapbox = { origin, destination, waypoints: [], routes: [] };
  const steps = getSteps(instructions, coordinates);

  mapbox.routes.push({
    distance,
    duration,
    geometry: {
      ...geometry,
      coordinates: turfCleanCoords(route).geometry.coordinates
    },
    steps
  });

  return mapbox;
}

function getSteps(instructions, coordinates) {
  const steps = [];
  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];
    const nextInstruction =
      i < instructions.length - 1 ? instructions[i + 1] : null;

    const {
      routeOffsetInMeters,
      travelTimeInSeconds,
      street: way_name,
      pointIndex,
      maneuver
    } = instruction;

    const coords = coordinates[pointIndex];
    const location = turfPoint(coords);

    if (
      nextInstruction &&
      coordinatesEqual(
        location.geometry.coordinates,
        coordinates[nextInstruction.pointIndex]
      )
    ) {
      continue;
    }

    const distance = nextInstruction
      ? nextInstruction.routeOffsetInMeters - routeOffsetInMeters
      : 0;
    const duration = nextInstruction
      ? nextInstruction.travelTimeInSeconds - travelTimeInSeconds
      : 0;

    const heading = nextInstruction
      ? turfBearing(
          location,
          turfPoint(pointToCoordsArray(nextInstruction.point))
        )
      : 0;

    const step = {
      maneuver: {
        type: MANEUVERS[maneuver] || MANEUVERS.STRAIGHT,
        location: location.geometry
      },
      distance,
      duration,
      way_name,
      heading,
      mode: "driving"
    };
    steps.push(step);
  }
  return steps;
}

function pointToCoordsArray(point) {
  const lat = point.lat || point.latitude;
  const lng = point.lng || point.longitude;

  return [lng, lat];
}
