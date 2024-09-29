import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";

const itemsAdapter = createEntityAdapter();

const initialState = itemsAdapter.getInitialState({
  selectedItemId: null,
  history: [],
  historyIndex: -1,
});

const updateHistory = (state) => {
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
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    addItem: (state, action) => {
      itemsAdapter.addOne(state, action.payload);
      console.log("Item added to store:", action.payload); // Debugging log
      updateHistory(state);
    },
    updateItem: (state, action) => {
      itemsAdapter.updateOne(state, action.payload);
      updateHistory(state);
    },
    deleteItem: (state, action) => {
      itemsAdapter.removeOne(state, action.payload);
      updateHistory(state);
    },
    clearItems: (state) => {
      itemsAdapter.removeAll(state);
      updateHistory(state);
    },
    updateItemPosition: (state, action) => {
      const { id, x, y } = action.payload;
      itemsAdapter.updateOne(state, { id, changes: { x, y } });
      updateHistory(state);
    },
    deleteSelectedItems: (state, action) => {
      itemsAdapter.removeMany(state, action.payload);
      state.selectedItemId = null;
      updateHistory(state);
    },
    selectItem: (state, action) => {
      state.selectedItemId = action.payload;
    },
    deselectItems: (state) => {
      state.selectedItemId = null;
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

export const selectSelectedItem = createSelector(
  [selectItems, selectSelectedItemId],
  (items, selectedId) => items.find((item) => item.id === selectedId)
);