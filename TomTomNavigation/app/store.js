import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { routingApi } from "../services/routing";

const reducer = combineReducers({
  [routingApi.reducerPath]: routingApi.reducer
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(routingApi.middleware)
});
