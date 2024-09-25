// src/redux/slices/transformSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scale: 1,
  x: 0,
  y: 0,
};

const transformSlice = createSlice({
  name: "transform",
  initialState,
  reducers: {
    setTransform: (state, action) => {
      const { scale, x, y } = action.payload;
      if (
        typeof scale === "number" &&
        typeof x === "number" &&
        typeof y === "number"
      ) {
        state.scale = scale;
        state.x = x;
        state.y = y;
      } else {
        console.error("Invalid transform payload:", action.payload);
      }
    },
    resetTransform: (state) => {
      return initialState;
    },
  },
});

export const { setTransform, resetTransform } = transformSlice.actions;

export default transformSlice.reducer;

// Selectors
export const selectTransform = (state) => state.transform;
