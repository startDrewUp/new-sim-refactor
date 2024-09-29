import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  clearItems,
  addItem,
  loadCanvasState,
  selectItems,
} from "../slices/layoutSlice";
import { resetGridSettings } from "../slices/gridSlice";
import { resetTransform } from "../slices/transformSlice";

export const clearCanvas = () => (dispatch) => {
  dispatch(clearItems());
  dispatch(resetGridSettings());
  dispatch(resetTransform());
};

export const handleAddItemThunk = createAsyncThunk(
  "layout/handleAddItem",
  async (newItem, { dispatch }) => {
    dispatch(addItem(newItem));
  }
);

export const saveCanvasState = () => (dispatch, getState) => {
  const state = getState();
  const items = selectItems(state);
  const canvasState = {
    layout: {
      ...state.layout,
      items,
    },
    grid: state.grid,
    transform: state.transform,
  };

  const dataStr = JSON.stringify(canvasState, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "canvas_state.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const loadCanvasStateThunk = createAsyncThunk(
  "layout/loadCanvasState",
  async (canvasState, { dispatch }) => {
    dispatch(loadCanvasState(canvasState.layout));
    // You might need to dispatch actions to load state for other slices as well
  }
);