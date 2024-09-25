// src/hooks/usePanning.js

import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTransform, selectTransform } from "../redux/slices/transformSlice";

const usePanning = () => {
  const dispatch = useDispatch();
  const transform = useSelector(selectTransform);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    if (e.button === 1) {
      // Only initiate panning on middle mouse button
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        const dx = (e.clientX - dragStart.x) / transform.scale;
        const dy = (e.clientY - dragStart.y) / transform.scale;
        dispatch(
          setTransform({
            ...transform,
            x: transform.x - dx,
            y: transform.y - dy,
          })
        );
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    },
    [isDragging, dragStart, transform, dispatch]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};

export default usePanning;
