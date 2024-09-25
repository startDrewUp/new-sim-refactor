// src/components/Polyline.js

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePolylinePoint,
  removePointFromPolyline,
} from "../redux/slices/polylineSlice";

const Polyline = ({
  polyline,
  isSelected = false,
  onSelect,
  handlePolylineMouseDown,
  transform,
  isActive = false,
  isShadow = false,
  shadowPoint, // Added shadowPoint prop
}) => {
  const dispatch = useDispatch();
  const { id, points, strokeColor, strokeWidth, strokeDasharray, isClosed } =
    polyline;

  const snapToGrid = useSelector((state) => state.grid.snapToGrid);
  const gridSize = useSelector((state) => state.grid.gridSize);

  const validPoints = useMemo(() => {
    return points.filter(
      (point) =>
        point && typeof point.x === "number" && typeof point.y === "number"
    );
  }, [points]);

  const pathData = useMemo(() => {
    let data = validPoints.reduce((acc, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `${acc} L ${point.x} ${point.y}`;
    }, "");

    if (!isShadow && isClosed) {
      data += " Z"; // Close the path for polygons
    }

    return data;
  }, [validPoints, isClosed, isShadow]);

  if (
    !transform ||
    typeof transform.scale !== "number" ||
    typeof transform.x !== "number" ||
    typeof transform.y !== "number"
  ) {
    console.error("Invalid or missing 'transform' prop in Polyline component.");
    return null;
  }

  if (isShadow) {
    if (validPoints.length < 1) return null;
  } else {
    if (validPoints.length < 2) return null;
  }

  const handleMouseDownInternal = (e) => {
    if (!isActive) {
      e.stopPropagation();
      if (typeof onSelect === "function") {
        onSelect(id);
      } else {
        console.warn(
          `onSelect prop is not a function for Polyline with id: ${id}`
        );
      }
      handlePolylineMouseDown(e, polyline);
    }
  };

  // Handle dragging of polyline points
  const handlePointDrag = (index, e) => {
    e.stopPropagation();
    const svgElement = e.target.ownerSVGElement;
    const gElement = svgElement.querySelector("g");

    if (!svgElement || !gElement) return;

    const point = svgElement.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;

    const transformedPoint = point.matrixTransform(
      gElement.getScreenCTM().inverse()
    );

    let newPoint = {
      x: transformedPoint.x,
      y: transformedPoint.y,
    };

    // Snap to grid if enabled
    if (snapToGrid) {
      const gridSizePx = gridSize; // Assuming gridSize is in pixels
      newPoint = {
        x: Math.round(newPoint.x / gridSizePx) * gridSizePx,
        y: Math.round(newPoint.y / gridSizePx) * gridSizePx,
      };
    }

    dispatch(updatePolylinePoint({ polylineId: id, index, newPoint }));
  };

  // Handle double-click to remove a point
  const handlePointDoubleClick = (index, e) => {
    e.stopPropagation();
    dispatch(removePointFromPolyline({ polylineId: id, index }));
  };

  return (
    <>
      <g
        onMouseDown={handleMouseDownInternal}
        className="canvas-polyline"
        style={{
          cursor: isActive ? "crosshair" : "move",
          transition: "stroke-width 0.2s, stroke 0.2s",
        }}
        tabIndex={0}
        role="button"
        aria-label="Polyline"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (typeof onSelect === "function") {
              onSelect(id);
            } else {
              console.warn(
                `onSelect prop is not a function for Polyline with id: ${id}`
              );
            }
            handlePolylineMouseDown(e, polyline);
          }
        }}
      >
        <path
          d={pathData}
          fill="none"
          stroke={
            isSelected
              ? strokeColor || "blue"
              : isActive
              ? "#FF0000"
              : strokeColor || "#0000FF"
          }
          strokeWidth={strokeWidth / transform.scale}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={strokeDasharray}
          opacity={isShadow ? 0.5 : 1}
        />
        {isActive && shadowPoint && validPoints.length > 0 && (
          <line
            x1={validPoints[validPoints.length - 1].x}
            y1={validPoints[validPoints.length - 1].y}
            x2={shadowPoint.x}
            y2={shadowPoint.y}
            stroke="#FF0000"
            strokeWidth={1 / transform.scale}
            strokeDasharray="4,2"
          />
        )}
        {validPoints.map((point, index) => (
          <circle
            key={`${point.x}-${point.y}-${index}`}
            cx={point.x}
            cy={point.y}
            r={6 / transform.scale}
            fill={isSelected ? "blue" : isActive ? "#FF0000" : "#0000FF"}
            opacity={isShadow ? 0.5 : 1}
            onMouseDown={(e) => {
              // Start dragging the point
              const onMouseMove = (moveEvent) => {
                handlePointDrag(index, moveEvent);
              };

              const onMouseUp = () => {
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
              };

              window.addEventListener("mousemove", onMouseMove);
              window.addEventListener("mouseup", onMouseUp);
            }}
            onDoubleClick={(e) => handlePointDoubleClick(index, e)}
            style={{ cursor: "pointer" }}
            tabIndex={0}
            aria-label={`Point ${index + 1} of polyline ${id}`}
            onKeyDown={(e) => {
              if (e.key === "Delete") {
                handlePointDoubleClick(index, e);
              }
            }}
          />
        ))}
      </g>
    </>
  );
};

Polyline.propTypes = {
  polyline: PropTypes.shape({
    id: PropTypes.string.isRequired,
    points: PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      })
    ).isRequired,
    strokeColor: PropTypes.string,
    strokeWidth: PropTypes.number,
    strokeDasharray: PropTypes.string,
    isClosed: PropTypes.bool,
  }).isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  handlePolylineMouseDown: PropTypes.func.isRequired,
  transform: PropTypes.shape({
    scale: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  isActive: PropTypes.bool,
  isShadow: PropTypes.bool,
  shadowPoint: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }), // Added shadowPoint prop
};

export default React.memo(Polyline);
