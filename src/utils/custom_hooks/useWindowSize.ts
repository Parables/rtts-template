import { useState, useEffect } from "react";
// Define general type for useWindowSize hook, which includes width and height
export interface Size {
  width: number | undefined;
  height: number | undefined;
}

// Hook
/**
 * Returns the Size(width, height) of the Window or the ref in pixels
 */
export function useWindowSize(ref?: React.RefObject<HTMLDivElement>): Size {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<Size>({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: ref?.current?.clientWidth ?? window.innerWidth,
        height: ref?.current?.clientWidth ?? window.innerHeight,
      });
    }
    // Add event listener
    ref ? ref.current?.addEventListener("resize", handleResize) : window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => ref ? ref.current?.removeEventListener("resize", handleResize) : window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}