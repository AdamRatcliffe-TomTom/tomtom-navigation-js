import { createSlice, createSelector } from "@reduxjs/toolkit";
import { featureCollection, lineString } from "@turf/helpers";
import {
  speedLimitByIndex,
  announcementByIndex
} from "../../functions/routeUtils";
import CheapRuler from "cheap-ruler";

const initialState = {
  voiceAnnouncementsEnabled: true,
  showNavigationPanel: true,
  isNavigating: false,
  hasReachedDestination: false,
  navigationModeTransitioning: false,
  currentLocation: {
    pointIndex: undefined,
    point: undefined,
    speedLimit: undefined,
    announcement: undefined
  },
  remainingRoute: undefined,
  distanceRemaining: undefined,
  timeRemaining: undefined,
  eta: null
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
      const { location, elapsedTime, route, measurementSystem } =
        action.payload;
      const { travelTimeInSeconds } = route.features[0].properties.summary;
      const { coordinates } = route.features[0].geometry;

      if (!ruler) {
        ruler = new CheapRuler(coordinates[0][1], "meters");
      }

      const { point, index: pointIndex } = ruler.pointOnLine(
        coordinates,
        location
      );
      const remainingPart = ruler.lineSlice(
        point,
        coordinates[coordinates.length - 1],
        coordinates
      );
      const distanceRemaining = ruler.lineDistance(remainingPart);
      const timeRemaining = travelTimeInSeconds - elapsedTime;
      const speedLimit = speedLimitByIndex(route.features[0], pointIndex);

      let announcement;

      if (pointIndex !== state.currentLocation.pointIndex) {
        announcement = announcementByIndex(
          route.features[0],
          pointIndex,
          measurementSystem
        );
      }

      state.currentLocation = {
        pointIndex,
        point,
        speedLimit,
        announcement
      };
      state.remainingRoute = featureCollection([lineString(remainingPart)]);
      state.distanceRemaining = distanceRemaining;
      state.timeRemaining = timeRemaining;
    },
    setDistanceRemaining: (state, action) => {
      state.distanceRemaining = action.payload;
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    setEta: (state, action) => {
      state.eta = action.payload;
    },
    setRemainingRoute: (state, action) => {
      state.remainingRoute = action.payload;
    },
    setHasReachedDestination: (state, action) => {
      state.hasReachedDestination = action.payload;
    },
    setVoiceAnnouncementsEnabled: (state, action) => {
      state.voiceAnnouncementsEnabled = action.payload;
    },
    resetNavigation: (state) => {
      state.isNavigating = false;
      state.hasReachedDestination = false;
      state.currentLocation = initialState.currentLocation;
      state.routeProgress = undefined;
      state.distanceRemaining = undefined;
      state.remainingRoute = undefined;
      ruler = undefined;
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

const getRemainingRoute = createSelector(
  rootSelector,
  (state) => state.remainingRoute
);

const getHasReachedDestination = createSelector(
  rootSelector,
  (state) => state.hasReachedDestination
);

const getVoiceAnnouncementsEnabled = createSelector(
  rootSelector,
  (state) => state.voiceAnnouncementsEnabled
);

export {
  getShowNavigationPanel,
  getIsNavigating,
  getNavigationModeTransitioning,
  getCurrentLocation,
  getDistanceRemaining,
  getTimeRemaining,
  getEta,
  getRemainingRoute,
  getHasReachedDestination,
  getVoiceAnnouncementsEnabled
};

export const {
  setShowNavigationPanel,
  setIsNavigating,
  setNavigationModeTransitioning,
  setCurrentLocation,
  setDistanceRemaining,
  setTimeRemaining,
  setEta,
  setRemainingRoute,
  setHasReachedDestination,
  setVoiceAnnouncementsEnabled,
  resetNavigation
} = navigationSlice.actions;

export default navigationSlice.reducer;
