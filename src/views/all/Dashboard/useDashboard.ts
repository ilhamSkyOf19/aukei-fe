import { useState } from "react";
import useModal from "../../../hooks/useModal";
import { useAuthStore } from "../../../stores/authStore";
import { useShadowStore } from "../../../stores/shadowStore";
import { useToastAnimation } from "../../../hooks/useToast";

const useDashboard = () => {
  // get pengguna
  const pengguna = useAuthStore((state) => state.pengguna);

  // get shadow feature
  const { shadowIsActive, shadowId } = useShadowStore((state) => state);

  // toast
  const { handleSetToast, toast } = useToastAnimation();

  // is active animation shadow
  const [isActiveAnimationShadow, setIsActiveAnimationShadow] =
    useState<boolean>(false);

  const handleisActiveAnimationShadow = (value: boolean) => {
    setIsActiveAnimationShadow(value);
  };

  // handle redirect wa
  const handleRedirectWa = () => {
    return window.open("https://wa.me/6285896890881", "_blank");
  };

  // use modal
  const {
    modalRef: modalShadowFeatureRef,
    handleShowModal: handleShowModalFeature,
    handleCloseModal: handleCloseModalFeature,
  } = useModal();

  // use modal create shadow transaction
  const {
    modalRef: modalShadowTransactionRef,
    handleShowModal: handleShowModalShadowTransaction,
    handleCloseModal: handleCloseModalShadowTransaction,
  } = useModal();

  return {
    handleShowModalFeature,
    handleCloseModalFeature,
    modalShadowFeatureRef,
    pengguna,
    handleRedirectWa,
    isActiveAnimationShadow,
    handleisActiveAnimationShadow,
    shadowIsActive,
    shadowId,

    handleShowModalShadowTransaction,
    handleCloseModalShadowTransaction,
    modalShadowTransactionRef,

    handleSetToast,
    toast,
  };
};

export default useDashboard;
