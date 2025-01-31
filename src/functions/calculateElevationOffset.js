export default function calculateElevationOffset(
  elevationInMeters,
  latitude,
  zoom
) {
  const EARTH_CIRCUMFERENCE = 40075017; // in meters

  // 1) Calculate "meters per pixel" at the equator for the given zoom.
  //    - If your map uses 256x256 tiles at zoom=0, use (zoom + 8).
  //    - If it uses 512x512 tiles at zoom=0, use (zoom + 9).
  //      (Mapbox styles typically default to 512-tile sizes these days.)
  const metersPerPixelAtEquator = EARTH_CIRCUMFERENCE / Math.pow(2, zoom + 8);

  // 2) Adjust for latitude for Web Mercator.
  //    - The standard ground-resolution formula is:
  //         resolution(lat) = resolution(0) / cos(lat)
  //      meaning that at higher latitudes, 1 pixel = more meters.
  const metersPerPixelAtLat =
    metersPerPixelAtEquator / Math.cos((latitude * Math.PI) / 180);

  // 3) Convert an elevation in meters to how many pixels it should shift on screen:
  //    - # of pixels = (distance in meters) / (meters per pixel).
  const elevationOffset = elevationInMeters / metersPerPixelAtLat;

  return elevationOffset;
}
