import { useMemo, useState, type FC } from "react";
import { Outlet, useLocation } from "react-router-dom";
import useDashboardLayout from "./useDashboardLayout";
import { cn } from "../../utils/cn";
import { WifiOff } from "lucide-react";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";
import Navbar from "../../components/ui/Navbar";
import Sidebar from "../../components/ui/SideBar";
import { useStepStore } from "../../stores/stepStore";

const DashboardLayout: FC = () => {
  const { handleSidebar, isClose } = useDashboardLayout();

  // current pathname
  const currentPathname = useLocation().pathname;

  // get local storage
  const { step } = useStepStore((state) => state);

  // use network status
  const { isOnline } = useNetworkStatus();

  // state header
  const [title, setTitle] = useState<string>("");

  // handle title
  const handleTitle = (title: string) => setTitle(title);

  // can show scrollbar
  const isCanShowScrollbar = useMemo(() => {
    return (
      (!currentPathname.includes("kasir") || step === 3) &&
      !currentPathname.includes("keranjang")
    );
  }, [currentPathname, step]);

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* content */}
      <div
        className={cn(
          "drawer-content h-screen bg-base-300 pb-4 overflow-x-hidden",
          isCanShowScrollbar ? "overflow-y-auto" : "overflow-hidden",
        )}
      >
        {/* navbar */}
        <Navbar handleSidebar={handleSidebar} isClose={isClose} title={title} />

        {/* content */}
        <Outlet context={{ handleTitle }} />

        {/* toast offline */}
        <div
          className={cn(
            "toast toast-start transition-all duration-200 ease-in-out",
            isClose ? "lg:ml-75" : "lg:ml-16",
            isOnline
              ? "pointer-events-none opacity-0"
              : "-translate-y-4 opacity-100",
          )}
        >
          <div className="alert alert-warning">
            <WifiOff className="size-5" />
            <span>Tidak ada koneksi internet</span>
          </div>
        </div>
      </div>

      {/* sidebar */}
      <Sidebar isClose={isClose} />
    </div>
  );
};

export default DashboardLayout;
