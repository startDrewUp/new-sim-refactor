// src/hooks/useZoom.js

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTransform, selectTransform } from "../redux/slices/transformSlice";

const useZoom = (svgRef) => {
  const dispatch = useDispatch();
  const transform = useSelector(selectTransform);

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const { deltaY } = e;
      const scaleFactor = deltaY > 0 ? 0.9 : 1.1;

      const svgElement = svgRef.current;
      const rect = svgElement.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      const pointBeforeZoom = {
        x: offsetX / transform.scale + transform.x,
        y: offsetY / transform.scale + transform.y,
      };

      const newScale = transform.scale * scaleFactor;

      const pointAfterZoom = {
        x: offsetX / newScale + transform.x,
        y: offsetY / newScale + transform.y,
      };

      dispatch(
        setTransform({
          scale: newScale,
          x: transform.x + (pointBeforeZoom.x - pointAfterZoom.x),
          y: transform.y + (pointBeforeZoom.y - pointAfterZoom.y),
        })
      );
    },
    [dispatch, transform, svgRef]
  );

  return { handleWheel };
};

export default useZoom;
