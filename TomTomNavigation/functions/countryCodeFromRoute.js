export default function countryCodeFromRoute(route) {
  if (!route) return "GB";

  const guidance = route.features[0].properties.guidance;
  const firstInstruction = guidance.instructions[0];
  return firstInstruction.countryCode === "USA"
    ? "US"
    : firstInstruction.countryCode;
}
