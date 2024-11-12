import { createApi } from "@reduxjs/toolkit/query/react";
import objectToQueryString from "../functions/objectToQueryString";
import routeToGeoJson from "../functions/routeToGeoJson";
import createSectionedRoute from "../functions/createSectionedRoute";
import createWalkingLeg from "../functions/createWalkingLeg";
import createManeuverLineStrings from "../functions/createManeuverLineStrings";
import calculateTriggerPoints from "../functions/calculateTriggerPoints";
import translateInstructions from "../functions/translateInstructions";

import { BASE_ROUTING_URL } from "../config";

const defaultOptions = {
  apiVersion: 2
};

const calculateRoute = async (options) => {
  const { key, locations, supportingPoints, ...otherOptions } = options;
  const params = objectToQueryString({
    ...defaultOptions,
    ...otherOptions,
    key
  });
  const url = `${BASE_ROUTING_URL}/${locations
    .map(locationToString)
    .join(":")}/json?${params}`;

  let fetchOptions;
  if (supportingPoints) {
    fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(lngLatsToSupportingPoints(supportingPoints))
    };
  }

  const response = await fetch(url, fetchOptions);
  const { roadShieldAtlasReference, routes } = await response.json();
  return routeToGeoJson(routes[0], { roadShieldAtlasReference });
};

const lngLatsToSupportingPoints = (coords) => {
  const supportingPoints = coords.map((coord) => ({
    longitude: coord.lng,
    latitude: coord.lat
  }));
  return { supportingPoints };
};

const locationToString = ({ coordinates }) =>
  `${coordinates[1]},${coordinates[0]}`;

const routeBaseQuery = async (args) => {
  try {
    const { automaticRouteCalculation, preCalculatedRoute, ...otherArgs } =
      args;

    if (preCalculatedRoute) {
      const sectionedRoute = createSectionedRoute(preCalculatedRoute);
      const maneuverLineStrings = createManeuverLineStrings(preCalculatedRoute);

      calculateTriggerPoints(preCalculatedRoute);

      return {
        data: {
          route: preCalculatedRoute,
          sectionedRoute,
          maneuverLineStrings
        }
      };
    }

    // Workaround for resetApiState not resetting the data in the useQuery hook:
    // https://github.com/reduxjs/redux-toolkit/issues/3778
    if (!automaticRouteCalculation || args.locations?.length < 2)
      return { data: { route: null } };

    const route = await calculateRoute(otherArgs);

    translateInstructions(route);
    calculateTriggerPoints(route);

    const sectionedRoute = createSectionedRoute(route);
    const walkingLeg = createWalkingLeg(args.locations, route);
    const maneuverLineStrings = createManeuverLineStrings(route);

    return { data: { route, sectionedRoute, walkingLeg, maneuverLineStrings } };
  } catch (error) {
    console.error(error);

    return { error: { status: 500, data: "Route calculation failed" } };
  }
};

export const routingApi = createApi({
  reducerPath: "routeApi",
  baseQuery: routeBaseQuery,
  endpoints: (builder) => ({
    calculateRoute: builder.query({
      query: (args) => args
    })
  })
});

export const { useCalculateRouteQuery } = routingApi;
