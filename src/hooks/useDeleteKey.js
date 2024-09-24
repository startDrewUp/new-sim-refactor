// src/hooks/useDeleteKey.js

import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { deleteSelectedItems } from "../redux/slices/layoutSlice";

const useDeleteKey = (selectedItems) => {
  const dispatch = useDispatch();

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedItems.size > 0) {
          dispatch(deleteSelectedItems(Array.from(selectedItems)));
        }
      }
    },
    [selectedItems, dispatch]
  );

  return handleKeyDown;
};

export default useDeleteKey;
