import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectItemById } from "../redux/slices/layoutSlice";

const useItemEditing = () => {
  const [editingItemId, setEditingItemId] = useState(null);

  const editingItem = useSelector((state) =>
    editingItemId ? selectItemById(state, editingItemId) : null
  );

  const handleEditItem = useCallback((item) => {
    setEditingItemId(item.id);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditingItemId(null);
  }, []);

  return { editingItem, handleEditItem, handleCloseEdit };
};

export default useItemEditing;
