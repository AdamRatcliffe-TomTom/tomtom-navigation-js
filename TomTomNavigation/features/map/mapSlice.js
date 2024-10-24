import { createSlice, createSelector } from "@reduxjs/toolkit";
import _merge from "lodash.merge";
import _pick from "lodash.pick";

import {
  FIT_BOUNDS_PADDING_TOP,
  FIT_BOUNDS_PADDING_RIGHT,
  FIT_BOUNDS_PADDING_BOTTOM,
  FIT_BOUNDS_PADDING_LEFT
} from "../../config";

const initialState = {
  center: undefined,
  zoom: undefined,
  bearing: undefined,
  pitch: undefined,
  bounds: undefined,
  movingMethod: "jumpTo",
  fitBoundsOptions: {
    padding: {
      top: FIT_BOUNDS_PADDING_TOP,
      right: FIT_BOUNDS_PADDING_RIGHT,
      bottom: FIT_BOUNDS_PADDING_BOTTOM,
      left: FIT_BOUNDS_PADDING_LEFT
    },
    animate: true
  },
  animationOptions: { duration: 500, essential: true },
  routeOptions: {
    travelMode: "car",
    traffic: "live",
    locations: [],
    supportingPoints: undefined,
    sectionType: ["speedLimit", "lanes", "traffic"],
    instructionsType: "coded",
    instructionRoadShieldReferences: "all",
    guidanceVersion: 2,
    instructionPhonetics: "IPA",
    language: navigator.language
  },
  automaticRouteCalculation: false,
  userLocation: undefined,
  viewTransitioning: false,
  spriteImageUrl: undefined,
  spriteJson: undefined,
  countryCode: undefined
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setCamera: (state, action) => {
      const cameraProps = _pick(action.payload, [
        "around",
        "center",
        "zoom",
        "bearing",
        "pitch",
        "movingMethod",
        "animationOptions",
        "padding"
      ]);
      return _merge(state, cameraProps, { bounds: undefined });
    },
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
    setAnimationOptions: (state, action) => {
      state.animationOptions = _merge(state.animationOptions, action.payload);
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
    },
    setViewTransitioning: (state, action) => {
      state.viewTransitioning = action.payload;
    },
    setSpriteImageUrl: (state, action) => {
      state.spriteImageUrl = action.payload;
    },
    setSpriteJson: (state, action) => {
      state.spriteJson = action.payload;
    },
    setCountryCode: (state, action) => {
      state.countryCode = action.payload;
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

const getViewTransitioning = createSelector(
  rootSelector,
  (state) => state.viewTransitioning
);

const getSpriteImageUrl = createSelector(
  rootSelector,
  (state) => state.spriteImageUrl
);

const getSpriteJson = createSelector(rootSelector, (state) => state.spriteJson);

const getCountryCode = createSelector(
  rootSelector,
  (state) => state.countryCode
);

export {
  getCenter,
  getZoom,
  getBearing,
  getPitch,
  getBounds,
  getMovingMethod,
  getAnimationOptions,
  getRouteOptions,
  getAutomaticRouteCalculation,
  getFitBoundsOptions,
  getUserLocation,
  getViewTransitioning,
  getSpriteImageUrl,
  getSpriteJson,
  getCountryCode
};

export const {
  setCamera,
  setCenter,
  setZoom,
  setBearing,
  setPitch,
  setBounds,
  setMovingMethod,
  setRouteOptions,
  setAnimationOptions,
  setAutomaticRouteCalculation,
  setFitBoundsOptions,
  setIsNavigating,
  setUserLocation,
  setViewTransitioning,
  setSpriteImageUrl,
  setSpriteJson,
  setCountryCode
} = mapSlice.actions;

export default mapSlice.reducer;
