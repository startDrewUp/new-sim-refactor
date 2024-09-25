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

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    addItem: (state, action) => {
      itemsAdapter.addOne(state, action.payload);
      layoutSlice.caseReducers.saveHistory(state);
    },
    updateItem: (state, action) => {
      itemsAdapter.updateOne(state, action.payload);
      layoutSlice.caseReducers.saveHistory(state);
    },
    deleteItem: (state, action) => {
      itemsAdapter.removeOne(state, action.payload);
      layoutSlice.caseReducers.saveHistory(state);
    },
    clearItems: (state) => {
      itemsAdapter.removeAll(state);
      layoutSlice.caseReducers.saveHistory(state);
    },
    updateItemPosition: (state, action) => {
      const { id, x, y } = action.payload;
      itemsAdapter.updateOne(state, { id, changes: { x, y } });
      layoutSlice.caseReducers.saveHistory(state);
    },
    deleteSelectedItems: (state, action) => {
      itemsAdapter.removeMany(state, action.payload);
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
    selectItem: (state, action) => {
      state.selectedItemId = action.payload;
    },
    deselectItems: (state) => {
      state.selectedItemId = null;
    },
    saveHistory: (state) => {
      state.history = state.history.slice(0, state.historyIndex + 1);
      const currentState = {
        items: itemsAdapter.getSelectors().selectAll(state),
        selectedItemId: state.selectedItemId,
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
        itemsAdapter.setAll(state, prevState.items);
        state.selectedItemId = prevState.selectedItemId;
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        const nextState = state.history[state.historyIndex];
        itemsAdapter.setAll(state, nextState.items);
        state.selectedItemId = nextState.selectedItemId;
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
