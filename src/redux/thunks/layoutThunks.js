// src/redux/thunks/layoutThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addItem, setTransform } from "../slices/layoutSlice";
import { v4 as uuidv4 } from "uuid";

export const handleAddItemThunk = createAsyncThunk(
  "layout/handleAddItem",
  async (newItem, { getState, dispatch }) => {
    // Here we cannot access svgRef and gRef, so we'll need to handle this differently
    // We can set addItemRequest in the state and let Canvas component handle it
    dispatch(requestAddItem(newItem));
  }
);

export const fitToViewThunk = createAsyncThunk(
  "layout/fitToView",
  async (_, { dispatch }) => {
    // Similarly, we cannot calculate fitToView here, so we signal it
    dispatch(requestFitToView());
  }
);
