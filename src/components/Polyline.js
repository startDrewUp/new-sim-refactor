import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { updatePolyline, deletePolyline } from "../redux/slices/polylineSlice";
import { selectSnapToGrid, selectGridSize } from "../redux/slices/gridSlice";

const Polyline = ({
  polyline,
  isSelected = false,
  onSelect,
  handlePolylineMouseDown,
  transform,
  isActive = false,
  isShadow = false,
}) => {
  const dispatch = useDispatch();
  const { id, points, strokeColor, strokeWidth, strokeDasharray, isClosed } =
    polyline;

  const snapToGrid = useSelector(selectSnapToGrid);
  const gridSize = useSelector(selectGridSize);

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

  if (!transform || typeof transform.scale !== "number") {
    console.error("Invalid transform prop in Polyline component.");
    return null;
  }

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

    if (snapToGrid) {
      const gridSizePx = gridSize;
      newPoint = {
        x: Math.round(newPoint.x / gridSizePx) * gridSizePx,
        y: Math.round(newPoint.y / gridSizePx) * gridSizePx,
      };
    }

    const newPoints = [...points];
    newPoints[index] = newPoint;

    dispatch(updatePolyline({ id, changes: { points: newPoints } }));
  };

  const handlePointDoubleClick = (index, e) => {
    e.stopPropagation();
    const newPoints = points.filter((_, i) => i !== index);
    if (newPoints.length < 2) {
      dispatch(deletePolyline(id));
    } else {
      dispatch(updatePolyline({ id, changes: { points: newPoints } }));
    }
  };

  return (
    <g
      onMouseDown={(e) => handlePolylineMouseDown(e, polyline)}
      className="canvas-polyline"
      style={{ cursor: isActive ? "crosshair" : "move" }}
    >
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
            r={6 / transform.scale}
            fill={isSelected ? "blue" : "#0000FF"}
            opacity={isShadow ? 0.5 : 1}
            onMouseDown={(e) => {
              const onMouseMove = (moveEvent) =>
                handlePointDrag(index, moveEvent);
              const onMouseUp = () => {
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
              };
              window.addEventListener("mousemove", onMouseMove);
              window.addEventListener("mouseup", onMouseUp);
            }}
            onDoubleClick={(e) => handlePointDoubleClick(index, e)}
            style={{ cursor: "pointer" }}
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
  onSelect: PropTypes.func,
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
