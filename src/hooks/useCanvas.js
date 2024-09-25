// src/hooks/useCanvas.js

import { useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectItem,
  selectItems,
  selectSelectedItemId,
} from "../redux/slices/layoutSlice";
import useGridLines from "./useGridLines";
import usePanning from "./usePanning";
import useDeleteKey from "./useDeleteKey";
import useFitToView from "./useFitToView";
import useZoom from "./useZoom";
import useItemDrag from "./useItemDrag";
import usePolyline from "./usePolyline";
import useViewBox from "./useViewBox";

const useCanvas = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const selectedItemId = useSelector(selectSelectedItemId);

  const svgRef = useRef(null);
  const gRef = useRef(null);
  const containerRef = useRef(null);

  const { viewBox, updateViewBox } = useViewBox(containerRef);
  const { isDragging, handlePanStart, handlePanMove, handlePanEnd } =
    usePanning();
  const handleDeleteKey = useDeleteKey();
  const fitToView = useFitToView(svgRef, gRef);
  const { handleWheel } = useZoom(svgRef);
  const { handleItemMouseDown } = useItemDrag();
  const {
    handleCanvasClick,
    handlePolylineMouseDown,
    handlePolylineSelect,
    polylineMode,
  } = usePolyline(svgRef, gRef);

  const gridLines = useGridLines(viewBox);

  const handleMouseDown = useCallback(
    (e) => {
      if (e.button === 1) {
        // Middle mouse button
        handlePanStart(e);
      }
    },
    [handlePanStart]
  );

  const handleMouseMove = useCallback(
    (e) => {
      handlePanMove(e);
    },
    [handlePanMove]
  );

  const handleMouseUp = useCallback(() => {
    handlePanEnd();
  }, [handlePanEnd]);

  const toggleItemSelection = useCallback(
    (id) => {
      dispatch(selectItem(id));
    },
    [dispatch]
  );

  return {
    svgRef,
    gRef,
    containerRef,
    viewBox,
    isDragging,
    gridLines,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    toggleItemSelection,
    handleCanvasClick,
    handleItemMouseDown,
    handlePolylineMouseDown,
    handlePolylineSelect,
    handleDeleteKey,
    fitToView,
    polylineMode,
    updateViewBox,
  };
};

export default useCanvas;
