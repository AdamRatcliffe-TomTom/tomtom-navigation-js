import SectionTypes from "../constants/SectionTypes";
import { featureCollection, lineString } from "@turf/helpers";

export default function createSectionedRoute(geojson) {
  const route = geojson.features[0];
  const {
    geometry: { coordinates },
    properties: { sections }
  } = route;

  const trafficSections = sections.filter(
    (section) =>
      section.sectionType === SectionTypes.TRAFFIC &&
      [1, 2, 3].includes(section.magnitudeOfDelay)
  );

  let sectionedFeatures = [];

  if (trafficSections.length > 0) {
    let previousEndIndex = 0;

    for (const section of trafficSections) {
      const {
        startPointIndex,
        endPointIndex,
        effectiveSpeedInKmh,
        delayInSeconds,
        magnitudeOfDelay
      } = section;

      if (previousEndIndex < startPointIndex) {
        const beforeTrafficLine = lineString(
          coordinates.slice(previousEndIndex, startPointIndex + 1)
        );
        sectionedFeatures.push(beforeTrafficLine);
      }

      const trafficLine = lineString(
        coordinates.slice(startPointIndex, endPointIndex + 1),
        {
          effectiveSpeedInKmh,
          delayInSeconds,
          magnitudeOfDelay
        }
      );
      sectionedFeatures.push(trafficLine);

      previousEndIndex = endPointIndex;
    }

    if (previousEndIndex < coordinates.length - 1) {
      const afterTrafficLine = lineString(coordinates.slice(previousEndIndex));
      sectionedFeatures.push(afterTrafficLine);
    }
  } else {
    sectionedFeatures.push(lineString(route.geometry));
  }

  const sectionedRoute = featureCollection(sectionedFeatures);

  console.log(JSON.stringify(sectionedRoute));

  return sectionedRoute;
}
