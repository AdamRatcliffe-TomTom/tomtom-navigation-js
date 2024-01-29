import CheapRuler from "cheap-ruler";
import { featureCollection, lineString } from "@turf/helpers";

const BEFORE_LENGTH_METERS = 30;
const AFTER_LENGTH_METERS = 30;
const MIN_ARROW_GAP_METERS = 50;

export default function createManeuverLineStrings(geojson) {
  const route = geojson.features[0];
  const {
    geometry: { coordinates },
    properties: {
      summary: { lengthInMeters },
      guidance: { instructions }
    }
  } = route;

  const ruler = new CheapRuler(coordinates[0][1], "meters");
  const lines = [];
  let lastStartOffset = 0;
  let lastEndOffset = 0;

  instructions
    .slice(0, instructions.length - 1)
    .forEach((instruction, index) => {
      const { routeOffsetInMeters } = instruction;
      const startOffset = Math.max(
        routeOffsetInMeters - BEFORE_LENGTH_METERS,
        0
      );
      const endOffset = Math.min(
        routeOffsetInMeters + AFTER_LENGTH_METERS,
        lengthInMeters
      );
      const shouldMergeLines =
        index > 0 && startOffset - lastEndOffset < MIN_ARROW_GAP_METERS;

      const part = ruler.lineSliceAlong(
        shouldMergeLines ? lastStartOffset : startOffset,
        endOffset,
        coordinates
      );

      if (part.length > 1) {
        if (shouldMergeLines) {
          lines[lines.length - 1] = lineString(part);
        } else {
          lines.push(lineString(part));
        }

        lastStartOffset = startOffset;
        lastEndOffset = endOffset;
      }
    });

  return featureCollection(lines);
}
