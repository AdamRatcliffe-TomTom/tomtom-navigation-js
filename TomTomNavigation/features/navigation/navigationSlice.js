import { createSlice, createSelector } from "@reduxjs/toolkit";
import CheapRuler from "cheap-ruler";
import speedLimitByIndex from "../../functions/speedLimitByIndex";

const initialState = {
  showNavigationPanel: true,
  isNavigating: false,
  navigationModeTransitioning: false,
  currentLocation: {
    pointIndex: undefined,
    point: undefined,
    speedLimit: undefined
  },
  distanceRemaining: undefined
};

let ruler;

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
      const { location, route } = action.payload;
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
      const speedLimit = speedLimitByIndex(route.features[0], pointIndex);

      state.currentLocation = {
        pointIndex,
        point,
        speedLimit
      };
      state.distanceRemaining = distanceRemaining;
    },
    clearCurrentLocation: (state) => {
      state.currentLocation = initialState.currentLocation;
      ruler = undefined;
    },
    setDistanceRemaining: (state, action) => {
      state.distanceRemaining = action.payload;
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

export {
  getShowNavigationPanel,
  getIsNavigating,
  getNavigationModeTransitioning,
  getCurrentLocation,
  getDistanceRemaining
};

export const {
  setShowNavigationPanel,
  setIsNavigating,
  setNavigationModeTransitioning,
  setCurrentLocation,
  setDistanceRemaining,
  clearCurrentLocation
} = navigationSlice.actions;

export default navigationSlice.reducer;
