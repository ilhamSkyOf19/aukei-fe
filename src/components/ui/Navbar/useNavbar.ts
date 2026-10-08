import { useAuthStore } from "../../../stores/authStore";
import useLogOut from "../../../hooks/useLogOut";
import useModal from "../../../hooks/useModal";
import { useToastAnimation } from "../../../hooks/useToast";

const useNavbar = () => {
  // auth
  const pengguna = useAuthStore((state) => state.pengguna);

  // handle logout
  const { handleLogout, isPendingLogout } = useLogOut({ redirectUrl: true });

  // handle toast
  const { handleSetToast, toast } = useToastAnimation();

  //   use modal update password
  const {
    handleCloseModal: handleCloseModalUpdatePassword,
    handleShowModal: handleShowModalUpdatePassowrd,
    modalRef: modalUpdatePasswordRef,
  } = useModal();

  //   use modal update password
  const {
    handleCloseModal: handleCloseModalUpdateDdataPengguna,
    handleShowModal: handleShowModalUpdateDataPengguna,
    modalRef: modalUpdateDataPenggunaRef,
  } = useModal();

  return {
    pengguna,
    handleLogout,
    isPendingLogout,
    handleShowModalUpdatePassowrd,
    handleCloseModalUpdatePassword,
    modalUpdatePasswordRef,

    handleShowModalUpdateDataPengguna,
    handleCloseModalUpdateDdataPengguna,
    modalUpdateDataPenggunaRef,

    handleSetToast,

    toast,
  };
};

export default useNavbar;
