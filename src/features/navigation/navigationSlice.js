import { createSlice, createSelector } from "@reduxjs/toolkit";
import isPedestrianRoute from "../../functions/isPedestrianRoute";
import {
  lastInstruction,
  instructionByIndex,
  speedLimitByIndex,
  announcementByIndex,
  laneGuidanceByIndex,
  trafficEventsByIndex
} from "../../functions/routeUtils";

import NavigationPerspectives from "../../constants/NavigationPerspectives";

const initialState = {
  voiceAnnouncementsEnabled: true,
  showBottomPanel: true,
  showGuidancePanel: true,
  showArrivalPanel: true,
  showContinueButton: false,
  isNavigating: false,
  navigationPerspective: NavigationPerspectives.FOLLOW,
  hasReachedDestination: false,
  simulationShouldEnd: false,
  currentLocation: {
    pointIndex: undefined,
    point: undefined,
    bearing: undefined,
    speedLimit: undefined,
    announcement: undefined,
    laneGuidance: undefined,
    trafficEvents: []
  },
  nextInstruction: undefined,
  consecutiveInstruction: undefined,
  lastInstruction: undefined,
  routeProgress: undefined,
  distanceRemaining: undefined,
  timeRemaining: undefined,
  eta: null
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setShowBottomPanel: (state, action) => {
      state.showBottomPanel = action.payload;
    },
    setShowGuidancePanel: (state, action) => {
      state.showGuidancePanel = action.payload;
    },
    setShowArrivalPanel: (state, action) => {
      state.showArrivalPanel = action.payload;
    },
    setShowContinueButton: (state, action) => {
      state.showContinueButton = action.payload;
    },
    setIsNavigating: (state, action) => {
      state.isNavigating = action.payload;
    },
    setNavigationPerspective: (state, action) => {
      state.navigationPerspective = action.payload;
    },
    setCurrentLocation: (state, action) => {
      const {
        point,
        pointIndex,
        bearing,
        timeRemaining,
        distanceRemaining,
        routeProgress,
        route,
        measurementSystem,
        language,
        ruler
      } = action.payload;

      const selectedRoute = route.features[0];
      const { coordinates } = selectedRoute.geometry;
      const useMessageProp = isPedestrianRoute(selectedRoute);
      const speedLimit = speedLimitByIndex(selectedRoute, pointIndex);
      const instruction = instructionByIndex(selectedRoute, pointIndex);
      const { possibleCombineWithNext } = instruction;

      let consecutiveInstruction;

      if (possibleCombineWithNext) {
        consecutiveInstruction = instructionByIndex(
          selectedRoute,
          instruction.pointIndex + 1
        );
      } else {
        consecutiveInstruction = undefined;
      }

      let distanceToNextManeuver = 0;
      if (instruction) {
        const remainingManeuverPart = ruler.lineSlice(
          point,
          coordinates[instruction.pointIndex],
          coordinates
        );
        distanceToNextManeuver = ruler.lineDistance(remainingManeuverPart);
      }

      let announcement;
      if (pointIndex !== state.currentLocation?.pointIndex) {
        announcement = announcementByIndex(
          selectedRoute,
          pointIndex,
          measurementSystem,
          language,
          useMessageProp
        );
      }

      const laneGuidance = laneGuidanceByIndex(selectedRoute, pointIndex);

      const trafficEvents = trafficEventsByIndex(selectedRoute, pointIndex);

      state.currentLocation = {
        pointIndex,
        point,
        bearing,
        speedLimit,
        announcement,
        laneGuidance,
        trafficEvents
      };
      state.nextInstruction = instruction;
      state.consecutiveInstruction = consecutiveInstruction;
      (state.routeProgress = routeProgress),
        (state.distanceRemaining = distanceRemaining);
      state.distanceToNextManeuver = distanceToNextManeuver;
      state.timeRemaining = timeRemaining;

      if (!state.lastInstruction) {
        state.lastInstruction = lastInstruction(selectedRoute);
      }
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
    setHasReachedDestination: (state, action) => {
      state.hasReachedDestination = action.payload;
    },
    setSimulationShouldEnd: (state, action) => {
      state.simulationShouldEnd = action.payload;
    },
    setVoiceAnnouncementsEnabled: (state, action) => {
      state.voiceAnnouncementsEnabled = action.payload;
    },
    resetNavigation: (state) => {
      state.isNavigating = false;
      state.navigationPerspective = NavigationPerspectives.FOLLOW;
      state.hasReachedDestination = false;
      state.currentLocation = initialState.currentLocation;
      state.nextInstruction = undefined;
      state.consecutiveInstruction = undefined;
      state.lastInstruction = undefined;
      state.routeProgress = undefined;
      // state.distanceRemaining = undefined;
    }
  }
});

