export default function expandAffix(affix) {
  switch (affix) {
    case "N":
      return "North";
    case "E":
      return "East";
    case "W":
      return "West";
    case "S":
      return "South";
    default:
      return affix;
  }
}
