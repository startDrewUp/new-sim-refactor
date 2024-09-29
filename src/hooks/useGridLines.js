import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  selectShowGrid,
  selectGridSize,
  selectGridOpacity,
  selectGridColor,
} from "../redux/slices/gridSlice";
import { selectTransform } from "../redux/slices/transformSlice";

const useGridLines = (viewBox) => {
  const showGrid = useSelector(selectShowGrid);
  const gridSize = useSelector(selectGridSize);
  const gridOpacity = useSelector(selectGridOpacity);
  const gridColor = useSelector(selectGridColor);
  const transform = useSelector(selectTransform);

  const gridLines = useMemo(() => {
    if (!showGrid || !viewBox) return null;

    const gridSizePx = gridSize * 10; // 10 pixels per foot
    const { scale, x: translateX, y: translateY } = transform;

    // Calculate the visible area in world coordinates
    const visibleLeft = translateX - viewBox.width / (2 * scale);
    const visibleRight = translateX + viewBox.width / (2 * scale);
    const visibleTop = translateY - viewBox.height / (2 * scale);
    const visibleBottom = translateY + viewBox.height / (2 * scale);

    // Add extra padding to ensure grid covers the entire screen
    const padding = Math.max(viewBox.width, viewBox.height) / scale;
    
    // Calculate grid line positions
    const startX = Math.floor((visibleLeft - padding) / gridSizePx) * gridSizePx;
    const endX = Math.ceil((visibleRight + padding) / gridSizePx) * gridSizePx;
    const startY = Math.floor((visibleTop - padding) / gridSizePx) * gridSizePx;
    const endY = Math.ceil((visibleBottom + padding) / gridSizePx) * gridSizePx;

    const lines = [];

    // Vertical lines
    for (let x = startX; x <= endX; x += gridSizePx) {
      lines.push(
        <line
          key={`v${x}`}
          x1={x}
          y1={startY}
          x2={x}
          y2={endY}
          stroke={gridColor}
          strokeWidth={1 / scale}
          opacity={gridOpacity}
        />
      );
    }

    // Horizontal lines
    for (let y = startY; y <= endY; y += gridSizePx) {
      lines.push(
        <line
          key={`h${y}`}
          x1={startX}
          y1={y}
          x2={endX}
          y2={y}
          stroke={gridColor}
          strokeWidth={1 / scale}
          opacity={gridOpacity}
        />
      );
    }

    return lines;
  }, [viewBox, transform, gridSize, gridColor, gridOpacity, showGrid]);

  return gridLines;
};

export default useGridLines;