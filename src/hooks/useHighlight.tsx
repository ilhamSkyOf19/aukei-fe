import { useRef, useState } from "react";
import { useClickOutside } from "./useClickOutSide";

const useHighlight = () => {
  // state is active aksi
  const [isHighlight, setIsHighlight] = useState<number>(0);

  // handle is active
  const handleSetIsHighlight = (index: number) => setIsHighlight(index);

  // use ref
  const wrapperRef = useRef<HTMLDivElement>(null);

  // use click outside
  useClickOutside({
    ref: wrapperRef,
    callback: () => {
      if (isHighlight !== 0) {
        handleSetIsHighlight(0);
      } else {
        return;
      }
    },
  });

  return { isHighlight, handleSetIsHighlight, wrapperRef };
};

export default useHighlight;
