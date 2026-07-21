import { useRef, useState } from "react";

const useContentSideBar = () => {
  const drawerRef = useRef<HTMLInputElement | null>(null);

  const [opening, setOpening] = useState<boolean>(false);

  const handleOpen = () => {
    if (opening || drawerRef.current?.checked) return;

    setOpening(true);

    requestAnimationFrame(() => {
      if (drawerRef.current) {
        drawerRef.current.checked = true;
      }

      setTimeout(() => {
        setOpening(false);
      }, 300); // sesuaikan dengan durasi animasi drawer DaisyUI
    });
  };

  const handleClose = () => {
    if (drawerRef.current) {
      drawerRef.current.checked = false;
    }
  };

  return {
    drawerRef,
    handleOpen,
    handleClose,
  };
};

export default useContentSideBar;
