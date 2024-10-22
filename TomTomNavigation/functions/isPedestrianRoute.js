const isPedestrianRoute = (route) =>
  (route?.type === "FeatureCollection" ? route.features[0] : route)?.properties
    .sections[0].travelMode === "pedestrian";

export default isPedestrianRoute;
