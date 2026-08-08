import { useEffect, useRef, useState } from "react";
import useModal from "./useModal";

type ConfirmOptions = {
  disableCloseAfterSubmit?: boolean;
};

const useConfirm = <T = undefined,>() => {
  const {
    modalRef,
    handleShowModal,
    handleCloseModal: closeModal,
  } = useModal();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [data, setData] = useState<T | undefined>(undefined);

  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const disableCloseAfterSubmitRef = useRef<boolean>(false);

  // handle final close modal
  const handleCloseModal = () => {
    closeModal();
    setData(undefined);
  };

  const confirm = (data?: T, options?: ConfirmOptions) => {
    setData(data);

    disableCloseAfterSubmitRef.current =
      options?.disableCloseAfterSubmit ?? false;

    handleShowModal();

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  };

  const handleConfirm = () => {
    resolverRef.current?.(true);
    resolverRef.current = null;

    if (disableCloseAfterSubmitRef.current) {
      return;
    }

    handleCloseModal();
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
    handleCloseModal,
  };
};

export default useConfirm;
