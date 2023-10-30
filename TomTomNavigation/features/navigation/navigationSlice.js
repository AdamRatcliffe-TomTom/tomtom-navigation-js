import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  showNavigationPanel: true,
  isNavigating: false,
  navigationModeTransitioning: false
};

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

export {
  getShowNavigationPanel,
  getIsNavigating,
  getNavigationModeTransitioning
};

export const {
  setShowNavigationPanel,
  setIsNavigating,
  setNavigationModeTransitioning
} = navigationSlice.actions;

export default navigationSlice.reducer;
