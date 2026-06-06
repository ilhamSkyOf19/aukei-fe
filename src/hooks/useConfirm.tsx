import { useRef } from "react";
import useModal from "./useModal";

const useConfirm = () => {
  // use modal
  const { modalRef, handleShowModal, handleCloseModal } = useModal();

  // ref resolver
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  // show confirm
  const confirm = () => {
    // show modal
    handleShowModal();

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  };

  // handle confirm true
  const handleConfirm = () => {
    resolverRef.current?.(true);

    // close modal
    handleCloseModal();
  };

  // handle confirm false
  const handleCancel = () => {
    resolverRef.current?.(false);

    // close modal
    handleCloseModal();
  };

  return { modalRef, confirm, handleConfirm, handleCancel };
};

export default useConfirm;
