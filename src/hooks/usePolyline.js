// src/hooks/usePolyline.js

import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPolylinePoint,
  finalizePolyline,
  finishPolyline,
  setPolylineMode,
  selectPolylineMode,
  selectCurrentPolyline,
} from "../redux/slices/polylineSlice";
import { selectSnapToGrid, selectGridSize } from "../redux/slices/gridSlice";

const usePolyline = (svgRef, gRef) => {
  const dispatch = useDispatch();
  const polylineMode = useSelector(selectPolylineMode);
  const currentPolyline = useSelector(selectCurrentPolyline);
  const snapToGrid = useSelector(selectSnapToGrid);
  const gridSize = useSelector(selectGridSize);
  const [shadowPoint, setShadowPoint] = useState(null);
  const [discardPolyline, setDiscardPolyline] = useState(false);

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
          const gridSizePx = gridSize * 10; // Assuming 10 pixels per unit
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
          const gridSizePx = gridSize * 10; // Assuming 10 pixels per unit
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

  const handleKeyDown = useCallback(
    (e) => {
      if (polylineMode) {
        if (e.key === "Escape") {
          // Discard the polyline and exit polyline mode
          setDiscardPolyline(true);
          dispatch(setPolylineMode(false));
          setShadowPoint(null);
        } else if (e.key === "Enter") {
          // Finalize the polyline and exit polyline mode
          setDiscardPolyline(false);
          dispatch(setPolylineMode(false));
          setShadowPoint(null);
        }
      }
    },
    [polylineMode, dispatch]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (!polylineMode && currentPolyline.length > 0) {
      if (currentPolyline.length > 1 && !discardPolyline) {
        dispatch(finalizePolyline());
      } else {
        dispatch(finishPolyline());
      }
      setShadowPoint(null);
      setDiscardPolyline(false);
    }
  }, [polylineMode, currentPolyline, discardPolyline, dispatch]);

  return {
    polylineMode,
    currentPolyline,
    shadowPoint,
    handleMouseMove,
    handleCanvasClick,
  };
};

export default usePolyline;
