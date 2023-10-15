import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  center: [0, 0],
  zoom: 0,
  bearing: 0,
  pitch: 0,
  bounds: null,
  movingMethod: "easeTo",
  animationOptions: {
    duration: 2000
  }
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
    setAnimationOptions: (state, action) => {
      state.animationOptions = action.payload;
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

const getAnimationOptions = createSelector(
  rootSelector,
  (state) => state.animationOptions
);

export {
  getCenter,
  getZoom,
  getBearing,
  getPitch,
  getBounds,
  getMovingMethod,
  getAnimationOptions
};

export const {
  setCenter,
  setZoom,
  setBearing,
  setPitch,
  setBounds,
  setMovingMethod,
  setAnimationOptions
} = mapSlice.actions;

export default mapSlice.reducer;
