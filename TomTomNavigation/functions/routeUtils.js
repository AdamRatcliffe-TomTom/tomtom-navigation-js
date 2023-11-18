import Maneuvers from "../constants/Maneuvers";
import AnnouncementTypes from "../constants/AnnouncementTypes";
import formatDistance from "./formatDistance";
import expandUnits from "./expandUnits";
import strings from "../config/strings";

function lastInstruction(route) {
  const { instructions } = route.properties.guidance;
  return instructions.at(-1);
}

function instructionByIndex(route, index) {
  const { instructions } = route.properties.guidance;

  const instruction = instructions.find(
    (instruction) => instruction.pointIndex >= index
  );
  return instruction || instructions[instructions.length - 1];
}

function speedLimitByIndex(route, index) {
  const { sections } = route.properties;
  const enclosingSection = sections.find(
    (section) =>
      section.sectionType === "SPEED_LIMIT" &&
      index >= section.startPointIndex &&
      index < section.endPointIndex
  );
  if (enclosingSection) {
    return enclosingSection.maxSpeedLimitInKmh;
  }
  return undefined;
}

function announcementByIndex(route, index, measurementSystem) {
  const { instructions } = route.properties.guidance;

  for (const instruction of instructions) {
    const {
      street,
      earlyWarningAnnouncement,
      mainAnnouncement,
      confirmationAnnouncement
    } = instruction;

    const announcementTypes = [
      AnnouncementTypes.EARLY_WARNING,
      AnnouncementTypes.MAIN,
      AnnouncementTypes.CONFIRMATION
    ];

    for (const announcementType of announcementTypes) {
      const announcement =
        announcementType === AnnouncementTypes.EARLY_WARNING
          ? earlyWarningAnnouncement
          : announcementType === AnnouncementTypes.MAIN
          ? mainAnnouncement
          : confirmationAnnouncement;

      if (announcement && announcement.pointIndex === index) {
        const announcementText = getAnnouncementText(
          announcementType,
          announcement,
          street,
          measurementSystem
        );
        return { text: announcementText, type: announcementType };
      }
    }
  }

  return null;
}

function getAnnouncementText(
  type,
  { maneuver, distanceInMeters },
  street,
  measurementSystem = "metric"
) {
  if (
    type === AnnouncementTypes.MAIN &&
    [Maneuvers.ARRIVE, Maneuvers.ARRIVE_LEFT, Maneuvers.ARRIVE_RIGHT].includes(
      maneuver
    )
  ) {
    maneuver = "ARRIVING";
  }

  const maneuverText = strings[maneuver];
  const includeDistance =
    distanceInMeters > 0 &&
    maneuver !== Maneuvers.STRAIGHT &&
    maneuver !== Maneuvers.ARRIVE &&
    maneuver !== Maneuvers.ARRIVE_LEFT &&
    maneuver !== Maneuvers.ARRIVE_RIGHT;

  if (includeDistance) {
    const announcementTemplate = street
      ? strings.guidanceAnnouncementOntoStreet
      : strings.guidanceAnnouncement;

    const { value: distance, units } = formatDistance(
      distanceInMeters,
      measurementSystem
    );

    return strings.formatString(announcementTemplate, {
      maneuverText,
      distance,
      units: expandUnits(distance, units),
      street
    });
  } else {
    return maneuverText;
  }
}

export {
  lastInstruction,
  instructionByIndex,
  speedLimitByIndex,
  announcementByIndex
};
