import { type FC } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { cn } from "../../../utils/cn";
import useSideBar from "./useSideBar";
import { highlightName } from "../../../helpers/helpers";
import { LogOut } from "lucide-react";
import { ROLE_INTERNAL_TYPE } from "../../../types/constant.type";

type Props = {
  isClose: boolean;
};
const Sidebar: FC<Props> = ({ isClose }) => {
  // call use dashboard
  const {
    isNavigation,
    pathname,
    handleClearDataLocalStorage,
    divRef,
    handleLogout,
    hasScroll,
    pengguna,
  } = useSideBar();

  return (
    <div className="drawer-side is-drawer-close:overflow-visible border-r border-base-content/10 z-50">
      <label
        htmlFor="my-drawer-4"
        aria-label="close sidebar"
        className="drawer-overlay"
      />
      <div
        ref={divRef}
        className={cn(
          "flex h-screen overflow-hidden overflow-y-auto flex-col items-start justify-between bg-base-100 is-drawer-close:w-16 lg:is-drawer-open:w-75 is-drawer-open:w-70",
          hasScroll && "is-drawer-close:w-18",
        )}
      >
        <div className="flex flex-col justify-start items-start w-full">
          {/* logo */}
          <div
            className={cn(
              "is-drawer-close:tooltip is-drawer-close:tooltip-right hover:bg-transparent w-full flex flex-row justify-start items-center gap-2 px-2",
            )}
          >
            {/* title is closed */}
            <div className="w-full h-14 flex flex-row justify-center items-center border bg-custom-secondary rounded-b-4xl">
              <p className="is-drawer-open:hidden text-custom-primary font-semibold text-base lg:text-2xl">
                A
              </p>

              {/* heading */}
              <p className="is-drawer-close:hidden text-primary-black font-semibold text-base lg:text-2xl">
                <span className="text-primary-white">AU</span>
                <span className="text-custom-primary">KEI</span>
              </p>
            </div>
          </div>
          {/* Sidebar content here */}
          <ul className="menu w-full grow space-y-1">
            <ul className="w-full mt-4 space-y-1">
              {/* List item */}

              {isNavigation.map((item, index) => (
                <li key={index} className="flex-1">
                  <Link
                    to={item.link}
                    {...(!isClose && {
                      "data-tooltip-id": "sidebar-tooltip",
                      "data-tooltip-content": item.label,
                    })}
                    data-tooltip-place="right"
                    className={cn(
                      "hover:bg-custom-secondary group",
                      item.link === "/dashboard"
                        ? pathname === "/dashboard" && "bg-custom-secondary"
                        : pathname.startsWith(item.link) &&
                            "bg-custom-secondary",
                    )}
                    onClick={() => handleClearDataLocalStorage()}
                  >
                    <item.icon
                      className={cn(
                        "my-1.5 inline-block size-6 text-base-content group-hover:text-primary-white transition-all duration-150 ease-in-out",
                        item.link === "/dashboard"
                          ? pathname === "/dashboard" && "text-primary-white"
                          : pathname.startsWith(item.link) &&
                              "text-primary-white",
                      )}
                    />
                    <span
                      className={cn(
                        "is-drawer-close:hidden group-hover:text-primary-white text-base-content capitalize transition-all duration-150 ease-in-out",
                        item.link === "/dashboard"
                          ? pathname === "/dashboard" && "text-primary-white"
                          : pathname.startsWith(item.link) &&
                              "text-primary-white",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </ul>
        </div>

        <div className="w-full px-2 py-4 md:hidden">
          {/* profile */}
          <div className="dropdown dropdown-top w-full">
            <button
              type="button"
              tabIndex={0}
              role="button"
              className="m-1 flex flex-row justify-start items-center w-full hover:bg-custom-secondary/10 px-2 py-2 rounded-md gap-3"
            >
              {/* avatar */}
              <div className="avatar avatar-placeholder">
                <div className="bg-custom-primary text-neutral-content w-10 rounded-full">
                  <span className="text-base lg:text-sm text-custom-secondary font-semibold uppercase">
                    {highlightName(pengguna?.nama ?? "")}
                  </span>
                </div>
              </div>

              {/* nama and role active */}
              <div className="flex flex-col justify-start items-start">
                <p className="text-base font-semibold text-base-content">
                  {pengguna?.nama}
                </p>
                <p className="text-xs text-base-content/70">
                  {pengguna?.role === ROLE_INTERNAL_TYPE.OWNER
                    ? "Owner"
                    : "Admin"}
                </p>
              </div>
            </button>
            <ul
              tabIndex={-1}
              className="dropdown-content menu bg-base-100 rounded-box z-40 p-2 w-full shadow-sm border border-base-content/10 gap-2 mt-1.5 "
            >
              <li className="pointer-events-none">
                <div className="w-full flex flex-row justify-start items-center gap-3 pb-4 border-b border-base-content/10">
                  {/* avatar */}
                  <div className="avatar avatar-placeholder">
                    <div className="bg-custom-primary text-neutral-content w-10 rounded-full">
                      <span className="text-base text-custom-secondary uppercase   font-medium">
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
        </div>
      </div>

      <Tooltip
        id="sidebar-tooltip"
        className="z-50 hidden lg:block"
        style={{
          backgroundColor: "#333",
          color: "#fff",
          borderRadius: "4px",
          padding: "3px 12px",
          fontSize: "14px",
        }}
      />
    </div>
  );
};

export default Sidebar;
