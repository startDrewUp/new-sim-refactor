// src/components/Canvas.js

import React, { useEffect, useCallback } from "react";
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
  setTransform,
  selectPolyline,
  deselectItems,
} from "../redux/slices/layoutSlice";
import useDeleteKey from "../hooks/useDeleteKey";

const Canvas = () => {
  const dispatch = useDispatch();

  // Utilize the useCanvas hook to get all necessary refs and handlers
  const {
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
    gridLines,
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
    handleCanvasClick, // Provided by useCanvas
    handleItemMouseDown,
    handlePolylineMouseDown,
    handleKeyDown,
  } = useCanvas();

  // Handler for selecting a polyline
  const handleSelect = useCallback(
    (id) => {
      dispatch(selectPolyline(id));
    },
    [dispatch]
  );

  // Effect to handle keydown events (e.g., delete key)
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Effect to handle adding a new item based on addItemRequest
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

      const pixelsPerUnit = 10; // Adjust if necessary
      const itemWidthPx = newItem.width * pixelsPerUnit;
      const itemHeightPx = newItem.height * pixelsPerUnit;

      const x = worldPoint.x - itemWidthPx / 2;
      const y = worldPoint.y - itemHeightPx / 2;

      dispatch(addItem({ ...newItem, x, y, id: uuidv4() }));
      dispatch(clearAddItemRequest());
    }
  }, [addItemRequest, svgRef, gRef, dispatch]);

  // Effect to handle fit to view requests
  const fitToViewRequest = useSelector(
    (state) => state.layout.fitToViewRequest
  );
  const { items: layoutItems, polylines: layoutPolylines } = useSelector(
    (state) => state.layout
  );
  useEffect(() => {
    if (fitToViewRequest && svgRef.current && gRef.current) {
      if (layoutItems.length === 0 && layoutPolylines.length === 0) {
        dispatch(clearFitToViewRequest());
        return;
      }

      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

      const pixelsPerUnit = 10; // Adjust if necessary

      // Include items in bounding box calculation
      layoutItems.forEach((item) => {
        const itemWidth = item.width * pixelsPerUnit;
        const itemHeight = item.height * pixelsPerUnit;

        minX = Math.min(minX, item.x);
        minY = Math.min(minY, item.y);
        maxX = Math.max(maxX, item.x + itemWidth);
        maxY = Math.max(maxY, item.y + itemHeight);
      });

      // Include polylines in bounding box calculation
      layoutPolylines.forEach((polyline) => {
        polyline.points.forEach((point) => {
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

      dispatch(clearFitToViewRequest());
    }
  }, [fitToViewRequest, svgRef, gRef, layoutItems, layoutPolylines, dispatch]);

  // Handler to deselect all items when clicking outside
  // No longer declaring handleCanvasClick here since it's provided by useCanvas

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
        onWheel={handleWheel}
        onMouseDown={handleMouseDown} // Use 'handleMouseDown' from useCanvas
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick} // Handle canvas clicks for deselection
      >
        <g
          ref={gRef}
          transform={`scale(${
            transform.scale
          }) translate(${-transform.x}, ${-transform.y})`}
        >
          {gridLines} {/* Render gridLines generated by useCanvas */}
          {items.map((item) => (
            <CanvasItem
              key={item.id}
              item={item}
              isSelected={selectedItems.has(item.id)}
              onSelect={toggleItemSelection}
              onEdit={() => handleEditItem(item)} // Trigger edit on edit action
              handleItemMouseDown={handleItemMouseDown}
              transform={transform}
            />
          ))}
          {polylines.map((polyline) => (
            <Polyline
              key={polyline.id}
              polyline={polyline}
              isSelected={selectedItems.has(polyline.id)}
              onSelect={handleSelect} // Pass the correct handler
              handlePolylineMouseDown={handlePolylineMouseDown}
              transform={transform} // Correctly passing transform
            />
          ))}
          {polylineMode && (
            <Polyline
              polyline={{
                id: `shadow-${uuidv4()}`, // Assign a unique ID with 'shadow-' prefix
                points: [...currentPolyline, shadowPoint].filter(Boolean),
              }}
              isActive={true}
              isShadow={true}
              onSelect={() => {}} // Pass a no-op function to prevent runtime error
              handlePolylineMouseDown={handlePolylineMouseDown} // Pass handlePolylineMouseDown
              transform={transform} // Correctly passing transform
            />
          )}
        </g>
      </svg>
      {/* Render ItemEditDialog with appropriate props */}
      <ItemEditDialog
        item={editingItem}
        open={!!editingItem}
        onClose={handleCloseEdit}
      />
    </Box>
  );
};

export default Canvas;
