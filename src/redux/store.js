// src/redux/store.js

import { configureStore } from "@reduxjs/toolkit";
import layoutReducer from "./slices/layoutSlice";
import transformReducer from "./slices/transformSlice";
import polylineReducer from "./slices/polylineSlice";
import gridReducer from "./slices/gridSlice"; // Add this line

const store = configureStore({
  reducer: {
    layout: layoutReducer,
    transform: transformReducer,
    polyline: polylineReducer,
    grid: gridReducer, // Add this line
  },
});

export default store;
