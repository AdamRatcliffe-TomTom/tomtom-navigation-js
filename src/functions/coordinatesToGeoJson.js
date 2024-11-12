import tt from "@tomtom-international/web-sdk-maps";
import { feature, featureCollection } from "@turf/helpers";

export default function coordinatesToGeoJson(coordinates) {
  if (!coordinates) {
    return null;
  }

  const normalizedCoordinates = coordinates.map((c) =>
    tt.LngLat.convert(c).toArray()
  );

  return featureCollection(
    normalizedCoordinates.map((coordinates) =>
      feature({ type: "Point", coordinates })
    )
  );
}
