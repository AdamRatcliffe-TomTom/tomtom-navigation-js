import CheapRuler from "cheap-ruler";
import { newToOldManeuverMapping } from "../constants/Maneuvers";

const announcementTriggerDistances = {
  earlyWarningAnnouncement: {
    motorway: 3000,
    urban: 1000
  },
  mainAnnouncement: {
    motorway: 1000,
    urban: 400
  },
  confirmationAnnouncement: {
    motorway: 150,
    urban: 35
  }
};

export default function translateInstructions(geojson) {
  const route = geojson.features[0];
  const {
    geometry: { coordinates },
    properties: {
      guidance: { instructions }
    }
  } = route;
  const firstPoint = coordinates[0];
  const ruler = new CheapRuler(firstPoint[1], "meters");

  const lastInstructionIndex = instructions.length - 1;

  instructions.forEach((instruction, index) => {
    const {
      maneuver,
      maneuverPoint,
      routePath: [{ travelTimeInSeconds }],
      previousRoadInfo: { properties: previousRoadInfoProperties },
      nextRoadInfo: { streetName, roadShields } = {},
      signpost: { exitNumber, exitName, towardName } = {}
    } = instruction;
    const mappedManeuver = newToOldManeuverMapping[maneuver] || maneuver;
    const pointArray = [maneuverPoint.longitude, maneuverPoint.latitude];
    const part = ruler.lineSlice(firstPoint, pointArray, coordinates);

    Object.keys(announcementTriggerDistances).forEach((announcementType) => {
      if (
        index === 0 &&
        (announcementType === "earlyWarningAnnouncement" ||
          announcementType === "mainAnnouncement")
      ) {
        return;
      }

      const announcementDistance = previousRoadInfoProperties.includes(
        "MOTORWAY"
      )
        ? announcementTriggerDistances[announcementType].motorway
        : announcementTriggerDistances[announcementType].urban;

      const announcementTriggerPoint = ruler.along(
        part.reverse(),
        announcementDistance
      );

      if (announcementTriggerPoint) {
        const { point: triggerPoint, index: triggerPointIndex } =
          ruler.pointOnLine(coordinates, announcementTriggerPoint);

        if (
          triggerPointIndex <=
          instructions[index - 1]?.confirmationAnnouncement?.pointIndex
        ) {
          return;
        }

        const distanceInMeters = ruler.lineDistance(
          ruler.lineSlice(triggerPoint, pointArray, coordinates)
        );

        instruction[announcementType] = {
          maneuver: mappedManeuver,
          point: triggerPoint,
          pointIndex: triggerPointIndex,
          distanceInMeters
        };
      }
    });

    Object.assign(instruction, {
      maneuver: mappedManeuver,
      point: maneuverPoint,
      pointIndex:
        index === 0
          ? 0
          : index === lastInstructionIndex
          ? coordinates.length - 1
          : coordinates.findIndex(
              (coord) =>
                coord[1] === maneuverPoint.latitude &&
                coord[0] === maneuverPoint.longitude
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

    if (instruction.pointIndex === -1) {
      instruction.pointIndex = ruler.pointOnLine(coordinates, [
        maneuverPoint.longitude,
        maneuverPoint.latitude
      ])?.index;
    }

    delete instruction.routePath;
    delete instruction.previousRoadInfo;
    delete instruction.nextRoadInfo;
    delete instruction.signpost;
    delete instruction.maneuverPoint;
  });
}
