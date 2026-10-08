import { KeyRound, LogOut, PanelRightClose, UserPen } from "lucide-react";
import { type FC } from "react";
import { cn } from "../../../utils/cn";
import ButtonTheme from "../button/ButtonTheme";
import { ROLE_INTERNAL_TYPE } from "../../../types/constant.type";
import Notifikasi from "./Notifikasi";
import ButtonWithIcon from "../button/ButtonWithIcon";
import useNavbar from "./useNavbar";
import ModalFormulirUpdatePassword from "../../modals/ModalUpdatePassword";
import ModalUpdateDataPengguna from "../../modals/ModalUpdateDataPengguna";
import Toast from "../../messages/Toast";
type Props = {
  handleSidebar: () => void;
  isClose: boolean;
  title: string;
};
const Navbar: FC<Props> = ({ handleSidebar, isClose, title }: Props) => {
  const {
    handleLogout,
    isPendingLogout,
    pengguna,
    handleCloseModalUpdatePassword,
    handleShowModalUpdatePassowrd,
    modalUpdatePasswordRef,

    handleCloseModalUpdateDdataPengguna,
    handleShowModalUpdateDataPengguna,
    modalUpdateDataPenggunaRef,

    handleSetToast,

    toast,
  } = useNavbar();
  return (
    <nav
      className={cn(
        "navbar w-full bg-base-100 shadow-sm flex flex-row justify-between items-center top-0 border-b border-base-content/10 sticky z-10",
        pengguna?.role === ROLE_INTERNAL_TYPE.KASIR &&
          // (currentPathname.includes("kasir") ||
          //   currentPathname.includes("keranjang") ||
          //   currentPathname.includes("kredit")) &&
          "lg:hidden",
      )}
      style={{ minHeight: "2.5rem" }}
    >
      {toast && toast.type === "updated_data_pengguna" && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={"Data Anda berhasil diperbarui."}
          color={"info"}
        />
      )}

      <div className="w-full flex flex-row justify-between items-center">
        <div className="flex-2 flex flex-row justify-start items-center">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
            onClick={() => handleSidebar()}
          >
            {/* Sidebar toggle icon */}
            <PanelRightClose
              className={cn(
                "size-6 text-base-content",
                !isClose && "lg:rotate-180",
              )}
            />
          </label>
          <h1 className="text-base-content px-4 font-medium capitalize text-sm lg:font-semibold">
            {title}
          </h1>
        </div>
        <div className="flex-1 flex flex-row justify-end items-center gap-2 lg:gap-6 pr-2">
          {/* notifikasi */}
          {pengguna?.role === ROLE_INTERNAL_TYPE.OWNER && (
            <Notifikasi pengguna={pengguna} />
          )}

          {/* button theme */}
          <ButtonTheme />

          {/* button ubah password  */}
          {pengguna?.role === ROLE_INTERNAL_TYPE.OWNER && (
            <>
              <div className="hidden md:flex flex-row justify-start items-center gap-2.5">
                <button
                  type="button"
                  className="cursor-pointer p-2 hover:bg-custom-primary/50 rounded-full transition-all duration-150 ease-in-out relative"
                  onClick={() => handleShowModalUpdatePassowrd()}
                >
                  <KeyRound className="text-base-content size-5" />
                </button>

                <button
                  type="button"
                  className="cursor-pointer p-2 hover:bg-custom-primary/50 rounded-full transition-all duration-150 ease-in-out relative"
                  onClick={() => handleShowModalUpdateDataPengguna()}
                >
                  <UserPen className="text-base-content size-5" />
                </button>
              </div>

              <div className="dropdown dropdown-bottom dropdown-left">
                <div
                  tabIndex={0}
                  role="button"
                  className="cursor-pointer p-2 hover:bg-custom-primary/50 rounded-full transition-all duration-150 ease-in-out relative flex justify-center items-center md:hidden"
                >
                  <UserPen className="text-base-content size-5" />
                </div>

                <ul
                  tabIndex={-1}
                  className="dropdown-content menu bg-base-100 rounded-box z-1 w-50 p-2 shadow-sm"
                >
                  <li>
                    <button
                      type="button"
                      onClick={() => handleShowModalUpdatePassowrd()}
                      className="flex flex-row justify-start items-center "
                    >
                      <KeyRound className="text-base-content size-4" />
                      <span className="text-sm">Ubah Password</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleShowModalUpdateDataPengguna()}
                      className="flex flex-row justify-start items-center"
                    >
                      <UserPen className="text-base-content size-4" />
                      <span className="text-sm">Ubah Data</span>
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* nama & role */}
          <div className="hidden md:flex flex-col justify-start items-start border-r border-base-content/30 pr-4">
            <span className="text-xs font-semibold text-base-content capitalize">
              {pengguna?.nama}
            </span>
            <span className="text-xs capitalize text-base-content">
              {pengguna?.role.toLowerCase()}
            </span>
          </div>

          {/* button logout */}
          <div className="hidden md:flex">
            <ButtonWithIcon
              icon={LogOut}
              label="Keluar"
              bgColor="bg-error"
              textColor="text-primary-white"
              handleBtn={() => handleLogout()}
              isLoading={isPendingLogout}
            />
          </div>
        </div>
      </div>

      {/* modal formulir ubah password  */}
      <ModalFormulirUpdatePassword
        handleCloseModal={handleCloseModalUpdatePassword}
        modalRef={modalUpdatePasswordRef}
      />

      <ModalUpdateDataPengguna
        handleCloseModal={handleCloseModalUpdateDdataPengguna}
        modalRef={modalUpdateDataPenggunaRef}
        handleSetToast={handleSetToast}
      />
    </nav>
  );
};

export default Navbar;
