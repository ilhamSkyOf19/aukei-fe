import { useState, type FC } from "react";
import { Outlet } from "react-router-dom";
import useDashboardLayout from "./useDashboardLayout";
import { cn } from "../../utils/cn";
import { WifiOff } from "lucide-react";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";
import Navbar from "../../components/ui/Navbar";
import Sidebar from "../../components/ui/SideBar";

const DashboardLayout: FC = () => {
  const { handleSidebar, isClose } = useDashboardLayout();

  // use network status
  const { isOnline } = useNetworkStatus();

  // state header
  const [title, setTitle] = useState<string>("");

  // handle title
  const handleTitle = (title: string) => setTitle(title);

  return (
    <div className="drawer lg:drawer-open relative">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* content */}
      <div className="drawer-content bg-base-300">
        {/* Page content here */}
        <div className="w-full max-h-screen overflow-hidden">
          {/* navbar */}
          <Navbar
            handleSidebar={handleSidebar}
            isClose={isClose}
            title={title}
          />

          {/* content */}
          <main className="w-full h-screen overflow-y-auto">
            <Outlet context={{ handleTitle }} />

            {/* toast offline */}
            <div
              className={cn(
                "toast toast-start transition-all duration-200 ease-in-out",
                isClose ? "lg:ml-75" : "lg:ml-16",
                isOnline ? " opacity-0" : "-translate-y-4 opacity-100",
              )}
            >
              <div className="alert alert-warning">
                <WifiOff className="size-5" />
                <span>Tidak ada koneksi internet</span>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* sidebar */}
      <Sidebar isClose={isClose} />
    </div>
  );
};

export default DashboardLayout;
