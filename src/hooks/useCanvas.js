// src/hooks/useCanvas.js

import { useRef } from "react";
import { useSelector } from "react-redux";
import useZoom from "./useZoom";
import usePanning from "./usePanning";
import usePolyline from "./usePolyline";
import useGridLines from "./useGridLines"; // Import the useGridLines hook
import useViewBox from "./useViewBox";
import useItemSelection from "./useItemSelection";
import useItemEditing from "./useItemEditing";
import useItemDrag from "./useItemDrag";
import useDeleteKey from "./useDeleteKey";
import usePolylineDrag from "./usePolylineDrag";

const useCanvas = () => {
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const containerRef = useRef(null);

  const { items, transform, polylines, gridSize, snapToGrid, gridOpacity } =
    useSelector((state) => state.layout);

  const viewBox = useViewBox(containerRef);

  const { handleWheel } = useZoom(svgRef);

  const {
    isDragging,
    handleMouseDown: handlePanningMouseDown,
    handleMouseMove: handlePanningMouseMove,
    handleMouseUp: handlePanningMouseUp,
  } = usePanning();

  const { handleItemMouseDown } = useItemDrag(
    svgRef,
    gRef,
    snapToGrid,
    gridSize
  );

  const { handlePolylineMouseDown } = usePolylineDrag(
    svgRef,
    gRef,
    snapToGrid,
    gridSize
  );

  const {
    polylineMode,
    currentPolyline,
    shadowPoint,
    handleMouseMove: handlePolylineMouseMove,
    handleCanvasClick,
  } = usePolyline(svgRef, gRef);

  const gridLines = useGridLines(viewBox); // Generate gridLines using the hook

  const { selectedItems, toggleItemSelection, clearSelection } =
    useItemSelection();

  const { editingItem, handleEditItem, handleCloseEdit } = useItemEditing();

  const handleKeyDown = useDeleteKey(selectedItems);

  // Combine mouse event handlers
  const handleMouseMove = (e) => {
    handlePanningMouseMove(e);
    handlePolylineMouseMove(e);
  };

  const handleMouseUp = (e) => {
    handlePanningMouseUp(e);
  };

  const handleMouseDown = (e) => {
    // If middle mouse button is pressed, initiate panning
    if (e.button === 1) {
      handlePanningMouseDown(e);
      return;
    }

    // If in polyline mode and left mouse button is pressed
    if (polylineMode && e.button === 0) {
      handleCanvasClick(e);
      return;
    }

    // If clicked on an item or polyline
    if (
      e.target.closest(".canvas-item") ||
      e.target.closest(".canvas-polyline")
    ) {
      // Do nothing here since handleItemMouseDown or handlePolylineMouseDown is called directly
    } else {
      // If left mouse button is pressed, deselect all items
      if (e.button === 0) {
        clearSelection();
      }
    }
  };

  return {
    svgRef,
    gRef,
    containerRef,
    viewBox,
    transform,
    isDragging,
    polylineMode,
    items,
    polylines,
    selectedItems,
    editingItem,
    gridLines, // Return gridLines
    currentPolyline,
    shadowPoint,
    gridSize,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    toggleItemSelection,
    handleEditItem,
    handleCloseEdit,
    handleCanvasClick,
    handleItemMouseDown,
    handlePolylineMouseDown,
    handleKeyDown,
  };
};

export default useCanvas;
