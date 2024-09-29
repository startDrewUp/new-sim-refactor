import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectItem, updateItemPosition } from "../redux/slices/layoutSlice";
import { selectTransform } from "../redux/slices/transformSlice";
import { selectSnapToGrid, selectGridSize } from "../redux/slices/gridSlice";

const useItemInteractions = () => {
  const dispatch = useDispatch();
  const transform = useSelector(selectTransform);
  const snapToGrid = useSelector(selectSnapToGrid);
  const gridSize = useSelector(selectGridSize);
  
  const dragInfo = useRef(null);

  const toggleItemSelection = useCallback((id) => {
    dispatch(selectItem(id));
  }, [dispatch]);

  const handleItemMouseDown = useCallback((e, item) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;

    dragInfo.current = {
      startX,
      startY,
      originalX: item.x,
      originalY: item.y,
    };

    const handleItemMove = (moveEvent) => {
      if (!dragInfo.current) return;

      const dx = (moveEvent.clientX - dragInfo.current.startX) / transform.scale;
      const dy = (moveEvent.clientY - dragInfo.current.startY) / transform.scale;

      let newX = dragInfo.current.originalX + dx;
      let newY = dragInfo.current.originalY + dy;

      if (snapToGrid) {
        const gridSizePx = gridSize * 10; // 10 pixels per foot
        newX = Math.round(newX / gridSizePx) * gridSizePx;
        newY = Math.round(newY / gridSizePx) * gridSizePx;
      }

      dispatch(updateItemPosition({ id: item.id, x: newX, y: newY }));
    };

    const handleItemMoveEnd = () => {
      window.removeEventListener("mousemove", handleItemMove);
      window.removeEventListener("mouseup", handleItemMoveEnd);
      dragInfo.current = null;
    };

    window.addEventListener("mousemove", handleItemMove);
    window.addEventListener("mouseup", handleItemMoveEnd);
  }, [dispatch, transform.scale, snapToGrid, gridSize]);

  return { toggleItemSelection, handleItemMouseDown };
};

export default useItemInteractions;