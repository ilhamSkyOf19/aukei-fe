import useModal from "../../../hooks/useModal";
import { useAuthStore } from "../../../stores/authStore";

const useDashboard = () => {
  // get pengguna
  const pengguna = useAuthStore((state) => state.pengguna);

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

  return {
    handleShowModalFeature,
    handleCloseModalFeature,
    modalShadowFeatureRef,
    pengguna,
    handleRedirectWa,
  };
};

export default useDashboard;
