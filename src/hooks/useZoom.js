// src/hooks/useZoom.js
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTransform } from "../redux/slices/layoutSlice";

const useZoom = (svgRef) => {
  const dispatch = useDispatch();
  const transform = useSelector((state) => state.layout.transform);

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();

      const svgElement = svgRef.current;

      // Get the bounding rectangle of the SVG element
      const rect = svgElement.getBoundingClientRect();
      const { left, top } = rect;

      // Get the mouse position relative to the SVG element
      const mouseX = e.clientX - left;
      const mouseY = e.clientY - top;

      // Determine the scale factor
      const scaleFactor = e.deltaY < 0 ? 1.1 : 0.9;

      // Calculate the new scale, clamped between min and max values
      const newScale = Math.min(
        Math.max(transform.scale * scaleFactor, 0.1),
        10
      );

      // Compute the world coordinates before zooming
      const worldX = mouseX / transform.scale + transform.x;
      const worldY = mouseY / transform.scale + transform.y;

      // Compute the new translation to keep the world point under the cursor stationary
      const newX = worldX - mouseX / newScale;
      const newY = worldY - mouseY / newScale;

      // Dispatch the new transform
      dispatch(
        setTransform({
          scale: newScale,
          x: newX,
          y: newY,
        })
      );
    },
    [dispatch, svgRef, transform]
  );

  return { handleWheel };
};

export default useZoom;
