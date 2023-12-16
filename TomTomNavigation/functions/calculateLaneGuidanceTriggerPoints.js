import CheapRuler from "cheap-ruler";
import SectionTypes from "../constants/SectionTypes";

const triggerDistanceMeters = 500;

export default function calculateLaneGuidanceTriggerPoints(geojson) {
  const route = geojson.features[0];
  const {
    geometry: { coordinates },
    properties: {
      sections,
      guidance: { instructions }
    }
  } = route;
  const ruler = new CheapRuler(coordinates[0][1], "meters");
  const lanesSections = sections.filter(
    ({ sectionType }) => sectionType === SectionTypes.LANES
  );

  lanesSections.forEach((section) => {
    const { startPointIndex, endPointIndex } = section;
    const instruction = instructions
      .toReversed()
      .find((instruction) => instruction.pointIndex < startPointIndex);
    const firstPoint = coordinates[0];
    const sectionEndPoint = coordinates[endPointIndex];
    const part = ruler.lineSlice(firstPoint, sectionEndPoint, coordinates);

    // Look back for a candidate trigger point
    const alongPoint = ruler.along(part.reverse(), triggerDistanceMeters);

    if (alongPoint) {
      // If a point was found get it's index into the route coordinates
      const { index: triggerPointIndex } = ruler.pointOnLine(
        coordinates,
        alongPoint
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
  });
}
