// src/components/CanvasItem.js

import React from "react";

const CanvasItem = ({
  item,
  isSelected,
  onSelect,
  onEdit,
  handleItemMouseDown,
  transform,
}) => {
  const handleMouseDown = (e) => {
    e.stopPropagation();
    onSelect(item.id);
    handleItemMouseDown(e, item);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    onEdit(item);
  };

  const pixelsPerUnit = 10;
  const width = item.width * pixelsPerUnit;
  const height = item.height * pixelsPerUnit;

  return (
    <g
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      style={{ cursor: "move" }}
      className="canvas-item"
    >
      <rect
        x={item.x}
        y={item.y}
        width={width}
        height={height}
        fill={item.color}
        stroke={isSelected ? "blue" : "black"}
        strokeWidth={isSelected ? 2 / transform.scale : 1 / transform.scale}
      />
      <text
        x={item.x + width / 2}
        y={item.y + height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={`${12 / transform.scale}px`}
        fill="black"
        pointerEvents="none"
      >
        {item.name}
      </text>
      <text
        x={item.x + width / 2}
        y={item.y + height + 15 / transform.scale}
        textAnchor="middle"
        fontSize={`${10 / transform.scale}px`}
        fill="black"
        pointerEvents="none"
      >
        {`${item.width}'x${item.height}'`}
      </text>
    </g>
  );
};

export default React.memo(CanvasItem);
