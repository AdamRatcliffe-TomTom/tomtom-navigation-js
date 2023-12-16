import CheapRuler from "cheap-ruler";
import SectionTypes from "../constants/SectionTypes";

const triggerDistanceMeters = 750;

export default function calculateLaneGuidanceTriggerPoints(geojson) {
  const route = geojson.features[0];
  const {
    geometry: { coordinates },
    properties: { sections }
  } = route;
  const ruler = new CheapRuler(coordinates[0][1], "meters");
  const lanesSections = sections.filter(
    ({ sectionType }) => sectionType === SectionTypes.LANES
  );

  lanesSections.forEach((section, index) => {
    const { startPointIndex, endPointIndex } = section;
    const previousSection = index > 0 ? lanesSections[index - 1] : null;
    const firstPoint = coordinates[0];
    const sectionEndPoint = coordinates[endPointIndex];
    const part = ruler.lineSlice(firstPoint, sectionEndPoint, coordinates);
    const alongPoint = ruler.along(part.reverse(), triggerDistanceMeters);

    if (alongPoint) {
      const { index: triggerPointIndex } = ruler.pointOnLine(
        coordinates,
        alongPoint
      );
      section.triggerPointIndex = Math.max(
        Math.min(triggerPointIndex, startPointIndex),
        previousSection?.endPointIndex + 1 || 0
      );
    } else {
      section.triggerPointIndex = startPointIndex;
    }
  });
}
