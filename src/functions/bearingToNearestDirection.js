import strings from "../config/strings";

export default function bearingToNearestDirection(bearing) {
  const directions = [
    strings.north,
    strings.northEast,
    strings.east,
    strings.southEast,
    strings.south,
    strings.southWest,
    strings.west,
    strings.northWest
  ];

  const normalizedBearing = (bearing + 360) % 360;

  const index = Math.floor((normalizedBearing + 22.5) / 45) % 8;

  return directions[index] || strings.unknown;
}
