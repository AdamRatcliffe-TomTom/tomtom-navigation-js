import CheapRuler from "cheap-ruler";
import SectionTypes from "../constants/SectionTypes";

import {
  LANE_GUIDANCE_TRIGGER_DISTANCE_METERS,
  TRAFFIC_EVENT_TRIGGER_DISTANCE_METERS
} from "../config";

export default function calculateTriggerPoints(geojson) {
  const route = geojson.features[0];
  const {
    geometry: { coordinates },
    properties: {
      sections,
      guidance: { instructions }
    }
  } = route;
  const ruler = new CheapRuler(coordinates[0][1], "meters");

  sections
    .filter(
      ({ sectionType }) =>
        sectionType === SectionTypes.LANES ||
        sectionType === SectionTypes.TRAFFIC
    )
    .forEach((section) => {
      const { sectionType, startPointIndex } = section;
      const firstPoint = coordinates[0];
      const sectionStartPoint = coordinates[startPointIndex];
      const part = ruler.lineSlice(firstPoint, sectionStartPoint, coordinates);

      switch (sectionType) {
        case SectionTypes.LANES: {
          const instruction = instructions
            .toReversed()
            .find((instruction) => instruction.pointIndex < startPointIndex);

          // Look back for a candidate trigger point
          const triggerPoint = ruler.along(
            part.reverse(),
            LANE_GUIDANCE_TRIGGER_DISTANCE_METERS
          );

          if (triggerPoint) {
            // If a point was found get it's index into the route coordinates
            const { index: triggerPointIndex } = ruler.pointOnLine(
              coordinates,
              triggerPoint
            );

            // Use the candidate point, or the point at the start of the lane configuration,
            // whichever is smaller but the selected point should not be less than the point of
            // the previous maeneuver
            section.triggerPointIndex = Math.max(
              Math.min(triggerPointIndex, startPointIndex),
              instruction?.pointIndex || 0
            );
          } else {
            section.triggerPointIndex = startPointIndex;
          }
          break;
        }
        case SectionTypes.TRAFFIC: {
          const triggerPoint = ruler.along(
            part.reverse(),
            TRAFFIC_EVENT_TRIGGER_DISTANCE_METERS
          );

          if (triggerPoint) {
            const { index: triggerPointIndex } = ruler.pointOnLine(
              coordinates,
              triggerPoint
            );
            section.triggerPointIndex = triggerPointIndex;
          } else {
            section.triggerPointIndex = 0;
          }
          break;
        }
        default:
        // do nothing
      }
    });
}
