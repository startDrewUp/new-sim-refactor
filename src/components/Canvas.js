import React, { useEffect, useCallback, useRef } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import useCanvas from "../hooks/useCanvas";
import CanvasItem from "./CanvasItem";
import ItemEditDialog from "./ItemEditDialog";
import Polyline from "./Polyline";
import { v4 as uuidv4 } from "uuid";
import {
  addItem,
  clearAddItemRequest,
  clearFitToViewRequest,
  selectItems,
  selectSelectedItemId,
  selectFitToViewRequest,
  updateHistoryAction,
} from "../redux/slices/layoutSlice";
import { selectTransform } from "../redux/slices/transformSlice";
import {
  selectPolylineMode,
  selectPolylines,
  selectCurrentPolyline,
  selectSelectedPolylineId,
  finalizePolyline,
} from "../redux/slices/polylineSlice";
import { selectGridSize, selectSnapToGrid } from "../redux/slices/gridSlice";
import useDeleteKey from "../hooks/useDeleteKey";
import useItemEditing from "../hooks/useItemEditing";
import useFitToView from "../hooks/useFitToView";
import usePolyline from "../hooks/usePolyline";

const Canvas = () => {
  const dispatch = useDispatch();
  const transform = useSelector(selectTransform);
  const layoutItems = useSelector(selectItems);
  const layoutPolylines = useSelector(selectPolylines);
  const selectedItemId = useSelector(selectSelectedItemId);
  const selectedPolylineId = useSelector(selectSelectedPolylineId);
  const gridSize = useSelector(selectGridSize);
  const snapToGrid = useSelector(selectSnapToGrid);
  const fitToViewRequest = useSelector(selectFitToViewRequest);
  const polylineState = useSelector((state) => state.polyline);

  const {
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
    handleItemMouseDown,
    handleKeyDown,
  } = useCanvas();

  const {
    handleCanvasClick,
    handlePolylineFinalize,
    handlePolylineSelect,
    handlePolylineMouseDown,
    handleCanvasMouseMove,
    polylineMode,
    currentPolyline,
    shadowPoint,
  } = usePolyline(svgRef, gRef);

  const {
    editingItem,
    handleEditItem,
    handleCloseEdit: handleCloseEditItem,
  } = useItemEditing();

  const handleDeleteKey = useDeleteKey();
  const fitToView = useFitToView(svgRef, gRef);

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

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    window.addEventListener("keydown", handleDeleteKey);
    return () => {
      window.removeEventListener("keydown", handleDeleteKey);
    };
  }, [handleDeleteKey]);

  useEffect(() => {
    dispatch(updateHistoryAction(polylineState));
  }, [dispatch, polylineState]);

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

  useEffect(() => {
    if (fitToViewRequest) {
      fitToView();
      dispatch(clearFitToViewRequest());
    }
  }, [fitToViewRequest, fitToView, dispatch]);

  const handleCanvasClickWrapper = useCallback(
    (e) => {
      if (polylineMode) {
        handleCanvasClick(e);
      } else {
        toggleItemSelection(null);
      }
      handleCanvasMouseMove(e);
    },
    [
      handleCanvasClick,
      handleCanvasMouseMove,
      polylineMode,
      toggleItemSelection,
    ]
  );

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && polylineMode) {
        dispatch(finalizePolyline());
      }
    },
    [dispatch, polylineMode]
  );

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleKeyPress]);

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
        onClick={handleCanvasClickWrapper}
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
              onEdit={handleEditItem}
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
              onSelect={handlePolylineSelect}
              handlePolylineMouseDown={handlePolylineMouseDown}
              transform={transform}
            />
          ))}
          {currentPolyline.length > 0 && (
            <Polyline
              polyline={{
                id: "current",
                points: currentPolyline,
                strokeColor: "red",
                strokeWidth: 2,
                strokeDasharray: "5,5",
                isClosed: false,
              }}
              isActive={true}
              transform={transform}
              handlePolylineMouseDown={() => {}}
            />
          )}
          {shadowPoint && currentPolyline.length > 0 && (
            <line
              x1={currentPolyline[currentPolyline.length - 1].x}
              y1={currentPolyline[currentPolyline.length - 1].y}
              x2={shadowPoint.x}
              y2={shadowPoint.y}
              stroke="red"
              strokeWidth={2 / transform.scale}
              strokeDasharray="5,5"
            />
          )}
        </g>
      </svg>
      <ItemEditDialog
        item={editingItem}
        open={!!editingItem}
        onClose={handleCloseEditItem}
      />
    </Box>
  );
};

export default Canvas;
