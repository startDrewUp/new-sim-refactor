// src/components/Canvas.js

import React, { useEffect, useCallback, useRef } from "react";
import { Box } from "@mui/material";
import useCanvas from "../hooks/useCanvas";
import CanvasItem from "./CanvasItem";
import ItemEditDialog from "./ItemEditDialog";
import Polyline from "./Polyline";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  clearAddItemRequest,
  clearFitToViewRequest,
  deselectItems,
  selectItems,
  selectSelectedItemId,
} from "../redux/slices/layoutSlice";
import { setTransform, selectTransform } from "../redux/slices/transformSlice";
import {
  addPolylinePoint,
  finalizePolyline,
  setPolylineMode,
  undoPolylinePoint,
  redoPolylinePoint,
  discardPolyline,
  selectPolylineMode,
  selectPolylines,
  selectCurrentPolyline,
  selectSelectedPolylineId,
  selectPolyline, // Ensure this action is exported from polylineSlice.js
} from "../redux/slices/polylineSlice";
import { selectGridSize, selectSnapToGrid } from "../redux/slices/gridSlice"; // Import from gridSlice.js
import useDeleteKey from "../hooks/useDeleteKey";
import useItemEditing from "../hooks/useItemEditing"; // Import the hook

const Canvas = () => {
  const dispatch = useDispatch();
  const transform = useSelector(selectTransform);
  const layoutItems = useSelector(selectItems);
  const layoutPolylines = useSelector(selectPolylines);
  const currentPolyline = useSelector(selectCurrentPolyline);
  const polylineMode = useSelector(selectPolylineMode);
  const selectedItemId = useSelector(selectSelectedItemId);
  const selectedPolylineId = useSelector(selectSelectedPolylineId);
  const gridSize = useSelector(selectGridSize);
  const snapToGrid = useSelector(selectSnapToGrid);

  const {
    svgRef,
    gRef,
    containerRef,
    viewBox,
    isDragging,
    gridLines,
    shadowPoint,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    toggleItemSelection,
    handleCloseEdit, // We'll remove handleEditItem from useCanvas
    handleCanvasClick,
    handleItemMouseDown,
    handlePolylineMouseDown,
    handleKeyDown,
  } = useCanvas();

  // Initialize useItemEditing
  const {
    editingItem,
    handleEditItem,
    handleCloseEdit: handleCloseEditItem,
  } = useItemEditing();

  const wheelListenerRef = useRef(null);

  useEffect(() => {
    const svgElement = svgRef.current;
    if (svgElement) {
      wheelListenerRef.current = (e) => handleWheel(e);
      svgElement.addEventListener("wheel", wheelListenerRef.current, {
        passive: false,
      });
    }
    return () => {
      if (svgElement && wheelListenerRef.current) {
        svgElement.removeEventListener("wheel", wheelListenerRef.current);
      }
    };
  }, [handleWheel]);

  const handleSelect = useCallback(
    (id) => {
      dispatch(selectPolyline(id));
    },
    [dispatch]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const addItemRequest = useSelector((state) => state.layout.addItemRequest);
  useEffect(() => {
    if (addItemRequest && svgRef.current && gRef.current) {
      const newItem = addItemRequest;
      const svgElement = svgRef.current;
      const gElement = gRef.current;

      const rect = svgElement.getBoundingClientRect();
      const centerXScreen = rect.width / 2;
      const centerYScreen = rect.height / 2;

      const point = svgElement.createSVGPoint();
      point.x = centerXScreen;
      point.y = centerYScreen;

      const ctm = gElement.getScreenCTM().inverse();
      const worldPoint = point.matrixTransform(ctm);

      const pixelsPerUnit = 10 * gridSize;
      const itemWidthPx = newItem.width * pixelsPerUnit;
      const itemHeightPx = newItem.height * pixelsPerUnit;

      const x = worldPoint.x - itemWidthPx / 2;
      const y = worldPoint.y - itemHeightPx / 2;

      dispatch(addItem({ ...newItem, x, y, id: uuidv4() }));
      dispatch(clearAddItemRequest());
    }
  }, [addItemRequest, svgRef, gRef, dispatch, gridSize]);

  const fitToViewRequest = useSelector(
    (state) => state.layout.fitToViewRequest
  );
  useEffect(() => {
    if (fitToViewRequest && svgRef.current && gRef.current) {
      // Implement fit to view logic here
      dispatch(clearFitToViewRequest());
    }
  }, [fitToViewRequest, svgRef, gRef, layoutItems, layoutPolylines, dispatch]);

  // Handle Undo and Redo via Toolbar or Keyboard Shortcuts
  useDeleteKey(() => {
    // Implement deletion logic if needed
  });

  return (
    <Box
      ref={containerRef}
      sx={{
        flexGrow: 1,
        height: "100%",
        display: "flex",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          cursor: isDragging ? "grabbing" : polylineMode ? "crosshair" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        <g
          ref={gRef}
          transform={`scale(${
            transform.scale
          }) translate(${-transform.x}, ${-transform.y})`}
        >
          {gridLines}
          {layoutItems.map((item) => (
            <CanvasItem
              key={item.id}
              item={item}
              isSelected={item.id === selectedItemId}
              onSelect={toggleItemSelection}
              onEdit={handleEditItem} // Use handleEditItem from useItemEditing
              handleItemMouseDown={handleItemMouseDown}
              transform={transform}
              gridSize={gridSize}
            />
          ))}
          {layoutPolylines.map((polyline) => (
            <Polyline
              key={polyline.id}
              polyline={polyline}
              isSelected={polyline.id === selectedPolylineId}
              onSelect={handleSelect}
              handlePolylineMouseDown={handlePolylineMouseDown}
              transform={transform}
            />
          ))}
          {currentPolyline.length > 0 && (
            <Polyline
              polyline={{ id: "current", points: currentPolyline }}
              isActive={true}
              transform={transform}
            />
          )}
          {shadowPoint && (
            <Polyline
              polyline={{
                id: "shadow",
                points: [...currentPolyline],
              }}
              isShadow={true}
              shadowPoint={shadowPoint} // Pass shadowPoint as a separate prop
              transform={transform}
            />
          )}
        </g>
      </svg>
      <ItemEditDialog
        item={editingItem} // Use editingItem from useItemEditing
        open={!!editingItem}
        onClose={handleCloseEditItem} // Use handleCloseEdit from useItemEditing
      />
    </Box>
  );
};

export default Canvas;
