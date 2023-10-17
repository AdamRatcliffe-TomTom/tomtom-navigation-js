import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  isNavigating: false,
  navigationModeTransitioning: false,
  navigationRoute: undefined
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
    },
    setNavigationRoute: (state, action) => {
      state.navigationRoute = action.payload;
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

const getNavigationRoute = createSelector(
  rootSelector,
  (state) => state.navigationRoute
);

export { getIsNavigating, getNavigationModeTransitioning, getNavigationRoute };

export const {
  setIsNavigating,
  setNavigationModeTransitioning,
  setNavigationRoute
} = navigationSlice.actions;

export default navigationSlice.reducer;
