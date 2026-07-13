import { useEffect, useRef, useState } from "react";
import useModal from "./useModal";

const useConfirm = <T = undefined,>() => {
  const { modalRef, handleShowModal, handleCloseModal } = useModal();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [data, setData] = useState<T | undefined>(undefined);

  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = (data?: T) => {
    setData(data);
    handleShowModal();

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  };

  const handleConfirm = () => {
    resolverRef.current?.(true);
    resolverRef.current = null;

    handleCloseModal();
    setData(undefined);
  };

  const clearData = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setData(undefined);
    }, 300);
  };

  const handleCancel = () => {
    resolverRef.current?.(false);
    resolverRef.current = null;

    handleCloseModal();
    clearData();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    modalRef,
    data,
    confirm,
    handleConfirm,
    handleCancel,
  };
};

export default useConfirm;
