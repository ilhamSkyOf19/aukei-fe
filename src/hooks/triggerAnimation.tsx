import type { RefObject } from "react";

const triggerAnimation = (
  ref: RefObject<HTMLButtonElement | null>,
  animation = "animate-pop-in-active",
) => {
  if (!ref.current) return;

  ref.current.classList.remove(animation);

  // force reflow
  void ref.current.offsetWidth;

  ref.current.classList.add(animation);
};

export default triggerAnimation;
