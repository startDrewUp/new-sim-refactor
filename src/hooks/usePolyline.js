// src/hooks/usePolyline.js

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPolylineMode,
  addPolylinePoint,
  selectPolyline,
} from "../redux/slices/polylineSlice";

const usePolyline = (svgRef, gRef) => {
  const dispatch = useDispatch();
  const polylineMode = useSelector(selectPolylineMode);

  const handleCanvasClick = useCallback(
    (e) => {
      if (polylineMode) {
        const point = svgRef.current.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        const transformedPoint = point.matrixTransform(
          gRef.current.getScreenCTM().inverse()
        );
        dispatch(
          addPolylinePoint({ x: transformedPoint.x, y: transformedPoint.y })
        );
      }
    },
    [dispatch, polylineMode, svgRef, gRef]
  );

  const handlePolylineMouseDown = useCallback((e, polyline) => {
    // Implement polyline dragging if needed
    console.log("Polyline mouse down:", polyline);
  }, []);

  const handlePolylineSelect = useCallback(
    (id) => {
      dispatch(selectPolyline(id));
    },
    [dispatch]
  );

  return {
    handleCanvasClick,
    handlePolylineMouseDown,
    handlePolylineSelect,
    polylineMode,
  };
};

export default usePolyline;
