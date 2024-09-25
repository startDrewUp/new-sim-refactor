// src/redux/rootReducer.js

import { combineReducers } from "@reduxjs/toolkit";
import layoutReducer from "./slices/layoutSlice";
import gridReducer from "./slices/gridSlice";
import transformReducer from "./slices/transformSlice";
import polylineReducer from "./slices/polylineSlice";

const rootReducer = combineReducers({
  layout: layoutReducer,
  grid: gridReducer,
  transform: transformReducer,
  polyline: polylineReducer,
});

export default rootReducer;
