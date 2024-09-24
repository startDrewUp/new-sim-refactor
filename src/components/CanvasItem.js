// src/components/CanvasItem.js

import React from "react";
import PropTypes from "prop-types";

const CanvasItem = ({
  item,
  isSelected,
  onSelect,
  onEdit,
  handleItemMouseDown,
  transform,
}) => {
  const { id, x, y, width, height, label } = item;

  const handleDoubleClick = (e) => {
    e.preventDefault(); // Prevent any default double-click behavior
    e.stopPropagation(); // Prevent triggering other handlers
    onEdit(); // Invoke the edit handler passed from Canvas
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(id); // Invoke the select handler passed from Canvas
  };

  return (
    <g
      className="canvas-item"
      onMouseDown={(e) => handleItemMouseDown(e, item)}
      onDoubleClick={handleDoubleClick} // Handle double-click to edit
      onClick={handleClick} // Handle single click to select
      tabIndex={0} // Make focusable for accessibility
      role="button"
      aria-label={`Item ${id}`}
      aria-pressed={isSelected} // Indicate selection status
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onEdit();
        }
      }}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={isSelected ? "lightblue" : "grey"}
        stroke={isSelected ? "blue" : "black"}
        strokeWidth={2 / transform.scale}
      />
      {/* Optional: Add text or other visuals */}
      {label && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={12 / transform.scale}
          fill="black"
          pointerEvents="none" // Prevent text from capturing mouse events
        >
          {label}
        </text>
      )}
    </g>
  );
};

CanvasItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    label: PropTypes.string, // Optional
  }).isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  handleItemMouseDown: PropTypes.func.isRequired,
  transform: PropTypes.shape({
    scale: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
};

export default React.memo(CanvasItem);
