import { type RefObject, useEffect } from "react";

type UseClickOutsideProps<T extends HTMLElement> = {
  ref: RefObject<T | null>;
  callback: () => void;
};

export const useClickOutside = <T extends HTMLElement>({
  ref,
  callback,
}: UseClickOutsideProps<T>) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};
