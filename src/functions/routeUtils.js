import Maneuvers from "../constants/Maneuvers";
import AnnouncementTypes from "../constants/AnnouncementTypes";
import formatDistance from "./formatDistance";
import expandUnits from "./expandUnits";
import expandStreetName from "./expandStreetName";
import expandDirectionAbbreviation from "./expandDirectionAbbreviation";
import strings from "../config/strings";
import SectionTypes from "../constants/SectionTypes";

function getFirstInstruction(route) {
  const { instructions } = route.properties.guidance;
  return instructions[0];
}

function getLastInstruction(route) {
  const { instructions } = route.properties.guidance;
  return instructions.at(-1);
}

function instructionByIndex(route, index) {
  const { instructions } = route.properties.guidance;

  const instruction = instructions.find(
    (instruction) => instruction.pointIndex > index
  );
  return instruction || instructions[instructions.length - 1];
}

function speedLimitByIndex(route, index) {
  const { sections } = route.properties;
  const enclosingSection = sections.find(
    (section) =>
      section.sectionType === SectionTypes.SPEED_LIMIT &&
      index >= section.startPointIndex &&
      index < section.endPointIndex
  );
  if (enclosingSection) {
    return enclosingSection.maxSpeedLimitInKmh;
  }
  return undefined;
}

function announcementByIndex(
  route,
  index,
  measurementSystem,
  language,
  useMessageProp
) {
  const { instructions } = route.properties.guidance;

  for (const instruction of instructions) {
    const {
      street,
      earlyWarningAnnouncement,
      mainAnnouncement,
      confirmationAnnouncement,
      message
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
        const announcementText = useMessageProp
          ? message
          : getAnnouncementText(
              announcement,
              street,
              measurementSystem,
              language
            );
        return {
          type: announcementType,
          text: announcementText,
          priority: announcement.priority || false
        };
      }
    }
  }

  return null;
}

function getAnnouncementText(
  { maneuver, distanceInMeters },
  street,
  measurementSystem = "metric",
  language
) {
  // Announcement points for the ARRIVE maneuver variants are typically provided before the destination
  // is reached. Replace the maneuver type with the ARRIVING maneuver so an appropriate
  // announcement is used
  if (
    [Maneuvers.ARRIVE, Maneuvers.ARRIVE_LEFT, Maneuvers.ARRIVE_RIGHT].includes(
      maneuver
    )
  ) {
    maneuver = Maneuvers.ARRIVING;
  }

  const maneuverText = strings[maneuver];
  const includeDistance =
    distanceInMeters > 0 &&
    ![Maneuvers.STRAIGHT, Maneuvers.WAYPOINT_REACHED].includes(maneuver);

  if (includeDistance) {
    const announcementTemplate = street
      ? strings.guidanceAnnouncementOntoStreetTemplate
      : strings.guidanceAnnouncementTemplate;

    const { value: distance, units } = formatDistance(
      distanceInMeters,
      measurementSystem,
      true,
      true
    );

    return strings.formatString(announcementTemplate, {
      maneuverText,
      distance,
      units: expandUnits(distance, units, language),
      street: street
        ? expandStreetName(expandDirectionAbbreviation(street), language)
        : null
    });
  } else {
    return maneuverText;
  }
}

function laneGuidanceByIndex(route, index) {
  const { sections } = route.properties;
  return sections.find(
    ({ sectionType, triggerPointIndex, endPointIndex }) =>
      sectionType === SectionTypes.LANES &&
      index >= triggerPointIndex &&
      index <= endPointIndex
  );
}

function trafficEventsByIndex(route, index) {
  const { sections } = route.properties;
  return sections.filter(
    ({ sectionType, triggerPointIndex, startPointIndex }) =>
      sectionType === SectionTypes.TRAFFIC &&
      index >= triggerPointIndex &&
      index < startPointIndex
  );
}

export {
  getFirstInstruction,
  getLastInstruction,
  instructionByIndex,
  speedLimitByIndex,
  announcementByIndex,
  laneGuidanceByIndex,
  trafficEventsByIndex
};
