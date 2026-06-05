import React from "react";
import useTitle from "../../hooks/useTitle";
import HeaderPage from "../../layouts/HeaderPage";

const DashboardPage = () => {
  // use title
  useTitle("Dashboard");

  return (
    <>
      {/* header */}
      <HeaderPage title="Dashboard | AUKEI" />
    </>
  );
};

export default DashboardPage;
