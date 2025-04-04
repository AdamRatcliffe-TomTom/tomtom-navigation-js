import roundUp from "./roundUp";
import metersToMiles from "./metersToMiles";

const numberFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1
});

export default function formatDistance(
  meters,
  measurementSystem = "metric",
  useFriendlyImperial = false,
  shouldRound = false
) {
  if (measurementSystem === "metric") {
    const roundedMeters = roundUp(meters, meters < 100 ? 10 : 100);
    const valueInKm = metersToKilometers(roundedMeters);

    return Math.abs(roundedMeters) < 1000
      ? { value: shouldRound ? roundedMeters : Math.round(meters), units: "m" }
      : {
          value: numberFormat.format(
            shouldRound ? valueInKm : metersToKilometers(meters)
          ),
          units: "km"
        };
  } else if (measurementSystem === "imperial") {
    const feet = metersToFeet(meters);
    const miles = metersToMiles(meters);

    return meters < 305
      ? {
          value: shouldRound ? roundUp(feet, feet < 100 ? 10 : 100) : Math.round(feet),
          units: "ft"
        }
      : {
          value: useFriendlyImperial
            ? convertToImperialRounded(meters)
            : numberFormat.format(shouldRound ? miles : metersToMiles(meters)),
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

function convertToImperialRounded(distanceInMeters) {
  const metersInMile = 1609.34;
  const roundingInterval = 0.25;

  const distanceInMiles = distanceInMeters / metersInMile;
  const roundedDistance =
    Math.round(distanceInMiles / roundingInterval) * roundingInterval;

  const milesInt = Math.floor(roundedDistance);
  const milesFraction = roundedDistance - milesInt;

  let result = "";
  if (milesInt > 0) {
    result += milesInt === 1 ? "one" : milesInt + "";
  }

  if (milesFraction > 0) {
    if (result !== "") {
      result += " and ";
    }
    const fractionString =
      milesFraction === 0.25
        ? "1/4"
        : milesFraction === 0.5
        ? "1/2"
        : "3/4 of a";
    result += fractionString;
  }

  if (result === "") {
    result = "less than a quarter";
  }

  return result;
}
