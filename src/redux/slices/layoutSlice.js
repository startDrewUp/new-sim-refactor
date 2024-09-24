// src/redux/slices/layoutSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  showGrid: true,
  snapToGrid: true,
  gridSize: 5,
  gridOpacity: 0.5,
  transform: { scale: 1, x: 0, y: 0 },
  polylineMode: false,
  currentPolyline: [],
  polylines: [],
  addItemRequest: null,
  fitToViewRequest: false,
  selectedItemId: null, // Added for item selection
  selectedPolylineId: null, // Added for polyline selection
  // Undo/Redo
  history: [],
  historyIndex: -1,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    // Action to add an item to the items array
    addItem: (state, action) => {
      state.items.push(action.payload);
      layoutSlice.caseReducers.saveHistory(state);
    },

    // Action to update an existing item
    updateItem: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates };
        layoutSlice.caseReducers.saveHistory(state);
      }
    },

    // Action to update an item's position
    updateItemPosition: (state, action) => {
      const { id, x, y } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.items[index].x = x;
        state.items[index].y = y;
        layoutSlice.caseReducers.saveHistory(state);
      }
    },

    // Action to update a polyline's position
    updatePolylinePosition: (state, action) => {
      const { id, points } = action.payload;
      const index = state.polylines.findIndex((polyline) => polyline.id === id);
      if (index !== -1) {
        state.polylines[index].points = points;
        layoutSlice.caseReducers.saveHistory(state);
      }
    },

    // Action to delete selected items and polylines
    deleteSelectedItems: (state, action) => {
      const selectedIds = action.payload;
      state.items = state.items.filter(
        (item) => !selectedIds.includes(item.id)
      );
      state.polylines = state.polylines.filter(
        (polyline) => !selectedIds.includes(polyline.id)
      );
      layoutSlice.caseReducers.saveHistory(state);
      state.selectedItemId = null;
      state.selectedPolylineId = null;
    },

    // Action to clear all items and polylines from the canvas
    clearCanvas: (state) => {
      state.items = [];
      state.polylines = [];
      state.currentPolyline = [];
      layoutSlice.caseReducers.saveHistory(state);
      state.selectedItemId = null;
      state.selectedPolylineId = null;
    },

    // Action to toggle the grid visibility
    toggleGrid: (state) => {
      state.showGrid = !state.showGrid;
    },

    // Action to toggle snapping items to the grid
    toggleSnapToGrid: (state) => {
      state.snapToGrid = !state.snapToGrid;
    },

    // Action to set the grid size
    setGridSize: (state, action) => {
      state.gridSize = action.payload;
    },

    // Action to set the grid opacity
    setGridOpacity: (state, action) => {
      state.gridOpacity = action.payload;
    },

    // Action to set the canvas transform (scale and translation)
    setTransform: (state, action) => {
      const { scale, x, y } = action.payload;
      if (
        typeof scale === "number" &&
        typeof x === "number" &&
        typeof y === "number"
      ) {
        state.transform = { scale, x, y };
      } else {
        console.error("Invalid transform payload:", action.payload);
      }
    },

    // Action to set polyline drawing mode
    setPolylineMode: (state, action) => {
      state.polylineMode = action.payload;
    },

    // Action to add a point to the current polyline
    addPolylinePoint: (state, action) => {
      state.currentPolyline.push(action.payload);
    },

    // Action to finalize the current polyline and add it to the polylines array
    finalizePolyline: (state) => {
      if (state.currentPolyline.length > 1) {
        const newPolyline = {
          id: Date.now().toString(), // or use uuidv4()
          points: [...state.currentPolyline],
        };
        state.polylines.push(newPolyline);
        layoutSlice.caseReducers.saveHistory(state);
      }
      state.currentPolyline = [];
    },

    // Action to finish the current polyline without adding it to the polylines array
    finishPolyline: (state) => {
      state.currentPolyline = [];
    },

    // Actions for handling addItem and fitToView requests from the Toolbar
    requestAddItem: (state, action) => {
      state.addItemRequest = action.payload;
    },
    clearAddItemRequest: (state) => {
      state.addItemRequest = null;
    },
    requestFitToView: (state) => {
      state.fitToViewRequest = true;
    },
    clearFitToViewRequest: (state) => {
      state.fitToViewRequest = false;
    },

    // Action to load canvas state
    loadCanvasState: (state, action) => {
      return action.payload;
    },

    // Action to select an item
    selectItem: (state, action) => {
      state.selectedItemId = action.payload;
    },

    // Action to deselect items
    deselectItems: (state) => {
      state.selectedItemId = null;
      state.selectedPolylineId = null;
    },

    // Action to select a polyline
    selectPolyline: (state, action) => {
      state.selectedPolylineId = action.payload;
    },

    // Undo/Redo Actions
    saveHistory: (state) => {
      // Remove any redo history
      state.history = state.history.slice(0, state.historyIndex + 1);
      // Save a copy of the current state
      const currentState = {
        items: JSON.parse(JSON.stringify(state.items)),
        polylines: JSON.parse(JSON.stringify(state.polylines)),
      };
      state.history.push(currentState);
      state.historyIndex++;
      // Limit history size
      if (state.history.length > 20) {
        state.history.shift();
        state.historyIndex--;
      }
    },

    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        const prevState = state.history[state.historyIndex];
        state.items = JSON.parse(JSON.stringify(prevState.items));
        state.polylines = JSON.parse(JSON.stringify(prevState.polylines));
      }
    },

    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        const nextState = state.history[state.historyIndex];
        state.items = JSON.parse(JSON.stringify(nextState.items));
        state.polylines = JSON.parse(JSON.stringify(nextState.polylines));
      }
    },
  },
});

// Export actions
export const {
  addItem,
  updateItem,
  updateItemPosition,
  updatePolylinePosition,
  deleteSelectedItems,
  clearCanvas,
  toggleGrid,
  toggleSnapToGrid,
  setGridSize,
  setGridOpacity,
  setTransform,
  setPolylineMode,
  addPolylinePoint,
  finalizePolyline,
  finishPolyline,
  requestAddItem,
  clearAddItemRequest,
  requestFitToView,
  clearFitToViewRequest,
  loadCanvasState,
  selectItem, // Newly added
  deselectItems, // Newly added
  selectPolyline, // Newly added
  undo,
  redo,
} = layoutSlice.actions;

// Add thunk for saving canvas state
export const saveCanvasState = () => (dispatch, getState) => {
  const state = getState();
  const canvasState = {
    layout: state.layout,
  };

  const dataStr = JSON.stringify(canvasState, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create a temporary link to trigger the download
  const link = document.createElement("a");
  link.href = url;
  link.download = "canvas_state.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default layoutSlice.reducer;
