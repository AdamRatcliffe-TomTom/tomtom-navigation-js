import tt from "@tomtom-international/web-sdk-services";
import { createApi } from "@reduxjs/toolkit/query/react";

const routeBaseQuery = async (args) => {
  try {
    const response = await tt.services.calculateRoute(args);
    const data = response.toGeoJson();
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
