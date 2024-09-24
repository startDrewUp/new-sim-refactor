// src/hooks/useItemEditing.js
import { useState, useCallback } from "react";

/**
 * Custom hook to manage the state of the currently editing item.
 * @returns {Object} - Contains the editing item and handlers to manage it.
 */
const useItemEditing = () => {
  const [editingItem, setEditingItem] = useState(null);

  /**
   * Sets the item to be edited.
   * @param {Object} item - The item to edit.
   */
  const handleEditItem = useCallback((item) => {
    setEditingItem(item);
  }, []);

  /**
   * Closes the edit dialog by resetting the editing item.
   */
  const handleCloseEdit = useCallback(() => {
    setEditingItem(null);
  }, []);

  return { editingItem, handleEditItem, handleCloseEdit };
};

export default useItemEditing;
