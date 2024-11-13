import { useState, useEffect, useCallback } from "react";
import { useCalculateRouteQuery } from "../../../services/routing";
import tomtom2mapbox from "../../../functions/tomtom2mapbox";

const useNavigationRoute = (
  apiKey,
  routeOptions,
  automaticRouteCalculation,
  preCalculatedRoute,
  setETA
) => {
  const [navigationRoute, setNavigationRoute] = useState(null);

  const { data: { route } = {} } = useCalculateRouteQuery({
    key: apiKey,
    preCalculatedRoute,
    automaticRouteCalculation,
    ...routeOptions
  });

  const processRoute = useCallback((routeFeature) => {
    if (routeFeature) {
      const transformedRoute = tomtom2mapbox(routeFeature);
      setNavigationRoute(transformedRoute);
      setETA(routeFeature);
    }
  }, []);

  useEffect(() => {
    if (route?.features[0]) {
      processRoute(route.features[0]);
    }
  }, [route, processRoute]);

  return { route, navigationRoute };
};

export default useNavigationRoute;
