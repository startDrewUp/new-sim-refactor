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
  currentStrokeColor: "#0000FF",
  currentStrokeWidth: 2,
  currentStrokeDasharray: "none",
  currentIsClosed: false,
});

const updateHistory = (state) => {
  const currentPolylines = polylineAdapter.getSelectors().selectAll(state);
  state.history = state.history.slice(0, state.historyIndex + 1);
  state.history.push({
    polylines: currentPolylines,
    currentPolyline: [...state.currentPolyline],
    selectedPolylineId: state.selectedPolylineId,
    polylineMode: state.polylineMode,
    currentStrokeColor: state.currentStrokeColor,
    currentStrokeWidth: state.currentStrokeWidth,
    currentStrokeDasharray: state.currentStrokeDasharray,
    currentIsClosed: state.currentIsClosed,
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
          strokeColor: state.currentStrokeColor,
          strokeWidth: state.currentStrokeWidth,
          strokeDasharray: state.currentStrokeDasharray,
          isClosed: state.currentIsClosed,
        };
        polylineAdapter.addOne(state, newPolyline);
        state.currentPolyline = [];
      }
      updateHistory(state);
    },
    updatePolyline: (state, action) => {
      polylineAdapter.updateOne(state, action.payload);
      updateHistory(state);
    },
    deletePolyline: (state, action) => {
      polylineAdapter.removeOne(state, action.payload);
      if (state.selectedPolylineId === action.payload) {
        state.selectedPolylineId = null;
      }
      updateHistory(state);
    },
    selectPolyline: (state, action) => {
      state.selectedPolylineId = action.payload;
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
      state.currentStrokeColor = strokeColor ?? state.currentStrokeColor;
      state.currentStrokeWidth = strokeWidth ?? state.currentStrokeWidth;
      state.currentStrokeDasharray =
        strokeDasharray ?? state.currentStrokeDasharray;
      state.currentIsClosed = isClosed ?? state.currentIsClosed;
      updateHistory(state);
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        const prevState = state.history[state.historyIndex];
        polylineAdapter.setAll(state, prevState.polylines);
        state.currentPolyline = prevState.currentPolyline;
        state.selectedPolylineId = prevState.selectedPolylineId;
        state.polylineMode = prevState.polylineMode;
        state.currentStrokeColor = prevState.currentStrokeColor;
        state.currentStrokeWidth = prevState.currentStrokeWidth;
        state.currentStrokeDasharray = prevState.currentStrokeDasharray;
        state.currentIsClosed = prevState.currentIsClosed;
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        const nextState = state.history[state.historyIndex];
        polylineAdapter.setAll(state, nextState.polylines);
        state.currentPolyline = nextState.currentPolyline;
        state.selectedPolylineId = nextState.selectedPolylineId;
        state.polylineMode = nextState.polylineMode;
        state.currentStrokeColor = nextState.currentStrokeColor;
        state.currentStrokeWidth = nextState.currentStrokeWidth;
        state.currentStrokeDasharray = nextState.currentStrokeDasharray;
        state.currentIsClosed = nextState.currentIsClosed;
      }
    },
  },
});

export const {
  setPolylineMode,
  addPolylinePoint,
  finalizePolyline,
  updatePolyline,
  deletePolyline,
  selectPolyline,
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
export const selectCurrentPolylineStyle = (state) => ({
  strokeColor: state.polyline.currentStrokeColor,
  strokeWidth: state.polyline.currentStrokeWidth,
  strokeDasharray: state.polyline.currentStrokeDasharray,
  isClosed: state.polyline.currentIsClosed,
});

export const selectSelectedPolyline = createSelector(
  [selectPolylines, selectSelectedPolylineId],
  (polylines, selectedId) =>
    polylines.find((polyline) => polyline.id === selectedId)
);
