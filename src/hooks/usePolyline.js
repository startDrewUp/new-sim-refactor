// src/hooks/usePolyline.js

import { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPolylinePoint,
  finalizePolyline,
  setPolylineMode,
  undoPolylinePoint,
  redoPolylinePoint,
  discardPolyline,
} from "../redux/slices/polylineSlice";
import { selectSnapToGrid, selectGridSize } from "../redux/slices/gridSlice";

/**
 * Custom hook to manage polyline drawing and editing.
 * @param {Object} svgRef - Reference to the SVG element.
 * @param {Object} gRef - Reference to the <g> element within the SVG.
 * @returns {Object} - Contains polyline state and event handlers.
 */
const usePolyline = (svgRef, gRef) => {
  const dispatch = useDispatch();
  const polylineMode = useSelector((state) => state.polyline.polylineMode);
  const currentPolyline = useSelector(
    (state) => state.polyline.currentPolyline
  );
  const snapToGrid = useSelector(selectSnapToGrid);
  const gridSize = useSelector(selectGridSize);
  const [shadowPoint, setShadowPoint] = useState(null);
  const debounceRef = useRef(null);
  const debounceDelay = 50; // milliseconds

  /**
   * Handles mouse movement over the SVG canvas to update the shadow point.
   * Debounced to improve performance.
   */
  const handleMouseMove = useCallback(
    (e) => {
      if (polylineMode) {
        const svgElement = svgRef.current;
        const gElement = gRef.current;

        if (!svgElement || !gElement) return;

        const point = svgElement.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;

        const transformedPoint = point.matrixTransform(
          gElement.getScreenCTM().inverse()
        );

        let newPoint = {
          x: transformedPoint.x,
          y: transformedPoint.y,
        };

        // Snap to grid if enabled
        if (snapToGrid) {
          const gridSizePx = gridSize; // Assuming gridSize is in pixels
          newPoint = {
            x: Math.round(newPoint.x / gridSizePx) * gridSizePx,
            y: Math.round(newPoint.y / gridSizePx) * gridSizePx,
          };
        }

        setShadowPoint(newPoint);
      }
    },
    [polylineMode, svgRef, gRef, snapToGrid, gridSize]
  );

  /**
   * Debounced version of handleMouseMove to prevent excessive state updates.
   */
  const debouncedHandleMouseMove = useCallback(
    (e) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        handleMouseMove(e);
      }, debounceDelay);
    },
    [handleMouseMove]
  );

  /**
   * Handles clicks on the SVG canvas to add points to the current polyline.
   */
  const handleCanvasClick = useCallback(
    (e) => {
      if (polylineMode) {
        const svgElement = svgRef.current;
        const gElement = gRef.current;

        if (!svgElement || !gElement) return;

        const point = svgElement.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;

        const transformedPoint = point.matrixTransform(
          gElement.getScreenCTM().inverse()
        );

        let newPoint = {
          x: transformedPoint.x,
          y: transformedPoint.y,
        };

        // Snap to grid if enabled
        if (snapToGrid) {
          const gridSizePx = gridSize; // Assuming gridSize is in pixels
          newPoint = {
            x: Math.round(newPoint.x / gridSizePx) * gridSizePx,
            y: Math.round(newPoint.y / gridSizePx) * gridSizePx,
          };
        }

        dispatch(addPolylinePoint(newPoint));
        setShadowPoint(null);
      }
    },
    [polylineMode, dispatch, svgRef, gRef, snapToGrid, gridSize]
  );

  /**
   * Handles keyboard events for polyline actions like undo, redo, finalize, and discard.
   */
  const handleKeyDown = useCallback(
    (e) => {
      if (polylineMode) {
        if (e.ctrlKey && e.key === "z") {
          // Ctrl + Z for undo
          e.preventDefault();
          dispatch(undoPolylinePoint());
        } else if (e.ctrlKey && e.key === "y") {
          // Ctrl + Y for redo
          e.preventDefault();
          dispatch(redoPolylinePoint());
        } else if (e.key === "Escape") {
          // Discard the polyline and exit polyline mode
          dispatch(discardPolyline());
          dispatch(setPolylineMode(false));
          setShadowPoint(null);
        } else if (e.key === "Enter") {
          // Finalize the polyline and exit polyline mode
          if (currentPolyline.length > 1) {
            dispatch(finalizePolyline());
            dispatch(setPolylineMode(false));
            setShadowPoint(null);
          }
        } else if (e.key.toLowerCase() === "c") {
          // Close the polyline (polygon)
          if (currentPolyline.length > 2) {
            dispatch(finalizePolyline());
            dispatch(setPolylineMode(false));
            setShadowPoint(null);
          }
        }
      }
    },
    [polylineMode, dispatch, currentPolyline]
  );

  /**
   * Adds the keyboard event listener when polyline mode is active.
   */
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  /**
   * Finalizes or discards the polyline based on user actions when exiting polyline mode.
   */
  useEffect(() => {
    if (!polylineMode && currentPolyline.length > 0) {
      // This block is redundant due to handling in handleKeyDown
      // It can be removed or kept for additional safety
    }
  }, [polylineMode, currentPolyline]);

  return {
    polylineMode,
    currentPolyline,
    shadowPoint,
    handleMouseMove: debouncedHandleMouseMove,
    handleCanvasClick,
  };
};

export default usePolyline;
