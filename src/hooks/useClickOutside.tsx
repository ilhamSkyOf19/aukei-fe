import { type RefObject, useEffect } from "react";

type UseClickOutsideProps = {
  refs: RefObject<HTMLElement | null>[];
  callback: () => void;
};

export const useClickOutside = ({ refs, callback }: UseClickOutsideProps) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const isInside = refs.some((ref) => ref.current?.contains(target));

      if (!isInside) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, callback]);
};
