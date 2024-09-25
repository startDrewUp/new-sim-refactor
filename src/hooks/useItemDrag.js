// src/hooks/useItemDrag.js

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateItemPosition } from "../redux/slices/layoutSlice";
import { selectTransform } from "../redux/slices/transformSlice";
import { selectSnapToGrid, selectGridSize } from "../redux/slices/gridSlice";

const useItemDrag = () => {
  const dispatch = useDispatch();
  const transform = useSelector(selectTransform);
  const snapToGrid = useSelector(selectSnapToGrid);
  const gridSize = useSelector(selectGridSize);

  const handleItemMouseDown = useCallback(
    (e, item) => {
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;

      const handleItemMove = (moveEvent) => {
        const dx = (moveEvent.clientX - startX) / transform.scale;
        const dy = (moveEvent.clientY - startY) / transform.scale;

        let newX = item.x + dx;
        let newY = item.y + dy;

        if (snapToGrid) {
          newX = Math.round(newX / gridSize) * gridSize;
          newY = Math.round(newY / gridSize) * gridSize;
        }

        dispatch(updateItemPosition({ id: item.id, x: newX, y: newY }));
      };

      const handleItemMoveEnd = () => {
        window.removeEventListener("mousemove", handleItemMove);
        window.removeEventListener("mouseup", handleItemMoveEnd);
      };

      window.addEventListener("mousemove", handleItemMove);
      window.addEventListener("mouseup", handleItemMoveEnd);
    },
    [dispatch, transform.scale, snapToGrid, gridSize]
  );

  return { handleItemMouseDown };
};

export default useItemDrag;
