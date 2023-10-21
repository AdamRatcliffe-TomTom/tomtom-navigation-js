import tt from "@tomtom-international/web-sdk-maps";

export default function expandBoundsByPercentage(bounds, percentage) {
  const southwest = bounds.getSouthWest();
  const northeast = bounds.getNorthEast();

  const lngDiff = (northeast.lng - southwest.lng) * (percentage / 200); // Divide by 2 to get half of the percentage
  const latDiff = (northeast.lat - southwest.lat) * (percentage / 200);

  const newSouthwest = new tt.LngLat(
    southwest.lng - lngDiff,
    southwest.lat - latDiff
  );
  const newNortheast = new tt.LngLat(
    northeast.lng + lngDiff,
    northeast.lat + latDiff
  );

  return new tt.LngLatBounds(newSouthwest, newNortheast);
}
