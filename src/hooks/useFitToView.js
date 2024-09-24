// src/hooks/useFitToView.js
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTransform } from "../redux/slices/layoutSlice";

const useFitToView = (svgRef, gRef) => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.layout.items);
  const polylines = useSelector((state) => state.layout.polylines);

  const fitToView = useCallback(() => {
    if (!svgRef.current || !gRef.current) return;

    if (items.length === 0 && polylines.length === 0) return;

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    // Calculate items bounding box
    items.forEach((item) => {
      const pixelsPerUnit = 10; // Adjust if necessary
      const itemWidth = item.width * pixelsPerUnit;
      const itemHeight = item.height * pixelsPerUnit;

      minX = Math.min(minX, item.x);
      minY = Math.min(minY, item.y);
      maxX = Math.max(maxX, item.x + itemWidth);
      maxY = Math.max(maxY, item.y + itemHeight);
    });

    // Include polylines
    polylines.forEach((polyline) => {
      polyline.forEach((point) => {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
      });
    });

    const bboxWidth = maxX - minX;
    const bboxHeight = maxY - minY;
    const bboxCenterX = minX + bboxWidth / 2;
    const bboxCenterY = minY + bboxHeight / 2;

    const svgElement = svgRef.current;
    const rect = svgElement.getBoundingClientRect();
    const viewportWidth = rect.width;
    const viewportHeight = rect.height;

    const scaleX = viewportWidth / bboxWidth;
    const scaleY = viewportHeight / bboxHeight;
    const newScale = Math.min(scaleX, scaleY) * 0.9;

    const newX = bboxCenterX - viewportWidth / 2 / newScale;
    const newY = bboxCenterY - viewportHeight / 2 / newScale;

    dispatch(
      setTransform({
        scale: newScale,
        x: newX,
        y: newY,
      })
    );
  }, [dispatch, items, polylines, svgRef, gRef]);

  return fitToView;
};

export default useFitToView;
