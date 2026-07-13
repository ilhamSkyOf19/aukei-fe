import useTitle from "../../hooks/useTitle";
import HeaderPage from "../../layouts/HeaderPage";
import PengajuanBarangMasukDetail from "../../views/owner/PengajuanBarangMasukDetail";

const PengajuanBarangMasukDetailPage = () => {
  // use title
  useTitle("Pengajuan Barang Masuk Detail");

  return (
    <>
      {/* header */}
      <HeaderPage title="Pengajuan Barang Masuk Detail | AUKEI" />

      {/* content */}
      <PengajuanBarangMasukDetail />
    </>
  );
};

export default PengajuanBarangMasukDetailPage;
