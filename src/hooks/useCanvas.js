// src/hooks/useCanvas.js

import { useRef, useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectItem,
  updateItemPosition,
  selectItems,
  selectSelectedItemId,
} from "../redux/slices/layoutSlice";
import { selectTransform, setTransform } from "../redux/slices/transformSlice";
import {
  selectGridSize,
  selectShowGrid,
  selectSnapToGrid,
} from "../redux/slices/gridSlice";
import {
  selectPolylineMode,
  addPolylinePoint,
} from "../redux/slices/polylineSlice";
import useGridLines from "./useGridLines";

const useCanvas = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const selectedItemId = useSelector(selectSelectedItemId);
  const transform = useSelector(selectTransform);
  const gridSize = useSelector(selectGridSize);
  const showGrid = useSelector(selectShowGrid);
  const snapToGrid = useSelector(selectSnapToGrid);
  const polylineMode = useSelector(selectPolylineMode);

  const svgRef = useRef(null);
  const gRef = useRef(null);
  const containerRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [viewBox, setViewBox] = useState({
    x: 0,
    y: 0,
    width: 1000,
    height: 1000,
  });

  useEffect(() => {
    const updateViewBox = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setViewBox({ x: 0, y: 0, width, height });
      }
    };

    updateViewBox();
    window.addEventListener("resize", updateViewBox);
    return () => window.removeEventListener("resize", updateViewBox);
  }, []);

  const gridLines = useGridLines(viewBox);

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
    [dispatch, transform]
  );

  const handleMouseDown = useCallback((e) => {
    if (e.button === 1 || e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        const dx = (e.clientX - dragStart.x) / transform.scale;
        const dy = (e.clientY - dragStart.y) / transform.scale;

        dispatch(
          setTransform({
            ...transform,
            x: transform.x - dx,
            y: transform.y - dy,
          })
        );

        setDragStart({ x: e.clientX, y: e.clientY });
      }
    },
    [isDragging, dragStart, dispatch, transform]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const toggleItemSelection = useCallback(
    (id) => {
      dispatch(selectItem(id));
    },
    [dispatch]
  );

  const handleEditItem = useCallback((item) => {
    console.log("Editing item:", item);
  }, []);

  const handleCloseEdit = useCallback(() => {
    dispatch(selectItem(null));
  }, [dispatch]);

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
      } else {
        dispatch(selectItem(null));
      }
    },
    [dispatch, polylineMode]
  );

  const handleItemMouseDown = useCallback(
    (e, item) => {
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;

      const handleMouseMove = (moveEvent) => {
        const dx = (moveEvent.clientX - startX) / transform.scale;
        const dy = (moveEvent.clientY - startY) / transform.scale;

        let newX = item.x + dx;
        let newY = item.y + dy;

        if (snapToGrid) {
          newX = Math.round(newX / gridSize) * gridSize;
          newY = Math.round(newY / gridSize) * gridSize;
        }

        dispatch(updateItemPosition({ id: item.id, x: newX, y: newY }));
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [dispatch, transform.scale, snapToGrid, gridSize]
  );

  const handlePolylineMouseDown = useCallback((e, polyline) => {
    // Implement polyline dragging if needed
  }, []);

  const handleKeyDown = useCallback((e) => {
    // Implement key press handlers if needed
  }, []);

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
    handleEditItem,
    handleCloseEdit,
    handleCanvasClick,
    handleItemMouseDown,
    handlePolylineMouseDown,
    handleKeyDown,
  };
};

export default useCanvas;
