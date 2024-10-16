import { createSlice, createSelector } from "@reduxjs/toolkit";
import { featureCollection, lineString } from "@turf/helpers";
import CheapRuler from "cheap-ruler";
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

let ruler;

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
    setIsNavigating: (state, action) => {
      state.isNavigating = action.payload;
    },
    setNavigationPerspective: (state, action) => {
      state.navigationPerspective = action.payload;
    },
    setCurrentLocation: (state, action) => {
      const {
        location,
        bearing,
        elapsedTime,
        route,
        measurementSystem,
        language
      } = action.payload;

      const selectedRoute = route.features[0];
      const {
        summary: { travelTimeInSeconds }
      } = selectedRoute.properties;
      const { coordinates } = selectedRoute.geometry;
      const useMessageProp = isPedestrianRoute(selectedRoute);

      if (!ruler) {
        ruler = new CheapRuler(coordinates[0][1], "meters");
      }

      const { point, index: currentPointIndex } = ruler.pointOnLine(
        coordinates,
        location
      );

      const traveledPart = ruler.lineSlice(coordinates[0], point, coordinates);
      if (traveledPart.length === 1) {
        traveledPart.push(coordinates[0]);
      }

      const remainingPart = ruler.lineSlice(
        point,
        coordinates[coordinates.length - 1],
        coordinates
      );
      const distanceRemaining = ruler.lineDistance(remainingPart);
      const timeRemaining = Math.max(travelTimeInSeconds - elapsedTime, 0);
      const speedLimit = speedLimitByIndex(selectedRoute, currentPointIndex);
      const instruction = instructionByIndex(selectedRoute, currentPointIndex);
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
      if (currentPointIndex !== state.currentLocation?.pointIndex) {
        announcement = announcementByIndex(
          selectedRoute,
          currentPointIndex,
          measurementSystem,
          language,
          useMessageProp
        );
      }

      const laneGuidance = laneGuidanceByIndex(
        selectedRoute,
        currentPointIndex
      );

      const trafficEvents = trafficEventsByIndex(
        selectedRoute,
        currentPointIndex
      );

      state.currentLocation = {
        pointIndex: currentPointIndex,
        point,
        bearing,
        speedLimit,
        announcement,
        laneGuidance,
        trafficEvents
      };
      state.nextInstruction = instruction;
      state.consecutiveInstruction = consecutiveInstruction;
      state.routeProgress = featureCollection([lineString(traveledPart)]);
      state.distanceRemaining = distanceRemaining;
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
      state.distanceRemaining = undefined;
      ruler = undefined;
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
