// src/hooks/usePolylineDrag.js

import { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updatePolylinePosition } from "../redux/slices/polylineSlice";

const usePolylineDrag = (svgRef, gRef, snapToGrid, gridSize) => {
  const dispatch = useDispatch();
  const [draggingPolyline, setDraggingPolyline] = useState(null);

  const handlePolylineMouseDown = useCallback(
    (e, polyline) => {
      e.stopPropagation();

      const svgElement = svgRef.current;
      const gElement = gRef.current;

      if (!svgElement || !gElement || !polyline) return;

      const point = svgElement.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;

      const transformedPoint = point.matrixTransform(
        gElement.getScreenCTM().inverse()
      );

      setDraggingPolyline({
        id: polyline.id,
        startX: transformedPoint.x,
        startY: transformedPoint.y,
        originalPoints: polyline.points.map((p) => ({ ...p })),
      });
    },
    [svgRef, gRef]
  );

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggingPolyline) {
        const svgElement = svgRef.current;
        const gElement = gRef.current;

        if (!svgElement || !gElement) return;

        const point = svgElement.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;

        const transformedPoint = point.matrixTransform(
          gElement.getScreenCTM().inverse()
        );

        let dx = transformedPoint.x - draggingPolyline.startX;
        let dy = transformedPoint.y - draggingPolyline.startY;

        // Snap to grid if enabled
        if (snapToGrid) {
          const gridSizePx = gridSize * 10; // Assuming 10 pixels per unit
          dx = Math.round(dx / gridSizePx) * gridSizePx;
          dy = Math.round(dy / gridSizePx) * gridSizePx;
        }

        const newPoints = draggingPolyline.originalPoints.map((p) => ({
          x: p.x + dx,
          y: p.y + dy,
        }));

        dispatch(
          updatePolylinePosition({ id: draggingPolyline.id, points: newPoints })
        );
      }
    };

    const handleMouseUp = () => {
      if (draggingPolyline) {
        setDraggingPolyline(null);
      }
    };

    if (draggingPolyline) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingPolyline, svgRef, gRef, snapToGrid, gridSize, dispatch]);

  return {
    handlePolylineMouseDown,
  };
};

export default usePolylineDrag;
