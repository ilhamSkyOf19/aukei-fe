import useTitle from "../../hooks/useTitle";
import HeaderPage from "../../layouts/HeaderPage";
import Pegawai from "../../views/owner/Pegawai";

const PegawaiPage = () => {
  //   use title
  useTitle("Pegawai");

  return (
    <>
      {/* header */}
      <HeaderPage title="Pegawai | AUKEI" />

      {/* content */}
      <Pegawai />
    </>
  );
};

export default PegawaiPage;
