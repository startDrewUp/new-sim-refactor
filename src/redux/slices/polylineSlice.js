import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";

const polylineAdapter = createEntityAdapter();

const initialState = polylineAdapter.getInitialState({
  polylineMode: false,
  currentPolyline: [],
  selectedPolylineId: null,
  history: [],
  historyIndex: -1,
  currentStrokeColor: null,
  currentStrokeWidth: null,
  currentStrokeDasharray: null,
  currentIsClosed: null,
});

const updateHistory = (state) => {
  const currentPolylines = polylineAdapter.getSelectors().selectAll(state);
  state.history = state.history.slice(0, state.historyIndex + 1);
  state.history.push({
    polylines: currentPolylines,
    currentPolyline: state.currentPolyline,
    selectedPolylineId: state.selectedPolylineId,
  });
  state.historyIndex++;
  if (state.history.length > 20) {
    state.history.shift();
    state.historyIndex--;
  }
};

const polylineSlice = createSlice({
  name: "polyline",
  initialState,
  reducers: {
    setPolylineMode: (state, action) => {
      state.polylineMode = action.payload;
      if (!action.payload) {
        state.currentPolyline = [];
        state.currentStrokeColor = null;
        state.currentStrokeWidth = null;
        state.currentStrokeDasharray = null;
        state.currentIsClosed = null;
      }
      updateHistory(state);
    },
    addPolylinePoint: (state, action) => {
      state.currentPolyline.push(action.payload);
      updateHistory(state);
    },
    finalizePolyline: (state) => {
      if (state.currentPolyline.length > 1) {
        const newPolyline = {
          id: Date.now().toString(),
          points: [...state.currentPolyline],
          strokeColor: state.currentStrokeColor || "#0000FF",
          strokeWidth: state.currentStrokeWidth || 2,
          strokeDasharray: state.currentStrokeDasharray || "none",
          isClosed: state.currentIsClosed || false,
        };
        polylineAdapter.addOne(state, newPolyline);
      }
      state.currentPolyline = [];
      state.currentStrokeColor = null;
      state.currentStrokeWidth = null;
      state.currentStrokeDasharray = null;
      state.currentIsClosed = null;
      updateHistory(state);
    },
    updatePolylinePoint: (state, action) => {
      const { polylineId, index, newPoint } = action.payload;
      const polyline = state.entities[polylineId];
      if (polyline && polyline.points[index]) {
        polyline.points[index] = newPoint;
        updateHistory(state);
      }
    },
    removePointFromPolyline: (state, action) => {
      const { polylineId, index } = action.payload;
      const polyline = state.entities[polylineId];
      if (polyline && polyline.points[index]) {
        polyline.points.splice(index, 1);
        updateHistory(state);
      }
    },
    selectPolyline: (state, action) => {
      state.selectedPolylineId = action.payload;
      updateHistory(state);
    },
    deleteSelectedPolylines: (state, action) => {
      polylineAdapter.removeMany(state, action.payload);
      state.selectedPolylineId = null;
      updateHistory(state);
    },
    clearPolylines: (state) => {
      polylineAdapter.removeAll(state);
      state.currentPolyline = [];
      state.selectedPolylineId = null;
      state.polylineMode = false;
      updateHistory(state);
    },
    setPolylineStyle: (state, action) => {
      const { strokeColor, strokeWidth, strokeDasharray, isClosed } =
        action.payload;
      state.currentStrokeColor = strokeColor;
      state.currentStrokeWidth = strokeWidth;
      state.currentStrokeDasharray = strokeDasharray;
      state.currentIsClosed = isClosed;
      updateHistory(state);
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        const prevState = state.history[state.historyIndex];
        polylineAdapter.setAll(state, prevState.polylines);
        state.currentPolyline = prevState.currentPolyline;
        state.selectedPolylineId = prevState.selectedPolylineId;
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        const nextState = state.history[state.historyIndex];
        polylineAdapter.setAll(state, nextState.polylines);
        state.currentPolyline = nextState.currentPolyline;
        state.selectedPolylineId = nextState.selectedPolylineId;
      }
    },
  },
});

export const {
  setPolylineMode,
  addPolylinePoint,
  finalizePolyline,
  updatePolylinePoint,
  removePointFromPolyline,
  selectPolyline,
  deleteSelectedPolylines,
  clearPolylines,
  setPolylineStyle,
  undo,
  redo,
} = polylineSlice.actions;

export default polylineSlice.reducer;

// Selectors
const polylineSelectors = polylineAdapter.getSelectors(
  (state) => state.polyline
);

export const selectPolylines = polylineSelectors.selectAll;
export const selectPolylineById = polylineSelectors.selectById;
export const selectPolylineIds = polylineSelectors.selectIds;
export const selectTotalPolylines = polylineSelectors.selectTotal;

export const selectPolylineMode = (state) => state.polyline.polylineMode;
export const selectCurrentPolyline = (state) => state.polyline.currentPolyline;
export const selectSelectedPolylineId = (state) =>
  state.polyline.selectedPolylineId;

export const selectSelectedPolyline = createSelector(
  [selectPolylines, selectSelectedPolylineId],
  (polylines, selectedId) =>
    polylines.find((polyline) => polyline.id === selectedId)
);
