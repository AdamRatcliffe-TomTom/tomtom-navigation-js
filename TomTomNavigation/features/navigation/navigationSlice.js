import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  isNavigating: false,
  navigationModeTransitioning: false
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setIsNavigating: (state, action) => {
      state.isNavigating = action.payload;
    },
    setNavigationModeTransitioning: (state, action) => {
      state.navigationModeTransitioning = action.payload;
    }
  }
});

const rootSelector = (state) => state.navigation;

const getIsNavigating = createSelector(
  rootSelector,
  (state) => state.isNavigating
);

const getNavigationModeTransitioning = createSelector(
  rootSelector,
  (state) => state.navigationModeTransitioning
);

export { getIsNavigating, getNavigationModeTransitioning };

export const { setIsNavigating, setNavigationModeTransitioning } =
  navigationSlice.actions;

export default navigationSlice.reducer;
