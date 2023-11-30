import { featureCollection, feature } from "@turf/helpers";

export default function routeToGeoJson(route, properties) {
  const { summary, sections, guidance, legs } = route;
  const coordinates = legs
    .map((leg) => {
      const { points } = leg;
      return points.map((point) => [point.longitude, point.latitude]);
    })
    .flat();

  return featureCollection([
    feature(
      {
        type: "LineString",
        coordinates
      },
      {
        summary,
        legs,
        sections: processSections(sections),
        guidance,
        ...properties
      }
    )
  ]);
}

function processSections(sections) {
  return sections.map((section) => {
    if (section.sectionType === "LANES") {
      return {
        ...section,
        startPointIndex: Math.max(section.startPointIndex - 3, 0)
      };
    }
    return section;
  });
}
