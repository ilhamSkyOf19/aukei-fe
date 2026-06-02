import { useEffect, useRef, useState, type RefObject } from "react";

type UseHasScrollTypeReturn = {
  divRef: RefObject<HTMLDivElement | null>;
  hasScroll: boolean;
};

const useHasScroll = (): UseHasScrollTypeReturn => {
  const divRef = useRef<HTMLDivElement>(null);

  const [hasScroll, setHasScroll] = useState<boolean>(false);

  useEffect(() => {
    const el = divRef.current;
    if (!el) return;

    const check = () => setHasScroll(el.scrollHeight > el.clientHeight);

    const observer = new ResizeObserver(check);

    observer.observe(el);
    check(); // initial check

    return () => observer.disconnect();
  }, []);

  return { divRef, hasScroll };
};

export default useHasScroll;
