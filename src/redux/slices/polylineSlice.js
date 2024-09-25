// src/redux/slices/polylineSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  polylineMode: false,
  currentPolyline: [],
  polylines: [],
  selectedPolylineId: null,
};

const polylineSlice = createSlice({
  name: "polyline",
  initialState,
  reducers: {
    setPolylineMode: (state, action) => {
      state.polylineMode = action.payload;
    },
    addPolylinePoint: (state, action) => {
      state.currentPolyline.push(action.payload);
    },
    finalizePolyline: (state) => {
      if (state.currentPolyline.length > 1) {
        const newPolyline = {
          id: Date.now().toString(),
          points: [...state.currentPolyline],
        };
        state.polylines.push(newPolyline);
      }
      state.currentPolyline = [];
    },
    finishPolyline: (state) => {
      state.currentPolyline = [];
    },
    updatePolylinePosition: (state, action) => {
      const { id, points } = action.payload;
      const index = state.polylines.findIndex((polyline) => polyline.id === id);
      if (index !== -1) {
        state.polylines[index].points = points;
      }
    },
    selectPolyline: (state, action) => {
      state.selectedPolylineId = action.payload;
    },
    deleteSelectedPolylines: (state, action) => {
      const selectedIds = action.payload;
      state.polylines = state.polylines.filter(
        (polyline) => !selectedIds.includes(polyline.id)
      );
      state.selectedPolylineId = null;
    },
    clearPolylines: (state) => {
      state.polylines = [];
      state.currentPolyline = [];
      state.selectedPolylineId = null;
      state.polylineMode = false;
    },
  },
});

export const {
  setPolylineMode,
  addPolylinePoint,
  finalizePolyline,
  finishPolyline,
  updatePolylinePosition,
  selectPolyline,
  deleteSelectedPolylines,
  clearPolylines,
} = polylineSlice.actions;

export default polylineSlice.reducer;

// Selectors
export const selectPolylineMode = (state) => state.polyline.polylineMode;
export const selectCurrentPolyline = (state) => state.polyline.currentPolyline;
export const selectPolylines = (state) => state.polyline.polylines;
export const selectSelectedPolylineId = (state) =>
  state.polyline.selectedPolylineId;
