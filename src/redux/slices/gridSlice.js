// src/redux/slices/gridSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showGrid: true,
  snapToGrid: true,
  gridSize: 5,
  gridOpacity: 0.5,
};

const gridSlice = createSlice({
  name: "grid",
  initialState,
  reducers: {
    toggleGrid: (state) => {
      state.showGrid = !state.showGrid;
    },
    toggleSnapToGrid: (state) => {
      state.snapToGrid = !state.snapToGrid;
    },
    setGridSize: (state, action) => {
      state.gridSize = action.payload;
    },
    setGridOpacity: (state, action) => {
      state.gridOpacity = action.payload;
    },
    resetGridSettings: (state) => {
      return initialState;
    },
  },
});

export const {
  toggleGrid,
  toggleSnapToGrid,
  setGridSize,
  setGridOpacity,
  resetGridSettings,
} = gridSlice.actions;

export default gridSlice.reducer;

// Selectors
export const selectShowGrid = (state) => state.grid.showGrid;
export const selectSnapToGrid = (state) => state.grid.snapToGrid;
export const selectGridSize = (state) => state.grid.gridSize;
export const selectGridOpacity = (state) => state.grid.gridOpacity;
