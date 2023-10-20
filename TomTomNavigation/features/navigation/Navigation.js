import React from "react";
import { useSelector } from "react-redux";
import { useAppContext } from "../../app/AppContext";
import NavigationPanel from "./NavigationPanel";
import Simulator from "./Simulator";

import {
  getShowNavigationPanel,
  getNavigationRoute,
  getIsNavigating,
  getNavigationModeTransitioning
} from "../navigation/navigationSlice";

const Navigation = () => {
  const { simulationSpeed } = useAppContext();
  const showNavigationPanel = useSelector(getShowNavigationPanel);
  const isNavigating = useSelector(getIsNavigating);
  const navigationModeTransitioning = useSelector(
    getNavigationModeTransitioning
  );
  const navigationRoute = useSelector(getNavigationRoute);

  return (
    <>
      {showNavigationPanel && <NavigationPanel />}
      {navigationRoute && isNavigating && !navigationModeTransitioning && (
        <Simulator
          route={navigationRoute}
          maneuvers={[
            {
              type: ["arrive"],
              buffer: 0.0621371,
              zoom: 16,
              pitch: 40
            },
            {
              type: ["turn left", "turn right"],
              buffer: 0.0621371,
              zoom: 17.5,
              pitch: 40
            },
            {
              type: ["bear right"],
              buffer: 0.0621371,
              zoom: 17.5,
              pitch: 40
            }
          ]}
          spacing="acceldecel"
          speed={simulationSpeed}
        />
      )}
    </>
  );
};

export default Navigation;
