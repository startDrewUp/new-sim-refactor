import React from "react";
import PropTypes from "prop-types";

const CanvasItem = React.memo(({
  item,
  isSelected,
  onSelect,
  onEdit,
  handleItemMouseDown,
  transform,
  gridSize,
}) => {
  const { id, x, y, width, height, name, color } = item;
  const pixelsPerUnit = 10 * gridSize;

  return (
    <g
      className="canvas-item"
      onMouseDown={(e) => handleItemMouseDown(e, item)}
      onClick={() => onSelect(id)}
      onContextMenu={(e) => {
        e.preventDefault();
        onEdit(item);
      }}
      tabIndex={0}
      role="button"
      aria-label={`Item ${id}`}
      aria-pressed={isSelected}
    >
      <rect
        x={x}
        y={y}
        width={width * pixelsPerUnit}
        height={height * pixelsPerUnit}
        fill={color || (isSelected ? "lightblue" : "grey")}
        stroke={isSelected ? "blue" : "black"}
        strokeWidth={2 / transform.scale}
      />
      {name && (
        <text
          x={x + (width * pixelsPerUnit) / 2}
          y={y + (height * pixelsPerUnit) / 2}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={12 / transform.scale}
          fill="black"
          pointerEvents="none"
        >
          {name}
        </text>
      )}
    </g>
  );
});

CanvasItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    name: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  handleItemMouseDown: PropTypes.func.isRequired,
  transform: PropTypes.shape({
    scale: PropTypes.number.isRequired,
  }).isRequired,
  gridSize: PropTypes.number.isRequired,
};

export default CanvasItem;