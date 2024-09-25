// src/hooks/useDeleteKey.js

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSelectedItems,
  selectSelectedItemId,
} from "../redux/slices/layoutSlice";

const useDeleteKey = () => {
  const dispatch = useDispatch();
  const selectedItemId = useSelector(selectSelectedItemId);

  const handleDeleteKey = useCallback(
    (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedItemId) {
          dispatch(deleteSelectedItems([selectedItemId]));
        }
      }
    },
    [dispatch, selectedItemId]
  );

  return handleDeleteKey;
};

export default useDeleteKey;
