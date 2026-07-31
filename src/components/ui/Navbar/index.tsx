import {
  Bell,
  ChevronDown,
  LogOut,
  LucideBellOff,
  PanelRightClose,
  RefreshCw,
} from "lucide-react";
import { type FC } from "react";
import { useAuthStore } from "../../../stores/authStore";
import { cn } from "../../../utils/cn";
import ButtonTheme from "../button/ButtonTheme";
import { ROLE_INTERNAL_TYPE } from "../../../types/constant.type";
import Notifikasi from "./Notifikasi";
import useLogOut from "../../../hooks/useLogOut";
import ButtonWithIcon from "../button/ButtonWithIcon";
type Props = {
  handleSidebar: () => void;
  isClose: boolean;
  title: string;
};
const Navbar: FC<Props> = ({ handleSidebar, isClose, title }: Props) => {
  // auth
  const pengguna = useAuthStore((state) => state.pengguna);

  // handle logout
  const { handleLogout, isPendingLogout } = useLogOut({ redirectUrl: true });

  return (
    <nav
      className={cn(
        "navbar w-full bg-base-100 shadow-sm flex flex-row justify-between items-center top-0 border-b border-base-content/10 sticky z-10",
        pengguna?.role === ROLE_INTERNAL_TYPE.KASIR &&
          // (currentPathname.includes("kasir") ||
          //   currentPathname.includes("keranjang") ||
          //   currentPathname.includes("kredit")) &&
          "hidden",
      )}
      style={{ minHeight: "2.5rem" }}
    >
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
          {/* beta */}
          <div className="w-14 h-7 flex justify-center items-center border border-amber-600 bg-amber-100 rounded-lg">
            <span className="text-amber-600 font-medium text-xs">Beta</span>
          </div>

          {/* notifikasi */}
          <Notifikasi pengguna={pengguna} />

          {/* button theme */}
          <ButtonTheme />

          {/* button logout */}
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
    </nav>
  );
};

export default Navbar;
