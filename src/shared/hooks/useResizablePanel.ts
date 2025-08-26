import { useCallback, useEffect, useState } from "react";

interface UseResizablePanelOptions {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  onWidthChange?: (width: number) => void;
}

export const useResizablePanel = ({
  initialWidth = 300,
  minWidth = 200,
  maxWidth = 600,
  onWidthChange,
}: UseResizablePanelOptions = {}) => {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
    console.log("handleMouseDown");
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const containerRect = document
        .querySelector("[data-app-container]")
        ?.getBoundingClientRect();
      console.log("containerRect", containerRect);
      if (containerRect) {
        const newWidth = containerRect.right - e.clientX;
        const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        console.log("clampedWidth", clampedWidth);
        setWidth(clampedWidth);
        onWidthChange?.(clampedWidth); // Appelle le callback
      }
    },
    [isResizing, minWidth, maxWidth, onWidthChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return {
    width,
    isResizing,
    handleMouseDown,
    resizeHandlers: {
      onMouseDown: handleMouseDown,
    },
  };
};
