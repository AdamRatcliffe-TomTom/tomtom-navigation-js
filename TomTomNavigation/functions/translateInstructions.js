import { newToOldManeuverMapping } from "../constants/Maneuvers";

export default function translateInstructions(geojson) {
  const route = geojson.features[0];
  const {
    geometry: { coordinates },
    properties: {
      guidance: { instructions }
    }
  } = route;

  const lastInstructionIndex = instructions.length - 1;

  instructions.forEach((instruction, index) => {
    const {
      maneuver,
      routePath: [{ point, travelTimeInSeconds }],
      nextRoadInfo: { streetName, roadShields } = {},
      signpost: { exitNumber, exitName, towardName } = {}
    } = instruction;
    Object.assign(instruction, {
      maneuver: newToOldManeuverMapping[maneuver] || maneuver,
      point,
      pointIndex:
        index === 0
          ? 0
          : index === lastInstructionIndex
          ? coordinates.length - 1
          : coordinates.findIndex(
              (coord) =>
                coord[1] === point.latitude && coord[0] === point.longitude
            ),
      travelTimeInSeconds,
      street: streetName?.text,
      exitNumber: exitNumber?.text,
      signpostText: towardName?.text || exitName?.text,
      ...(roadShields && {
        roadShieldReferences: roadShields.map(
          (roadShield) => roadShield.iconReference
        )
      })
    });
    delete instruction.routePath;
    delete instruction.previousRoadInfo;
    delete instruction.nextRoadInfo;
    delete instruction.signpost;
    delete instruction.maneuverPoint;
  });
}
