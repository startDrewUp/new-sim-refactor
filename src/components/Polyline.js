// src/components/Polyline.js

import React from "react";

const Polyline = ({
  polyline,
  isSelected = false,
  onSelect,
  handlePolylineMouseDown,
  transform,
  isActive = false,
  isShadow = false,
}) => {
  const points = polyline.points;
  if (!points || points.length < 2) return null;

  const validPoints = points.filter(
    (point) =>
      point && typeof point.x === "number" && typeof point.y === "number"
  );

  if (validPoints.length < 2) return null;

  const pathData = validPoints.reduce((acc, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    return `${acc} L ${point.x} ${point.y}`;
  }, "");

  const handleMouseDown = (e) => {
    if (!isActive) {
      e.stopPropagation();
      onSelect(polyline.id);
      handlePolylineMouseDown(e, polyline);
    }
  };

  return (
    <g
      onMouseDown={handleMouseDown}
      className="canvas-polyline"
      style={{ cursor: isActive ? "crosshair" : "move" }}
    >
      <path
        d={pathData}
        fill="none"
        stroke={isSelected ? "blue" : isActive ? "#FF0000" : "#0000FF"}
        strokeWidth={
          isActive
            ? 2 / transform.scale
            : isSelected
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
          key={index}
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

export default React.memo(Polyline);
