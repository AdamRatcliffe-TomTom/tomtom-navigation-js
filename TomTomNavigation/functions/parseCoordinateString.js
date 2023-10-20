export default function parseCoordinateString(
  coordString,
  returnFirst = false
) {
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
      coordinates.push([longitude, latitude]);
    }
  }

  if (coordinates.length > 0) {
    if (coordinates.length === 1 || returnFirst) {
      return coordinates[0];
    } else {
      return coordinates;
    }
  } else {
    return undefined;
  }
}
