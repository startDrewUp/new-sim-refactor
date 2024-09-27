import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPolylineMode,
  addPolylinePoint,
  finalizePolyline,
  selectPolyline,
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

  const handleCanvasClick = useCallback(
    (e) => {
      if (polylineMode) {
        e.stopPropagation();
        const point = svgRef.current.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        const transformedPoint = point.matrixTransform(
          gRef.current.getScreenCTM().inverse()
        );

        let newX = transformedPoint.x;
        let newY = transformedPoint.y;

        if (snapToGrid) {
          const gridSizePx = gridSize * 10;
          newX = Math.round(newX / gridSizePx) * gridSizePx;
          newY = Math.round(newY / gridSizePx) * gridSizePx;
        }

        dispatch(addPolylinePoint({ x: newX, y: newY }));
      }
    },
    [dispatch, polylineMode, svgRef, gRef, snapToGrid, gridSize]
  );

  const handlePolylineFinalize = useCallback(() => {
    if (currentPolyline.length > 1) {
      dispatch(finalizePolyline());
    }
  }, [dispatch, currentPolyline]);

  const handleCanvasMouseMove = useCallback(
    (e) => {
      if (polylineMode && currentPolyline.length > 0) {
        const point = svgRef.current.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        const transformedPoint = point.matrixTransform(
          gRef.current.getScreenCTM().inverse()
        );

        let newX = transformedPoint.x;
        let newY = transformedPoint.y;

        if (snapToGrid) {
          const gridSizePx = gridSize * 10;
          newX = Math.round(newX / gridSizePx) * gridSizePx;
          newY = Math.round(newY / gridSizePx) * gridSizePx;
        }

        setShadowPoint({ x: newX, y: newY });
      }
    },
    [polylineMode, currentPolyline, svgRef, gRef, snapToGrid, gridSize]
  );

  return {
    handleCanvasClick,
    handlePolylineFinalize,
    handleCanvasMouseMove,
    polylineMode,
    currentPolyline,
    shadowPoint,
  };
};

export default usePolyline;
