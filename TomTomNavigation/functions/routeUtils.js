import Maneuvers from "../constants/Maneuvers";
import AnnouncementTypes from "../constants/AnnouncementTypes";
import formatDistance from "./formatDistance";
import expandUnits from "./expandUnits";
import strings from "../config/strings";

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

  const instruction = instructions.find(
    (instruction) => instruction.pointIndex === index
  );

  // If there's an instruction message for this point index use that
  if (instruction) {
    return {
      maneuver: instruction.maneuver,
      text: instruction.message
    };
  }

  // otherwise use any matching announcement
  for (const instruction of instructions) {
    const {
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
          measurementSystem
        );
        return { text: announcementText, type: announcementType };
      }
    }
  }

  return null;
}

function getAnnouncementText(type, announcement, measurementSystem = "metric") {
  let { maneuver, distanceInMeters } = announcement;

  if (
    type === AnnouncementTypes.MAIN &&
    [Maneuvers.ARRIVE, Maneuvers.ARRIVE_LEFT, Maneuvers.ARRIVE_RIGHT].includes(
      maneuver
    )
  ) {
    maneuver = "ARRIVING";
  }

  const text = strings[maneuver];
  const includeDistance =
    distanceInMeters > 0 &&
    maneuver !== Maneuvers.STRAIGHT &&
    maneuver !== Maneuvers.ARRIVE &&
    maneuver !== Maneuvers.ARRIVE_LEFT &&
    maneuver !== Maneuvers.ARRIVE_RIGHT;

  if (includeDistance) {
    const { value, units } = formatDistance(
      distanceInMeters,
      measurementSystem
    );
    return `${text} in ${value} ${expandUnits(value, units)}`;
  } else {
    return text;
  }
}

export { instructionByIndex, speedLimitByIndex, announcementByIndex };
