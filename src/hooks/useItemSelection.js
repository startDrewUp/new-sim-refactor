// src/hooks/useItemSelection.js

import { useState } from "react";

const useItemSelection = () => {
  const [selectedItems, setSelectedItems] = useState(new Set());

  const toggleItemSelection = (id) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = new Set(prevSelectedItems);
      if (newSelectedItems.has(id)) {
        newSelectedItems.delete(id);
      } else {
        newSelectedItems.add(id);
      }
      return newSelectedItems;
    });
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  return {
    selectedItems,
    toggleItemSelection,
    clearSelection,
  };
};

export default useItemSelection;
