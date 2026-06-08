import useTitle from "../../hooks/useTitle";
import HeaderPage from "../../layouts/HeaderPage";
import BarangKeluarDetail from "../../views/owner/BarangKeluarDetail";

const BarangKeluarDetailPage = () => {
  // use title
  useTitle("Barang Keluar Detail");

  return (
    <>
      {/* header */}
      <HeaderPage title="Barang Keluar Detail | AUKEI" />

      {/* content */}
      <BarangKeluarDetail />
    </>
  );
};

export default BarangKeluarDetailPage;
