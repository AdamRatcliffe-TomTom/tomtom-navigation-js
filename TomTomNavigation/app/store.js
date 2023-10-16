import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { routingApi } from "../services/routing";
import mapReducer from "../features/map/mapSlice";
import navigationReducer from "../features/navigation/navigationSlice";

const reducer = combineReducers({
  map: mapReducer,
  navigation: navigationReducer,
  [routingApi.reducerPath]: routingApi.reducer
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).prepend(routingApi.middleware)
});
