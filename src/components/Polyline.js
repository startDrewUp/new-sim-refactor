// src/components/Polyline.js

import React, { useMemo } from "react";
import PropTypes from "prop-types";

const Polyline = ({
  polyline,
  isSelected = false,
  onSelect,
  handlePolylineMouseDown,
  transform,
  isActive = false,
  isShadow = false,
}) => {
  const { id, points } = polyline;

  // useMemo to filter valid points unconditionally
  const validPoints = useMemo(() => {
    return points.filter(
      (point) =>
        point && typeof point.x === "number" && typeof point.y === "number"
    );
  }, [points]);

  // useMemo to construct path data unconditionally
  const pathData = useMemo(() => {
    return validPoints.reduce((acc, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `${acc} L ${point.x} ${point.y}`;
    }, "");
  }, [validPoints]);

  // Early safety check for 'transform'
  if (
    !transform ||
    typeof transform.scale !== "number" ||
    typeof transform.x !== "number" ||
    typeof transform.y !== "number"
  ) {
    console.error("Invalid or missing 'transform' prop in Polyline component.");
    return null;
  }

  // Early exit based on polyline type
  if (isShadow) {
    if (validPoints.length < 1) return null; // Allow one point for shadow
  } else {
    if (validPoints.length < 2) return null; // Require two points for regular polylines
  }

  const handleMouseDown = (e) => {
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

  return (
    <g
      onMouseDown={handleMouseDown}
      className="canvas-polyline"
      style={{ cursor: isActive ? "crosshair" : "move" }}
      tabIndex={0} // Makes the group focusable via keyboard
      role="button" // Defines the role for accessibility
      aria-label="Polyline" // Provides an accessible name
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
        stroke={isSelected ? "blue" : isActive ? "#FF0000" : "#0000FF"}
        strokeWidth={
          isShadow
            ? 1 / transform.scale
            : isSelected || isActive
            ? 2 / transform.scale
            : 1 / transform.scale
        }
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={isShadow ? "5,5" : "none"}
        opacity={isShadow ? 0.5 : 1}
      />
      {validPoints.map((point, index) => (
        <circle
          key={`${point.x}-${point.y}-${index}`} // Ensures unique keys
          cx={point.x}
          cy={point.y}
          r={4 / transform.scale}
          fill={isSelected ? "blue" : isActive ? "#FF0000" : "#0000FF"}
          opacity={isShadow ? 0.5 : 1}
        />
      ))}
    </g>
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
  }).isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired, // Ensure this is always a function
  handlePolylineMouseDown: PropTypes.func.isRequired,
  transform: PropTypes.shape({
    scale: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  isActive: PropTypes.bool,
  isShadow: PropTypes.bool,
};

export default React.memo(Polyline);
