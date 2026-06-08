import { useRef, useState } from "react";

const useModal = <T = undefined,>() => {
  // state
  const [idModal, setIdModal] = useState<number | undefined>(undefined);

  // state data delete
  const [dataModal, setDataModal] = useState<T | undefined>(undefined);

  // ref
  const modalRef = useRef<HTMLDialogElement | null>(null);

  // handle show modal
  const handleShowModal = (id?: number, data?: T) => {
    if (modalRef.current) {
      setIdModal(id || 0);
      setDataModal(data);
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
    dataModal,
  };
};

export default useModal;
