// src/redux/slices/polylineSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  polylineMode: false,
  currentPolyline: [],
  polylines: [],
  selectedPolylineId: null,
  history: [],
  future: [],
  currentStrokeColor: null,
  currentStrokeWidth: null,
  currentStrokeDasharray: null,
  currentIsClosed: null,
};

const polylineSlice = createSlice({
  name: "polyline",
  initialState,
  reducers: {
    setPolylineMode: (state, action) => {
      state.polylineMode = action.payload;
      if (!action.payload) {
        state.currentPolyline = [];
        state.history = [];
        state.future = [];
        state.currentStrokeColor = null;
        state.currentStrokeWidth = null;
        state.currentStrokeDasharray = null;
        state.currentIsClosed = null;
      }
    },
    addPolylinePoint: (state, action) => {
      state.history.push([...state.currentPolyline]);
      state.future = [];
      state.currentPolyline.push(action.payload);
    },
    undoPolylinePoint: (state) => {
      if (state.history.length > 0) {
        state.future.push([...state.currentPolyline]);
        state.currentPolyline = state.history.pop();
      }
    },
    redoPolylinePoint: (state) => {
      if (state.future.length > 0) {
        state.history.push([...state.currentPolyline]);
        state.currentPolyline = state.future.pop();
      }
    },
    finalizePolyline: (state) => {
      if (state.currentPolyline.length > 1) {
        const newPolyline = {
          id: Date.now().toString(),
          points: [...state.currentPolyline],
          strokeColor: state.currentStrokeColor || "#0000FF", // Default color, can be customized
          strokeWidth: state.currentStrokeWidth || 2, // Default width, can be customized
          strokeDasharray: state.currentStrokeDasharray || "none", // Default dash pattern, can be customized
          isClosed: state.currentIsClosed || false, // Default to open polyline
        };
        state.polylines.push(newPolyline);
      }
      state.currentPolyline = [];
      state.history = [];
      state.future = [];
      state.currentStrokeColor = null;
      state.currentStrokeWidth = null;
      state.currentStrokeDasharray = null;
      state.currentIsClosed = null;
    },
    finishPolyline: (state) => {
      state.currentPolyline = [];
      state.history = [];
      state.future = [];
      state.currentStrokeColor = null;
      state.currentStrokeWidth = null;
      state.currentStrokeDasharray = null;
      state.currentIsClosed = null;
    },
    discardPolyline: (state) => {
      state.currentPolyline = [];
      state.history = [];
      state.future = [];
      state.currentStrokeColor = null;
      state.currentStrokeWidth = null;
      state.currentStrokeDasharray = null;
      state.currentIsClosed = null;
    },
    updatePolylinePoint: (state, action) => {
      const { polylineId, index, newPoint } = action.payload;
      const polyline = state.polylines.find((p) => p.id === polylineId);
      if (polyline && polyline.points[index]) {
        polyline.points[index] = newPoint;
        state.history.push([...polyline.points]);
        state.future = [];
      }
    },
    removePointFromPolyline: (state, action) => {
      const { polylineId, index } = action.payload;
      const polyline = state.polylines.find((p) => p.id === polylineId);
      if (polyline && polyline.points[index]) {
        polyline.points.splice(index, 1);
        state.history.push([...polyline.points]);
        state.future = [];
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
      state.history = [];
      state.future = [];
      state.currentStrokeColor = null;
      state.currentStrokeWidth = null;
      state.currentStrokeDasharray = null;
      state.currentIsClosed = null;
    },
    setPolylineStyle: (state, action) => {
      const { strokeColor, strokeWidth, strokeDasharray, isClosed } =
        action.payload;
      state.currentStrokeColor = strokeColor;
      state.currentStrokeWidth = strokeWidth;
      state.currentStrokeDasharray = strokeDasharray;
      state.currentIsClosed = isClosed;
    },
  },
});

export const {
  setPolylineMode,
  addPolylinePoint,
  undoPolylinePoint,
  redoPolylinePoint,
  finalizePolyline,
  finishPolyline,
  discardPolyline,
  updatePolylinePoint,
  removePointFromPolyline,
  selectPolyline,
  deleteSelectedPolylines,
  clearPolylines,
  setPolylineStyle,
} = polylineSlice.actions;

export default polylineSlice.reducer;

// Selectors
export const selectPolylineMode = (state) => state.polyline.polylineMode;
export const selectCurrentPolyline = (state) => state.polyline.currentPolyline;
export const selectPolylines = (state) => state.polyline.polylines;
export const selectSelectedPolylineId = (state) =>
  state.polyline.selectedPolylineId;
export const selectHistory = (state) => state.polyline.history;
export const selectFuture = (state) => state.polyline.future;
