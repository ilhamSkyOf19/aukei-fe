import { type SetStateAction } from "react";
import useModal from "./useModal";
import type { ErrorType } from "../types/constant.type";

const useModalTempo = (params: {
  setIsErrors: (value: SetStateAction<ErrorType[]>) => void;
}) => {
  const { setIsErrors } = params;
  //   use modal Tempo
  const {
    modalRef: modalTempoRef,
    handleShowModal: showModalTempo,
    handleCloseModal: handleCloseModalTempo,
  } = useModal();

  // handle show modal tempo
  const handleShowModalTempo = () => {
    // clear error
    setIsErrors((prev) => prev.filter((item) => item !== "DATA_TEMPO_KOSONG"));
    showModalTempo();
  };
  return {
    modalTempoRef,
    handleCloseModalTempo,
    handleShowModalTempo,
  };
};

export default useModalTempo;
