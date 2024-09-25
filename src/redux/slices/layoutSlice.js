// src/redux/slices/layoutSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  addItemRequest: null,
  fitToViewRequest: false,
  selectedItemId: null,
  history: [],
  historyIndex: -1,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
      layoutSlice.caseReducers.saveHistory(state);
    },
    updateItem: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates };
        layoutSlice.caseReducers.saveHistory(state);
      }
    },
    updateItemPosition: (state, action) => {
      const { id, x, y } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.items[index].x = x;
        state.items[index].y = y;
        layoutSlice.caseReducers.saveHistory(state);
      }
    },
    deleteSelectedItems: (state, action) => {
      const selectedIds = action.payload;
      state.items = state.items.filter(
        (item) => !selectedIds.includes(item.id)
      );
      layoutSlice.caseReducers.saveHistory(state);
      state.selectedItemId = null;
    },
    clearItems: (state) => {
      state.items = [];
      state.selectedItemId = null;
      layoutSlice.caseReducers.saveHistory(state);
    },
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
    loadCanvasState: (state, action) => {
      return { ...state, ...action.payload };
    },
    selectItem: (state, action) => {
      state.selectedItemId = action.payload;
    },
    deselectItems: (state) => {
      state.selectedItemId = null;
    },
    saveHistory: (state) => {
      state.history = state.history.slice(0, state.historyIndex + 1);
      const currentState = {
        items: JSON.parse(JSON.stringify(state.items)),
      };
      state.history.push(currentState);
      state.historyIndex++;
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
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        const nextState = state.history[state.historyIndex];
        state.items = JSON.parse(JSON.stringify(nextState.items));
      }
    },
  },
});

export const {
  addItem,
  updateItem,
  updateItemPosition,
  deleteSelectedItems,
  clearItems,
  requestAddItem,
  clearAddItemRequest,
  requestFitToView,
  clearFitToViewRequest,
  loadCanvasState,
  selectItem,
  deselectItems,
  undo,
  redo,
} = layoutSlice.actions;

export default layoutSlice.reducer;

// Selectors
export const selectItems = (state) => state.layout.items;
export const selectSelectedItemId = (state) => state.layout.selectedItemId;
export const selectAddItemRequest = (state) => state.layout.addItemRequest;
export const selectFitToViewRequest = (state) => state.layout.fitToViewRequest;
