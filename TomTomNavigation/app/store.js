import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { routingApi } from "../services/routing";
import mapReducer from "../features/map/mapSlice";

const reducer = combineReducers({
  map: mapReducer,
  [routingApi.reducerPath]: routingApi.reducer
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(routingApi.middleware)
});
