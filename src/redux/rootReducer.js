import { combineReducers } from "@reduxjs/toolkit";
import layoutReducer from "./slices/layoutSlice";

const rootReducer = combineReducers({
  layout: layoutReducer,
});

export default rootReducer;
