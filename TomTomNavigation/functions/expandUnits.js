export default function expandUnits(value, units) {
  switch (units) {
    case "km":
      return value === 1 ? "kilometer" : "kilometers";
    case "m":
      return value === 1 ? "meter" : "meters";
    case "mi":
      return value === 1 ? "mile" : "miles";
    case "ft":
      return value === 1 ? "foot" : "feet";
    default:
      return units;
  }
}
