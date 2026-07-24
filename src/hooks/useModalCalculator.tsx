import { type SetStateAction } from "react";
import useModal from "./useModal";
import type { ErrorType } from "../types/constant.type";

const useModalCalculator = (params: {
  setIsErrors?: (value: SetStateAction<ErrorType[]>) => void;
}) => {
  const { setIsErrors } = params;
  //   use modal calculator
  const {
    modalRef: modalCalculatorRef,
    handleShowModal: showModalCalculator,
    handleCloseModal: handleCloseModalCalculator,
  } = useModal();

  // handle show modal calculator
  const handleShowModalCalculator = () => {
    // clear error
    setIsErrors?.((prev) =>
      prev.filter((item) => item !== "DATA_DI_BAYAR_KOSONG"),
    );
    showModalCalculator();
  };

  return {
    modalCalculatorRef,
    handleCloseModalCalculator,
    handleShowModalCalculator,
  };
};

export default useModalCalculator;
