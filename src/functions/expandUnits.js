export default function expandUnits(value, units, language = "en") {
  switch (units) {
    case "km":
      return value === 1 || language.startsWith("nl")
        ? "kilometer"
        : "kilometers";
    case "m":
      return value === 1 || language.startsWith("nl") ? "meter" : "meters";
    case "mi":
      return value === 1 || typeof value === "string" ? "mile" : "miles";
    case "ft":
      return value === 1 ? "foot" : "feet";
    default:
      return units;
  }
}
