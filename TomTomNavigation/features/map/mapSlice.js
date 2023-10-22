import { createSlice, createSelector } from "@reduxjs/toolkit";
import _merge from "lodash.merge";

const initialState = {
  center: undefined,
  zoom: undefined,
  bearing: undefined,
  pitch: undefined,
  bounds: undefined,
  movingMethod: "jumpTo",
  fitBoundsOptions: {
    padding: { top: 80, right: 40, bottom: 150, left: 40 },
    animate: false
  },
  routeOptions: {
    travelMode: "car",
    traffic: true,
    locations: [],
    supportingPoints: undefined,
    sectionType: ["speedLimit", "lanes"],
    instructionsType: "text",
    instructionAnnouncementPoints: "all",
    instructionRoadShieldReferences: "all",
    language: navigator.language
  },
  automaticRouteCalculation: false,
  userLocation: undefined
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setCenter: (state, action) => {
      state.center = action.payload;
      state.bounds = undefined;
    },
    setZoom: (state, action) => {
      state.zoom = action.payload;
    },
    setBearing: (state, action) => {
      state.bearing = action.payload;
    },
    setPitch: (state, action) => {
      state.pitch = action.payload;
    },
    setBounds: (state, action) => {
      state.bounds = action.payload;
      state.center = undefined;
    },
    setMovingMethod: (state, action) => {
      state.movingMethod = action.payload;
    },
    setRouteOptions: (state, action) => {
      state.routeOptions = { ...state.routeOptions, ...action.payload };
    },
    setAutomaticRouteCalculation: (state, action) => {
      state.automaticRouteCalculation = action.payload;
    },
    setFitBoundsOptions: (state, action) => {
      state.fitBoundsOptions = _merge(state.fitBoundsOptions, action.payload);
    },
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    }
  }
});

const rootSelector = (state) => state.map;

const getCenter = createSelector(rootSelector, (state) => state.center);

const getZoom = createSelector(rootSelector, (state) => state.zoom);

const getBearing = createSelector(rootSelector, (state) => state.bearing);

const getPitch = createSelector(rootSelector, (state) => state.pitch);

const getBounds = createSelector(rootSelector, (state) => state.bounds);

const getMovingMethod = createSelector(
  rootSelector,
  (state) => state.movingMethod
);

const getRouteOptions = createSelector(
  rootSelector,
  (state) => state.routeOptions
);

const getAutomaticRouteCalculation = createSelector(
  rootSelector,
  (state) => state.automaticRouteCalculation
);

const getFitBoundsOptions = createSelector(
  rootSelector,
  (state) => state.fitBoundsOptions
);

const getUserLocation = createSelector(
  rootSelector,
  (state) => state.userLocation
);

export {
  getCenter,
  getZoom,
  getBearing,
  getPitch,
  getBounds,
  getMovingMethod,
  getRouteOptions,
  getAutomaticRouteCalculation,
  getFitBoundsOptions,
  getUserLocation
};

export const {
  setCenter,
  setZoom,
  setBearing,
  setPitch,
  setBounds,
  setMovingMethod,
  setRouteOptions,
  setAutomaticRouteCalculation,
  setFitBoundsOptions,
  setIsNavigating,
  setUserLocation
} = mapSlice.actions;

export default mapSlice.reducer;
