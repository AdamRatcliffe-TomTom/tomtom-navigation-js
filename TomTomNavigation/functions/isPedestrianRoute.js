const isPedestrianRoute = (feature) =>
  feature?.properties.sections[0].travelMode === "pedestrian";

export default isPedestrianRoute;
