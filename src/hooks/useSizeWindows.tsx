import { useEffect, useState } from "react";

const useSizeWindows = (): "sm" | "md" | "lg" => {
  const [windowSize, setWindowSize] = useState<"sm" | "md" | "lg">("sm");

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setWindowSize("sm");
      } else if (width < 1024) {
        setWindowSize("md");
      } else {
        setWindowSize("lg");
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

export default useSizeWindows;
