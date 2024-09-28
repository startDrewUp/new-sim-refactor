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
    if (!showGrid) return null;

    const gridSizePx = gridSize * 10; // 10 pixels per foot
    const s = transform.scale;
    const x = transform.x;
    const y = transform.y;
    const width = viewBox.width;
    const height = viewBox.height;

    // Calculate the visible area in world coordinates
    const x_min = x - (0.5 * width) / s;
    const x_max = x + (1.5 * width) / s;
    const y_min = y - (0.5 * height) / s;
    const y_max = y + (1.5 * height) / s;

    const startX = Math.floor(x_min / gridSizePx) * gridSizePx;
    const endX = Math.ceil(x_max / gridSizePx) * gridSizePx;
    const startY = Math.floor(y_min / gridSizePx) * gridSizePx;
    const endY = Math.ceil(y_max / gridSizePx) * gridSizePx;

    const lines = [];

    for (let gridX = startX; gridX <= endX; gridX += gridSizePx) {
      lines.push(
        <line
          key={`v${gridX}`}
          x1={gridX}
          y1={startY}
          x2={gridX}
          y2={endY}
          stroke={gridColor}
          strokeWidth={1 / transform.scale}
          opacity={gridOpacity}
        />
      );
    }
    for (let gridY = startY; gridY <= endY; gridY += gridSizePx) {
      lines.push(
        <line
          key={`h${gridY}`}
          x1={startX}
          y1={gridY}
          x2={endX}
          y2={gridY}
          stroke={gridColor}
          strokeWidth={1 / transform.scale}
          opacity={gridOpacity}
        />
      );
    }
    return lines;
  }, [viewBox, transform, gridSize, gridColor, gridOpacity, showGrid]);

  return gridLines;
};

export default useGridLines;