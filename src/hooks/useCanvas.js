import { useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectTransform } from "../redux/slices/transformSlice";
import usePanning from "./usePanning";
import useZoom from "./useZoom";
import useViewBox from "./useViewBox";

const useCanvas = () => {
  const transform = useSelector(selectTransform);

  const svgRef = useRef(null);
  const gRef = useRef(null);
  const containerRef = useRef(null);

  const { viewBox, updateViewBox } = useViewBox(containerRef);
  const { isDragging, handlePanStart, handlePanMove, handlePanEnd } = usePanning();
  const { handleWheel } = useZoom(svgRef);

  const handleMouseDown = useCallback(
    (e) => {
      if (e.button === 1) {
        // Middle mouse button
        handlePanStart(e);
      }
    },
    [handlePanStart]
  );

  const handleMouseMove = useCallback(
    (e) => {
      handlePanMove(e);
    },
    [handlePanMove]
  );

  const handleMouseUp = useCallback(() => {
    handlePanEnd();
  }, [handlePanEnd]);

  return {
    svgRef,
    gRef,
    containerRef,
    viewBox,
    isDragging,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    updateViewBox,
  };
};

export default useCanvas;