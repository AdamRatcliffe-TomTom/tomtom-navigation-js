import roundUp from "./roundUp";
import metersToMiles from "./metersToMiles";

const numberFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1
});

export default function formatDistance(meters, measurementSystem = "metric") {
  if (measurementSystem === "metric") {
    return Math.abs(meters) < 1000
      ? { value: roundUp(meters, meters < 100 ? 10 : 100), units: "m" }
      : {
          value: numberFormat.format(metersToKilometers(meters)),
          units: "km"
        };
  } else if (measurementSystem === "imperial") {
    return meters < 160
      ? {
          value: roundUp(
            metersToFeet(meters),
            metersToFeet(meters) < 100 ? 10 : 100
          ),
          units: "ft"
        }
      : {
          value: numberFormat.format(metersToMiles(meters)),
          units: "mi"
        };
  } else {
    return { value: meters };
  }
}

function metersToKilometers(meters) {
  return meters / 1000;
}

function metersToFeet(meters) {
  return meters * 3.28084;
}
