import useTitle from "../../hooks/useTitle";
import HeaderPage from "../../layouts/HeaderPage";
import Dashboard from "../../views/all/Dashboard";

const DashboardPage = () => {
  // use title
  useTitle("Dashboard");

  return (
    <>
      {/* header */}
      <HeaderPage title="Dashboard | AUKEI" />

      <Dashboard />
    </>
  );
};

export default DashboardPage;
