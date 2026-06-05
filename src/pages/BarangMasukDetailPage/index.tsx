import useTitle from "../../hooks/useTitle";
import HeaderPage from "../../layouts/HeaderPage";
import BarangMasukDetail from "../../views/owner/BarangMasukDetail";

const BarangMasukDetailPage = () => {
  // use title
  useTitle("Barang Masuk Detail");

  return (
    <>
      {/* header */}
      <HeaderPage title="Barang Masuk Detail | AUKEI" />

      {/* content */}
      <BarangMasukDetail />
    </>
  );
};

export default BarangMasukDetailPage;
