import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";

const itemsAdapter = createEntityAdapter();

const initialState = itemsAdapter.getInitialState({
  addItemRequest: null,
  fitToViewRequest: false,
  selectedItemId: null,
  history: [],
  historyIndex: -1,
});

const updateHistory = (state, polylineState) => {
  state.history = state.history.slice(0, state.historyIndex + 1);
  const currentState = {
    items: itemsAdapter.getSelectors().selectAll(state),
    selectedItemId: state.selectedItemId,
    polylines: polylineState.entities,
    currentPolyline: polylineState.currentPolyline,
    selectedPolylineId: polylineState.selectedPolylineId,
    polylineMode: polylineState.polylineMode,
  };
  state.history.push(currentState);
  state.historyIndex++;
  if (state.history.length > 20) {
    state.history.shift();
    state.historyIndex--;
  }
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    addItem: (state, action) => {
      itemsAdapter.addOne(state, action.payload);
    },
    updateItem: (state, action) => {
      itemsAdapter.updateOne(state, action.payload);
    },
    deleteItem: (state, action) => {
      itemsAdapter.removeOne(state, action.payload);
    },
    clearItems: (state) => {
      itemsAdapter.removeAll(state);
    },
    updateItemPosition: (state, action) => {
      const { id, x, y } = action.payload;
      itemsAdapter.updateOne(state, { id, changes: { x, y } });
    },
    deleteSelectedItems: (state, action) => {
      itemsAdapter.removeMany(state, action.payload);
      state.selectedItemId = null;
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
    selectItem: (state, action) => {
      state.selectedItemId = action.payload;
    },
    deselectItems: (state) => {
      state.selectedItemId = null;
    },
    updateHistoryAction: (state, action) => {
      updateHistory(state, action.payload);
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        const prevState = state.history[state.historyIndex];
        itemsAdapter.setAll(state, prevState.items);
        state.selectedItemId = prevState.selectedItemId;
        return {
          polylines: prevState.polylines,
          currentPolyline: prevState.currentPolyline,
          selectedPolylineId: prevState.selectedPolylineId,
          polylineMode: prevState.polylineMode,
        };
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        const nextState = state.history[state.historyIndex];
        itemsAdapter.setAll(state, nextState.items);
        state.selectedItemId = nextState.selectedItemId;
        return {
          polylines: nextState.polylines,
          currentPolyline: nextState.currentPolyline,
          selectedPolylineId: nextState.selectedPolylineId,
          polylineMode: nextState.polylineMode,
        };
      }
    },
    loadCanvasState: (state, action) => {
      const { items, ...rest } = action.payload;
      itemsAdapter.setAll(state, items);
      Object.assign(state, rest);
    },
  },
});

export const {
  addItem,
  updateItem,
  deleteItem,
  clearItems,
  updateItemPosition,
  deleteSelectedItems,
  requestAddItem,
  clearAddItemRequest,
  requestFitToView,
  clearFitToViewRequest,
  selectItem,
  deselectItems,
  updateHistoryAction,
  undo,
  redo,
  loadCanvasState,
} = layoutSlice.actions;

export default layoutSlice.reducer;

// Selectors
const itemsSelectors = itemsAdapter.getSelectors((state) => state.layout);

export const selectItems = itemsSelectors.selectAll;
export const selectItemById = itemsSelectors.selectById;
export const selectItemIds = itemsSelectors.selectIds;
export const selectTotalItems = itemsSelectors.selectTotal;

export const selectSelectedItemId = (state) => state.layout.selectedItemId;
export const selectAddItemRequest = (state) => state.layout.addItemRequest;
export const selectFitToViewRequest = (state) => state.layout.fitToViewRequest;

export const selectSelectedItem = createSelector(
  [selectItems, selectSelectedItemId],
  (items, selectedId) => items.find((item) => item.id === selectedId)
);
