import * as tt from "@tomtom-international/web-sdk-maps";

export default function parseCoordinateString(coordString) {
  if (!coordString || !coordString.length) {
    return undefined;
  }

  const coordinatePairs = coordString.split(";");
  const coordinates = [];

  for (const pair of coordinatePairs) {
    const regex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
    const match = pair.match(regex);

    if (match) {
      const latitude = parseFloat(match[1]);
      const longitude = parseFloat(match[3]);
      coordinates.push(new tt.LngLat(longitude, latitude));
    }
  }

  if (coordinates.length === 1) {
    return coordinates[0];
  } else if (coordinates.length > 1) {
    return coordinates;
  } else {
    return undefined;
  }
}
