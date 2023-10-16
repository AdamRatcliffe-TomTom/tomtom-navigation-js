import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  isNavigating: false
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setIsNavigating: (state, action) => {
      state.isNavigating = action.payload;
    }
  }
});

const rootSelector = (state) => state.navigation;

const getIsNavigating = createSelector(
  rootSelector,
  (state) => state.isNavigating
);

export { getIsNavigating };

export const { setIsNavigating } = navigationSlice.actions;

export default navigationSlice.reducer;
