// src/hooks/useItemDrag.js

import { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateItemPosition } from "../redux/slices/layoutSlice";

const useItemDrag = (svgRef, gRef, snapToGrid, gridSize) => {
  const dispatch = useDispatch();
  const [draggingItem, setDraggingItem] = useState(null);

  const handleItemMouseDown = useCallback(
    (e, item) => {
      e.stopPropagation();

      const svgElement = svgRef.current;
      const gElement = gRef.current;

      if (!svgElement || !gElement || !item) return;

      const point = svgElement.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;

      const transformedPoint = point.matrixTransform(
        gElement.getScreenCTM().inverse()
      );

      setDraggingItem({
        id: item.id,
        offsetX: transformedPoint.x - item.x,
        offsetY: transformedPoint.y - item.y,
      });
    },
    [svgRef, gRef]
  );

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggingItem) {
        const svgElement = svgRef.current;
        const gElement = gRef.current;

        if (!svgElement || !gElement) return;

        const point = svgElement.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;

        const transformedPoint = point.matrixTransform(
          gElement.getScreenCTM().inverse()
        );

        let newX = transformedPoint.x - draggingItem.offsetX;
        let newY = transformedPoint.y - draggingItem.offsetY;

        // Snap to grid if enabled
        if (snapToGrid) {
          const gridSizePx = gridSize * 10; // Assuming 10 pixels per unit
          newX = Math.round(newX / gridSizePx) * gridSizePx;
          newY = Math.round(newY / gridSizePx) * gridSizePx;
        }

        dispatch(updateItemPosition({ id: draggingItem.id, x: newX, y: newY }));
      }
    };

    const handleMouseUp = () => {
      if (draggingItem) {
        setDraggingItem(null);
      }
    };

    if (draggingItem) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    // Cleanup function to ensure event listeners are removed
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingItem, svgRef, gRef, snapToGrid, gridSize, dispatch]);

  return {
    handleItemMouseDown,
  };
};

export default useItemDrag;
