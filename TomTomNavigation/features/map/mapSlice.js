import { createSlice, createSelector } from "@reduxjs/toolkit";

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
    sectionType: ["speedLimit", "lanes"],
    instructionsType: "text",
    instructionAnnouncementPoints: "all",
    instructionRoadShieldReferences: "all",
    language: navigator.language
  },
  automaticRouteCalculation: false
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setCenter: (state, action) => {
      state.center = action.payload;
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
      state.fitBoundsOptions = { ...state.fitBoundsOptions, ...action.payload };
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

export {
  getCenter,
  getZoom,
  getBearing,
  getPitch,
  getBounds,
  getMovingMethod,
  getRouteOptions,
  getAutomaticRouteCalculation,
  getFitBoundsOptions
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
  setIsNavigating
} = mapSlice.actions;

export default mapSlice.reducer;
