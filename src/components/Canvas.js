// src/components/Canvas.js

import React, { useEffect } from "react";
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
} from "../redux/slices/layoutSlice";
import useItemDrag from "../hooks/useItemDrag";
import usePolylineDrag from "../hooks/usePolylineDrag";
import useDeleteKey from "../hooks/useDeleteKey";
import useItemSelection from "../hooks/useItemSelection";

const Canvas = () => {
  const dispatch = useDispatch();

  // Hooks from useCanvas
  const {
    svgRef,
    gRef,
    containerRef,
    viewBox,
    transform,
    isDragging,
    polylineMode,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCanvasClick,
  } = useCanvas();

  const addItemRequest = useSelector((state) => state.layout.addItemRequest);
  const fitToViewRequest = useSelector(
    (state) => state.layout.fitToViewRequest
  );
  const items = useSelector((state) => state.layout.items);
  const polylines = useSelector((state) => state.layout.polylines);
  const currentPolyline = useSelector((state) => state.layout.currentPolyline);
  const shadowPoint = useSelector((state) => state.layout.shadowPoint);
  const gridLines = useSelector((state) => state.layout.gridLines);
  const gridSize = useSelector((state) => state.layout.gridSize);
  const snapToGrid = useSelector((state) => state.layout.snapToGrid);

  // Use useItemSelection hook
  const { selectedItems, toggleItemSelection, clearSelection } =
    useItemSelection();

  // Use useItemDrag hook
  const { handleItemMouseDown } = useItemDrag(
    svgRef,
    gRef,
    snapToGrid,
    gridSize
  );

  // Use usePolylineDrag hook
  const { handlePolylineMouseDown } = usePolylineDrag(
    svgRef,
    gRef,
    snapToGrid,
    gridSize
  );

  // Use useDeleteKey hook
  const handleKeyDown = useDeleteKey(selectedItems);

  // Effect to handle keydown events
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Effect to handle adding a new item
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

  // Effect to handle fit to view
  useEffect(() => {
    if (fitToViewRequest && svgRef.current && gRef.current) {
      if (items.length === 0 && polylines.length === 0) {
        dispatch(clearFitToViewRequest());
        return;
      }

      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

      const pixelsPerUnit = 10; // Adjust if necessary

      // Include items in bounding box calculation
      items.forEach((item) => {
        const itemWidth = item.width * pixelsPerUnit;
        const itemHeight = item.height * pixelsPerUnit;

        minX = Math.min(minX, item.x);
        minY = Math.min(minY, item.y);
        maxX = Math.max(maxX, item.x + itemWidth);
        maxY = Math.max(maxY, item.y + itemHeight);
      });

      // Include polylines in bounding box calculation
      polylines.forEach((polyline) => {
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
  }, [fitToViewRequest, svgRef, gRef, items, polylines, dispatch]);

  // Handle canvas mouse down to clear selection or initiate panning
  const handleCanvasMouseDown = (e) => {
    // If middle mouse button is pressed, initiate panning
    if (e.button === 1) {
      handleMouseDown(e);
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
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <g
          ref={gRef}
          transform={`scale(${
            transform.scale
          }) translate(${-transform.x}, ${-transform.y})`}
        >
          {gridLines}
          {items.map((item) => (
            <CanvasItem
              key={item.id}
              item={item}
              isSelected={selectedItems.has(item.id)}
              onSelect={toggleItemSelection}
              onEdit={() => {}}
              handleItemMouseDown={handleItemMouseDown}
              transform={transform}
            />
          ))}
          {polylines.map((polyline) => (
            <Polyline
              key={polyline.id}
              polyline={polyline}
              isSelected={selectedItems.has(polyline.id)}
              onSelect={toggleItemSelection}
              handlePolylineMouseDown={handlePolylineMouseDown}
              transform={transform}
            />
          ))}
          {polylineMode && (
            <Polyline
              polyline={{
                points: [...currentPolyline, shadowPoint].filter(Boolean),
              }}
              isActive
              isShadow={true}
            />
          )}
        </g>
      </svg>
      <ItemEditDialog item={null} open={false} onClose={() => {}} />
    </Box>
  );
};

export default Canvas;
