import { ChevronDown, LogOut, PanelRightClose } from "lucide-react";
import { type FC } from "react";
import { useAuthStore } from "../../../stores/authStore";
import useNavbar from "./useNavbar";
import { cn } from "../../../utils/cn";
import ButtonTheme from "../button/ButtonTheme";
import { highlightName } from "../../../helpers/helpers";
import { ROLE_INTERNAL_TYPE } from "../../../types/constant.type";
type Props = {
  handleSidebar: () => void;
  isClose: boolean;
  title: string;
};
const Navbar: FC<Props> = ({ handleSidebar, isClose, title }: Props) => {
  // auth
  const pengguna = useAuthStore((state) => state.pengguna);

  // get use navbar
  const { handleLogout } = useNavbar();

  return (
    <nav className="navbar w-full bg-custom-secondary shadow-sm flex flex-row justify-between items-center relative ">
      <div className="w-full flex flex-row justify-between items-center">
        <div className="flex-1 flex flex-row justify-start items-center">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
            onClick={() => handleSidebar()}
          >
            {/* Sidebar toggle icon */}
            <PanelRightClose
              className={cn(
                "size-6 text-primary-white",
                !isClose && "lg:rotate-180",
              )}
            />
          </label>
          <h1 className="text-primary-white px-4 font-medium capitalize lg:text-lg text-sm lg:font-semibold">
            {title}
          </h1>
        </div>
        <div className="flex-1 flex flex-row justify-end items-center gap-6 pr-2">
          <div className="dropdown dropdown-end">
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
              <ChevronDown className="w-4 h-4 ml-2 text-primary-white" />
            </button>
            <ul
              tabIndex={-1}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-60 p-2 shadow-sm gap-2"
            >
              <li className="pointer-events-none">
                <div className="w-full flex flex-row justify-start items-center gap-3 pb-4 border-b border-base-content/10">
                  {/* avatar */}
                  <div className="avatar avatar-placeholder">
                    <div className="bg-custom-secondary text-neutral-content w-10 rounded-full">
                      <span className="text-xl text-custom-primary font-medium">
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
