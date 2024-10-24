import tt from "@tomtom-international/web-sdk-services";

export default async function countryCodeFromRoute(apiKey, route) {
  if (!route) return "GB";

  const firstCoordinate = route.features[0].geometry.coordinates[0];

  const response = await tt.services.reverseGeocode({
    key: apiKey,
    position: firstCoordinate
  });

  return response.addresses[0].address.countryCode;
}
