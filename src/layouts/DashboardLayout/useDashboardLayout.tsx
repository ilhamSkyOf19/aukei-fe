import { useState } from "react";

const useDashboardLayout = () => {
  // state is close
  const [isClose, setIsClose] = useState<boolean>(false);

  // handle close
  const handleSidebar = () => setIsClose((prev) => !prev);

  return { handleSidebar, isClose };
};

export default useDashboardLayout;
