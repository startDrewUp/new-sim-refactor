// src/hooks/useViewBox.js

import { useState, useEffect, useCallback } from "react";

const useViewBox = (containerRef) => {
  const [viewBox, setViewBox] = useState({
    x: 0,
    y: 0,
    width: 1000,
    height: 1000,
  });

  const updateViewBox = useCallback(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setViewBox({ x: 0, y: 0, width, height });
    }
  }, [containerRef]);

  useEffect(() => {
    updateViewBox();
    window.addEventListener("resize", updateViewBox);
    return () => window.removeEventListener("resize", updateViewBox);
  }, [updateViewBox]);

  return { viewBox, updateViewBox };
};

export default useViewBox;
