// src/hooks/useItemEditing.js
import { useState, useCallback } from "react";

const useItemEditing = () => {
  const [editingItem, setEditingItem] = useState(null);

  const handleEditItem = useCallback((item) => {
    setEditingItem(item);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditingItem(null);
  }, []);

  return { editingItem, handleEditItem, handleCloseEdit };
};

export default useItemEditing;
