import { configureStore } from "@reduxjs/toolkit";
import layoutReducer from "./slices/layoutSlice";
import transformReducer from "./slices/transformSlice";
import gridReducer from "./slices/gridSlice";

const rootReducer = {
  layout: layoutReducer,
  transform: transformReducer,
  grid: gridReducer,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;