import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  apiKey: undefined,
  center: undefined,
  zoom: undefined,
  bearing: undefined,
  pitch: undefined,
  bounds: undefined,
  movingMethod: "jumpTo",
  routeOptions: {
    travelMode: "car",
    traffic: true,
    locations: [],
    sectionType: ["speedLimit", "lanes"],
    instructionsType: "text",
    instructionAnnouncementPoints: "all",
    instructionRoadShieldReferences: "all",
    language: navigator.language
  }
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setApiKey: (state, action) => {
      state.apiKey = action.payload;
    },
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
    }
  }
});

const rootSelector = (state) => state.map;

const getApiKey = createSelector(rootSelector, (state) => state.apiKey);

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

export {
  getApiKey,
  getCenter,
  getZoom,
  getBearing,
  getPitch,
  getBounds,
  getMovingMethod,
  getRouteOptions
};

export const {
  setApiKey,
  setCenter,
  setZoom,
  setBearing,
  setPitch,
  setBounds,
  setMovingMethod,
  setRouteOptions,
  setIsNavigating
} = mapSlice.actions;

export default mapSlice.reducer;
