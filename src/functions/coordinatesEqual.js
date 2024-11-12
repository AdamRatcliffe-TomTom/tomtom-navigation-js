export default function coordinatesEqual(coord1, coord2) {
  if (
    !Array.isArray(coord1) ||
    !Array.isArray(coord2) ||
    coord1.length === 0 ||
    coord2.length === 0 ||
    coord1.length !== 2 ||
    coord2.length !== 2
  ) {
    return false;
  }

  return coord1[0] === coord2[0] && coord1[1] === coord2[1];
}
