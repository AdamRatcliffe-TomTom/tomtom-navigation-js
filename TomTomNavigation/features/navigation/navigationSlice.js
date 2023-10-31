import { createSlice, createSelector } from "@reduxjs/toolkit";
import CheapRuler from "cheap-ruler";

const initialState = {
  showNavigationPanel: true,
  isNavigating: false,
  navigationModeTransitioning: false,
  currentLocation: {
    pointIndex: undefined,
    point: undefined,
    speedLimit: undefined
  },
  distanceRemaining: undefined,
  timeRemaining: undefined,
  eta: undefined
};

let ruler;

function speedLimitByIndex(route, index) {
  const { sections } = route.properties;
  const enclosingSection = sections.find(
    (section) =>
      section.sectionType === "SPEED_LIMIT" &&
      index >= section.startPointIndex &&
      index < section.endPointIndex
  );
  if (enclosingSection) {
    return enclosingSection.maxSpeedLimitInKmh;
  }
  return undefined;
}

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setShowNavigationPanel: (state, action) => {
      state.showNavigationPanel = action.payload;
    },
    setIsNavigating: (state, action) => {
      state.isNavigating = action.payload;
    },
    setNavigationModeTransitioning: (state, action) => {
      state.navigationModeTransitioning = action.payload;
    },
    setCurrentLocation: (state, action) => {
      const { location, elapsedTime, route } = action.payload;
      const { travelTimeInSeconds } = route.features[0].properties.summary;
      const { coordinates } = route.features[0].geometry;

      if (!ruler) {
        ruler = new CheapRuler(coordinates[0][1], "meters");
      }

      const { point, index: pointIndex } = ruler.pointOnLine(
        coordinates,
        location
      );
      const part = ruler.lineSlice(
        point,
        coordinates[coordinates.length - 1],
        coordinates
      );
      const distanceRemaining = ruler.lineDistance(part);
      const timeRemaining = travelTimeInSeconds - elapsedTime;
      const speedLimit = speedLimitByIndex(route.features[0], pointIndex);

      state.currentLocation = {
        pointIndex,
        point,
        speedLimit
      };
      state.distanceRemaining = distanceRemaining;
      state.timeRemaining = timeRemaining;
    },
    clearCurrentLocation: (state) => {
      state.currentLocation = initialState.currentLocation;
      ruler = undefined;
    },
    setDistanceRemaining: (state, action) => {
      state.distanceRemaining = action.payload;
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    setEta: (state, action) => {
      state.eta = action.payload;
    }
  }
});

const rootSelector = (state) => state.navigation;

const getShowNavigationPanel = createSelector(
  rootSelector,
  (state) => state.showNavigationPanel
);

const getIsNavigating = createSelector(
  rootSelector,
  (state) => state.isNavigating
);

const getNavigationModeTransitioning = createSelector(
  rootSelector,
  (state) => state.navigationModeTransitioning
);

const getCurrentLocation = createSelector(
  rootSelector,
  (state) => state.currentLocation
);

const getDistanceRemaining = createSelector(
  rootSelector,
  (state) => state.distanceRemaining
);

const getTimeRemaining = createSelector(
  rootSelector,
  (state) => state.timeRemaining
);

const getEta = createSelector(rootSelector, (state) => state.eta);

export {
  getShowNavigationPanel,
  getIsNavigating,
  getNavigationModeTransitioning,
  getCurrentLocation,
  getDistanceRemaining,
  getTimeRemaining,
  getEta
};

export const {
  setShowNavigationPanel,
  setIsNavigating,
  setNavigationModeTransitioning,
  setCurrentLocation,
  setDistanceRemaining,
  setTimeRemaining,
  setEta,
  clearCurrentLocation
} = navigationSlice.actions;

export default navigationSlice.reducer;
