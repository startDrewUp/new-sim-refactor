import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import useCanvas from "../hooks/useCanvas";
import CanvasItems from "./CanvasItems";
import CanvasBackground from "./CanvasBackground";
import ItemEditDialog from "./ItemEditDialog";
import useItemEditing from "../hooks/useItemEditing";
import { deleteSelectedItems, selectSelectedItemId } from "../redux/slices/layoutSlice";
import { selectTransform } from "../redux/slices/transformSlice";

const Canvas = () => {
  const dispatch = useDispatch();
  const selectedItemId = useSelector(selectSelectedItemId);
  const transform = useSelector(selectTransform);

  const {
    svgRef,
    gRef,
    containerRef,
    viewBox,
    isDragging,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useCanvas();

  const {
    editingItem,
    handleEditItem,
    handleCloseEdit,
  } = useItemEditing();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedItemId) {
          dispatch(deleteSelectedItems([selectedItemId]));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch, selectedItemId]);

  return (
    <Box
      ref={containerRef}
      sx={{
        flexGrow: 1,
        height: "100%",
        display: "flex",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <g
          ref={gRef}
          transform={`scale(${transform.scale}) translate(${-transform.x}, ${-transform.y})`}
        >
          <CanvasBackground viewBox={viewBox} />
          <CanvasItems onEditItem={handleEditItem} />
        </g>
      </svg>
      <ItemEditDialog
        item={editingItem}
        open={!!editingItem}
        onClose={handleCloseEdit}
      />
    </Box>
  );
};

export default Canvas;