const rootSelector = (state) => state.navigation;

const getShowBottomPanel = createSelector(
  rootSelector,
  (state) => state.showBottomPanel
);

const getShowGuidancePanel = createSelector(
  rootSelector,
  (state) => state.showGuidancePanel
);

const getShowArrivalPanel = createSelector(
  rootSelector,
  (state) => state.showArrivalPanel
);

const getShowContinueButton = createSelector(
  rootSelector,
  (state) => state.showContinueButton
);

const getIsNavigating = createSelector(
  rootSelector,
  (state) => state.isNavigating
);

const getNavigationPerspective = createSelector(
  rootSelector,
  (state) => state.navigationPerspective
);

const getCurrentLocation = createSelector(
  rootSelector,
  (state) => state.currentLocation
);

const getNextInstruction = createSelector(
  rootSelector,
  (state) => state.nextInstruction
);

const getConsecutiveInstruction = createSelector(
  rootSelector,
  (state) => state.consecutiveInstruction
);

const getLastInstruction = createSelector(
  rootSelector,
  (state) => state.lastInstruction
);

const getDistanceRemaining = createSelector(
  rootSelector,
  (state) => state.distanceRemaining
);

const getDistanceToNextManeuver = createSelector(
  rootSelector,
  (state) => state.distanceToNextManeuver
);

const getTimeRemaining = createSelector(
  rootSelector,
  (state) => state.timeRemaining
);

const getEta = createSelector(rootSelector, (state) => state.eta);

const getRouteProgress = createSelector(
  rootSelector,
  (state) => state.routeProgress
);

const getHasReachedDestination = createSelector(
  rootSelector,
  (state) => state.hasReachedDestination
);

const getSimulationShouldEnd = createSelector(
  rootSelector,
  (state) => state.simulationShouldEnd
);

const getVoiceAnnouncementsEnabled = createSelector(
  rootSelector,
  (state) => state.voiceAnnouncementsEnabled
);

export {
  getShowBottomPanel,
  getShowGuidancePanel,
  getShowArrivalPanel,
  getShowContinueButton,
  getIsNavigating,
  getNavigationPerspective,
  getNextInstruction,
  getConsecutiveInstruction,
  getLastInstruction,
  getCurrentLocation,
  getDistanceRemaining,
  getDistanceToNextManeuver,
  getTimeRemaining,
  getEta,
  getRouteProgress,
  getHasReachedDestination,
  getSimulationShouldEnd,
  getVoiceAnnouncementsEnabled
};

export const {
  setShowBottomPanel,
  setShowGuidancePanel,
  setShowArrivalPanel,
  setShowContinueButton,
  setIsNavigating,
  setNavigationPerspective,
  setCurrentLocation,
  setDistanceRemaining,
  setTimeRemaining,
  setEta,
  setHasReachedDestination,
  setSimulationShouldEnd,
  setVoiceAnnouncementsEnabled,
  resetNavigation
} = navigationSlice.actions;

export default navigationSlice.reducer;
