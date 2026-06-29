import {
  Bell,
  ChevronDown,
  LogOut,
  PanelRightClose,
  RefreshCw,
} from "lucide-react";
import { type FC } from "react";
import { useAuthStore } from "../../../stores/authStore";
import useNavbar from "./useNavbar";
import { cn } from "../../../utils/cn";
import ButtonTheme from "../button/ButtonTheme";
import { highlightName } from "../../../helpers/helpers";
import { ROLE_INTERNAL_TYPE } from "../../../types/constant.type";
import JenisNotifikasiProduk from "../JenisNotifikasiProduk";
type Props = {
  handleSidebar: () => void;
  isClose: boolean;
  title: string;
};
const Navbar: FC<Props> = ({ handleSidebar, isClose, title }: Props) => {
  // auth
  const pengguna = useAuthStore((state) => state.pengguna);

  // get use navbar
  const {
    handleLogout,
    isLoadingNotifikasiGlobal,
    notifikasiGlobal,
    dataNotifikasiProduk,
    refetchNotifikasi,
    isShowCountNotifikasi,
    setIsShowCountNotifikasi,
    navigate,
  } = useNavbar();

  return (
    <nav className="navbar w-full bg-base-100 shadow-sm flex flex-row justify-between items-center relative border-b border-base-content/10">
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
          <h1 className="text-base-content px-4 font-medium capitalize lg:text-lg text-sm lg:font-semibold">
            {title}
          </h1>
        </div>
        <div className="flex-1 flex flex-row justify-end items-center gap-2 lg:gap-6 pr-2">
          {/* notifikasi */}
          <div className="dropdown dropdown-end">
            <button
              type="button"
              tabIndex={0}
              role="button"
              className="cursor-pointer p-2 focus:bg-custom-primary/50 hover:bg-custom-primary/50 rounded-full transition-all duration-150 ease-in-out relative"
              onFocus={() => setIsShowCountNotifikasi(false)}
            >
              <Bell className="size-6 text-base-content" />

              {/* count */}
              {isShowCountNotifikasi &&
                dataNotifikasiProduk &&
                dataNotifikasiProduk?.length > 0 && (
                  <p className="absolute text-[0.625rem] -top-1 font-semibold bg-error w-4 h-4 flex flex-col justify-center items-center rounded-full right-0 text-primary-white">
                    {dataNotifikasiProduk?.length}
                  </p>
                )}
            </button>
            <ul
              tabIndex={-1}
              className="dropdown-content  overflow-hidden menu bg-base-100 rounded-box z-50 w-80 min-h-90 border border-base-content/10 lg:w-130 p-2 shadow-sm mt-1.5"
            >
              <li className="mb-1">
                <div className="w-full flex flex-row justify-between items-center hover:bg-transparent active:bg-transparent cursor-default ">
                  {/* title */}
                  <p className="text-xs font-semibold text-base-content">
                    Notifikasi
                  </p>

                  {/* action refresh */}
                  <button
                    type="button"
                    className={cn(
                      "cursor-pointer",
                      !isLoadingNotifikasiGlobal && "p-1",
                    )}
                    disabled={isLoadingNotifikasiGlobal}
                    onClick={() => refetchNotifikasi()}
                  >
                    {isLoadingNotifikasiGlobal ? (
                      <div className="loading-xs text-base-content loading" />
                    ) : (
                      <RefreshCw className="size-4 text-base-content" />
                    )}
                  </button>
                </div>
              </li>

              {/* choose */}
              <li className="mb-4 w-full">
                <div className="w-full flex scrollbar-thin flex-row py-2.5 gap-2.5 justify-start overflow-x-auto items-start hover:bg-transparent active:bg-transparent cursor-default ">
                  {Array.from({ length: 8 }, (_, index) => (
                    <button
                      key={index}
                      type="button"
                      className="px-2 py-1 bg-gray-200 rounded-lg text-base-content text-[0.7rem] hover:bg-gray-600 hover:text-primary-white transition-all duration-150 ease-in-out"
                    >
                      Produk
                    </button>
                  ))}
                </div>
              </li>

              {notifikasiGlobal?.data ? (
                dataNotifikasiProduk &&
                dataNotifikasiProduk.length > 0 &&
                dataNotifikasiProduk.map((data, _) => (
                  <li key={data.id}>
                    <button
                      disabled={pengguna?.role === ROLE_INTERNAL_TYPE.KASIR}
                      type="button"
                      className="w-full flex py-2.5 flex-row justify-between items-center"
                      onClick={() => {
                        navigate(`/dashboard/produk/${data.produk.id}`);
                        (document.activeElement as HTMLElement)?.blur();
                      }}
                    >
                      <div className="flex-2 flex flex-row justify-start items-start gap-3">
                        {/* img */}
                        <div className="w-11 h-11 rounded-md overflow-hidden">
                          <img
                            src={data.produk.img}
                            alt="foto produk"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* info */}
                        <div className="flex flex-col justify-start items-start">
                          <span className="font-semibold text-xs text-base-content">
                            {data.produk.nama}
                          </span>
                          <span className="text-[0.625rem] font-semibold text-base-content/50">
                            {data.produk.kode}
                          </span>
                        </div>
                      </div>

                      {/* status */}
                      <div className="flex-1 flex flex-row justify-end items-center">
                        <JenisNotifikasiProduk
                          jenisNotifikasi={data.jenisNotifikasiProduk}
                        />
                      </div>
                    </button>
                  </li>
                ))
              ) : (
                <li className="pointer-events-none">
                  <div className="w-full flex flex-col justify-center items-center h-20">
                    <span>Tidak ada notifikasi</span>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* profile */}
          <div className="dropdown dropdown-end hidden md:block">
            <button
              type="button"
              tabIndex={0}
              role="button"
              className="m-1 flex flex-row justify-start items-center"
            >
              {/* avatar */}
              <div className="avatar avatar-placeholder">
                <div className="bg-custom-primary text-neutral-content w-8 rounded-full">
                  <span className="text-xs lg:text-sm text-custom-secondary font-semibold uppercase">
                    {highlightName(pengguna?.nama ?? "")}
                  </span>
                </div>
              </div>

              {/* chevron */}
              <ChevronDown className="w-4 h-4 ml-2 text-base-content" />
            </button>
            <ul
              tabIndex={-1}
              className="dropdown-content menu bg-base-100 rounded-box z-50 w-60 p-2 shadow-sm gap-2 mt-1.5"
            >
              <li className="pointer-events-none">
                <div className="w-full flex flex-row justify-start items-center gap-3 pb-4 border-b border-base-content/10">
                  {/* avatar */}
                  <div className="avatar avatar-placeholder">
                    <div className="bg-custom-primary text-neutral-content w-10 rounded-full">
                      <span className="text-base uppercase text-custom-secondary font-medium">
                        {highlightName(pengguna?.nama ?? "")}
                      </span>
                    </div>
                  </div>

                  {/* nama and role active */}
                  <div className="flex flex-col justify-start items-start">
                    <p className="text-sm font-semibold text-base-content">
                      {pengguna?.nama}
                    </p>
                    <p className="text-xs text-base-content/70">
                      {pengguna?.role === ROLE_INTERNAL_TYPE.OWNER
                        ? "Owner"
                        : pengguna?.role === ROLE_INTERNAL_TYPE.KASIR
                          ? "Kasir"
                          : "-"}
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <button
                  tabIndex={0}
                  role="button"
                  type="button"
                  className="m-1 h-10 flex flex-row justify-start items-center gap-4"
                  onClick={() => handleLogout()}
                >
                  <LogOut className="size-4.5 text-error" />
                  <span className="text-sm font-medium text-error">Keluar</span>
                </button>
              </li>
            </ul>
          </div>

          {/* button theme */}
          <ButtonTheme />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
