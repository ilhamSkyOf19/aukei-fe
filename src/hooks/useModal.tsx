import { useRef, useState } from "react";

const useModal = () => {
  // state
  const [idModal, setIdModal] = useState<number | undefined>(undefined);

  // state data delete
  const [dataDelete, setDataDelete] = useState<any>("");

  // ref
  const modalRef = useRef<HTMLDialogElement | null>(null);

  // handle show modal
  const handleShowModal = (id?: number, data?: any) => {
    if (modalRef.current) {
      setIdModal(id || 0);
      setDataDelete(data);
      modalRef.current.showModal();
    }
  };

  // close modal
  const handleCloseModal = () => {
    if (modalRef.current) {
      setIdModal(undefined);
      modalRef.current.close();
    }
  };

  return {
    modalRef,
    handleCloseModal,
    handleShowModal,
    idModal,
    dataDelete,
  };
};

export default useModal;
