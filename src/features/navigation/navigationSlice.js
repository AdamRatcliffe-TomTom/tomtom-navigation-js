import { createSlice, createSelector } from "@reduxjs/toolkit";
import CheapRuler from "cheap-ruler";
import isPedestrianRoute from "../../functions/isPedestrianRoute";
import {
  instructionByIndex,
  speedLimitByIndex,
  announcementByIndex,
  laneGuidanceByIndex,
  trafficEventsByIndex
} from "../../functions/routeUtils";

import NavigationPerspectives from "../../constants/NavigationPerspectives";

const initialState = {
  voiceAnnouncementsEnabled: true,
  showETAPanel: true,
  showGuidancePanel: true,
  showArrivalPanel: true,
  showContinueButton: false,
  continueButtonText: "",
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
  routeTravelled: undefined,
  distanceRemaining: undefined,
  timeRemaining: undefined,
  eta: null
};

let ruler;

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setShowETAPanel: (state, action) => {
      state.showETAPanel = action.payload;
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
    setContinueButtonText: (state, action) => {
      state.continueButtonText = action.payload;
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
        routeTravelled,
        routeRemaining,
        route,
        measurementSystem,
        language
      } = action.payload;

      const routeFeature = route.features[0];
      const { coordinates } = routeFeature.geometry;
      const useMessageProp = isPedestrianRoute(routeFeature);
      const speedLimit = speedLimitByIndex(routeFeature, pointIndex);
      const instruction = instructionByIndex(routeFeature, pointIndex);
      const { possibleCombineWithNext } = instruction;

      if (!ruler) {
        ruler = new CheapRuler(coordinates[0][1], "meters");
      }

      let consecutiveInstruction;

      if (possibleCombineWithNext) {
        consecutiveInstruction = instructionByIndex(
          routeFeature,
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
          routeFeature,
          pointIndex,
          measurementSystem,
          language,
          useMessageProp
        );
      }

      const laneGuidance = laneGuidanceByIndex(routeFeature, pointIndex);

      const trafficEvents = trafficEventsByIndex(routeFeature, pointIndex);

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
      state.routeTravelled = routeTravelled;
      state.routeRemaining = routeRemaining;
      state.distanceRemaining = distanceRemaining;
      state.distanceToNextManeuver = distanceToNextManeuver;
      state.timeRemaining = timeRemaining;
    },
    setLastInstruction: (state, action) => {
      state.lastInstruction = action.payload;
    },
    setNextInstruction: (state, action) => {
      state.nextInstruction = action.payload;
    },
    setDistanceRemaining: (state, action) => {
      state.distanceRemaining = action.payload;
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    setRouteRemaining: (state, action) => {
      state.routeRemaining = action.payload;
    },
    setRouteTravelled: (state, action) => {
      state.routeTravelled = action.payload;
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
    resetNavigation: (state, action) => {
      state.isNavigating = false;
      state.navigationPerspective = NavigationPerspectives.FOLLOW;
      state.hasReachedDestination = false;
      state.currentLocation = initialState.currentLocation;
      state.nextInstruction = undefined;
      state.consecutiveInstruction = undefined;
      state.lastInstruction = undefined;
      state.routeTravelled = undefined;
      state.routeRemaining = action.payload?.routeRemaining;
    }
  }
});

const rootSelector = (state) => state.navigation;

const getShowETAPanel = createSelector(
  rootSelector,
  (state) => state.showETAPanel
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

const getContinueButtonText = createSelector(
  rootSelector,
  (state) => state.continueButtonText
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

const getRouteTravelled = createSelector(
  rootSelector,
  (state) => state.routeTravelled
);

const getRouteRemaining = createSelector(
  rootSelector,
  (state) => state.routeRemaining
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
  getShowETAPanel,
  getShowGuidancePanel,
  getShowArrivalPanel,
  getShowContinueButton,
  getContinueButtonText,
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
  getRouteTravelled,
  getRouteRemaining,
  getHasReachedDestination,
  getSimulationShouldEnd,
  getVoiceAnnouncementsEnabled
};

export const {
  setShowETAPanel,
  setShowGuidancePanel,
  setShowArrivalPanel,
  setShowContinueButton,
  setContinueButtonText,
  setIsNavigating,
  setNavigationPerspective,
  setCurrentLocation,
  setDistanceRemaining,
  setTimeRemaining,
  setRouteRemaining,
  setRouteTravelled,
  setNextInstruction,
  setLastInstruction,
  setEta,
  setHasReachedDestination,
  setSimulationShouldEnd,
  setVoiceAnnouncementsEnabled,
  resetNavigation
} = navigationSlice.actions;

export default navigationSlice.reducer;
