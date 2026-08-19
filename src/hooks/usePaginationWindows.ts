import { useEffect, useState } from "react";

export const usePaginationWindow = () => {
  const [windowSize, setWindowSize] = useState(7);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setWindowSize(3);
      } else if (width < 1024) {
        setWindowSize(5);
      } else {
        setWindowSize(7);
      }
    };

    updateSize();

    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return windowSize;
};
