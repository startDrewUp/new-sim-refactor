import React, { useMemo, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePolyline,
  selectPolyline,
  updatePolylinePosition,
} from "../redux/slices/polylineSlice";
import { selectSnapToGrid, selectGridSize } from "../redux/slices/gridSlice";

const Polyline = ({
  polyline,
  isSelected = false,
  transform,
  isActive = false,
  isShadow = false,
}) => {
  const dispatch = useDispatch();
  const { id, points, strokeColor, strokeWidth, strokeDasharray, isClosed } =
    polyline;

  const snapToGrid = useSelector(selectSnapToGrid);
  const gridSize = useSelector(selectGridSize);

  const [isDraggingPolyline, setIsDraggingPolyline] = useState(false);

  const pathData = useMemo(() => {
    if (!points || points.length < 2) return "";

    let data = points.reduce((acc, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `${acc} L ${point.x} ${point.y}`;
    }, "");

    if (!isShadow && isClosed) {
      data += " Z";
    }

    return data;
  }, [points, isClosed, isShadow]);

  const handlePolylineMouseDown = useCallback(
    (e) => {
      if (isDraggingPolyline) return;
      e.stopPropagation();
      dispatch(selectPolyline(id));
      setIsDraggingPolyline(true);

      const startX = e.clientX;
      const startY = e.clientY;

      const handleMouseMove = (moveEvent) => {
        const dx = (moveEvent.clientX - startX) / transform.scale;
        const dy = (moveEvent.clientY - startY) / transform.scale;

        if (snapToGrid) {
          const gridSizePx = gridSize * 10;
          const snappedDx = Math.round(dx / gridSizePx) * gridSizePx;
          const snappedDy = Math.round(dy / gridSizePx) * gridSizePx;
          dispatch(
            updatePolylinePosition({ id, dx: snappedDx, dy: snappedDy })
          );
        } else {
          dispatch(updatePolylinePosition({ id, dx, dy }));
        }
      };

      const handleMouseUp = () => {
        setIsDraggingPolyline(false);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [dispatch, id, transform.scale, snapToGrid, gridSize, isDraggingPolyline]
  );

  const handlePointDrag = useCallback(
    (index, e) => {
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const startPoint = points[index];

      const handleMouseMove = (moveEvent) => {
        const dx = (moveEvent.clientX - startX) / transform.scale;
        const dy = (moveEvent.clientY - startY) / transform.scale;

        let newX = startPoint.x + dx;
        let newY = startPoint.y + dy;

        if (snapToGrid) {
          const gridSizePx = gridSize * 10;
          newX = Math.round(newX / gridSizePx) * gridSizePx;
          newY = Math.round(newY / gridSizePx) * gridSizePx;
        }

        const newPoints = [...points];
        newPoints[index] = { x: newX, y: newY };

        dispatch(updatePolyline({ id, changes: { points: newPoints } }));
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [dispatch, id, points, snapToGrid, gridSize, transform.scale]
  );

  return (
    <g
      className="canvas-polyline"
      style={{
        cursor: isActive
          ? "crosshair"
          : isDraggingPolyline
          ? "grabbing"
          : "grab",
      }}
    >
      <path
        d={pathData}
        fill="none"
        stroke={isSelected ? "blue" : strokeColor || "#0000FF"}
        strokeWidth={(strokeWidth + 10) / transform.scale}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={strokeDasharray}
        opacity={0.01}
        onMouseDown={handlePolylineMouseDown}
      />
      <path
        d={pathData}
        fill="none"
        stroke={isSelected ? "blue" : strokeColor || "#0000FF"}
        strokeWidth={strokeWidth / transform.scale}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={strokeDasharray}
        opacity={isShadow ? 0.5 : 1}
      />
      {!isShadow &&
        points &&
        points.map((point, index) => (
          <circle
            key={`${id}-point-${index}`}
            cx={point.x}
            cy={point.y}
            r={(6 + 10) / transform.scale}
            fill="transparent"
            stroke="transparent"
            opacity={1}
            onMouseDown={(e) => {
              e.stopPropagation();
              handlePointDrag(index, e);
            }}
            style={{ cursor: "pointer" }}
          />
        ))}
      {!isShadow &&
        points &&
        points.map((point, index) => (
          <circle
            key={`${id}-visible-point-${index}`}
            cx={point.x}
            cy={point.y}
            r={6 / transform.scale}
            fill={isSelected ? "blue" : "#0000FF"}
            opacity={isShadow ? 0.5 : 1}
            pointerEvents="none"
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
    strokeColor: PropTypes.string,
    strokeWidth: PropTypes.number,
    strokeDasharray: PropTypes.string,
    isClosed: PropTypes.bool,
  }).isRequired,
  isSelected: PropTypes.bool,
  transform: PropTypes.shape({
    scale: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  isActive: PropTypes.bool,
  isShadow: PropTypes.bool,
};

export default React.memo(Polyline);
