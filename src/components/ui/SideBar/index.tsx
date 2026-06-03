import { type FC } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import useHasScroll from "../../../hooks/useHasScroll";
import { cn } from "../../../utils/cn";
import useSideBar from "./useSideBar";

type Props = {
  isClose: boolean;
};
const Sidebar: FC<Props> = ({ isClose }) => {
  // call use dashboard
  const { isNavigation, pathname, handleClearDataLocalStorage } = useSideBar();

  // use has scroll
  const { divRef, hasScroll } = useHasScroll();
  return (
    <div className="drawer-side is-drawer-close:overflow-visible border-r border-base-content/10">
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
              <li key={index}>
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
                      : pathname.startsWith(item.link) && "bg-custom-secondary",
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

        {/* button logout */}
        <div className="menu w-full grow space-y-1"></div>
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
