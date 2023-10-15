import { createApi } from "@reduxjs/toolkit/query/react";
import objectToQueryString from "../functions/objectToQueryString";
import routeToGeoJson from "../functions/routeToGeoJson";

import { BASE_ROUTING_URL } from "../config/config";

const calculateRoute = async (options) => {
  const { key, locations, supportingPoints, ...otherOptions } = options;
  const params = objectToQueryString({ key, ...otherOptions });
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

const locationToString = (coordinate) => `${coordinate.lat},${coordinate.lng}`;

const routeBaseQuery = async (args) => {
  try {
    // work around for resetApiState not resetting the data in the useQuery hook
    if (args.locations.length < 2) return { data: null };

    const data = await calculateRoute(args);
    return { data };
  } catch (error) {
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
