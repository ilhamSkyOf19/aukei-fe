import useTitle from "../../hooks/useTitle";
import HeaderPage from "../../layouts/HeaderPage";
import Pelanggan from "../../views/owner/Pelanggan";

const PelangganPage = () => {
  //   use title
  useTitle("Pelanggan");

  return (
    <>
      {/* header */}
      <HeaderPage title="Pelanggan | AUKEI" />

      {/* content */}
      <Pelanggan />
    </>
  );
};

export default PelangganPage;
