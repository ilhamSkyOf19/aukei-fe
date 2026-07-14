import useTitle from "../../hooks/useTitle";
import HeaderPage from "../../layouts/HeaderPage";
import PengajuanBarangKeluarDetail from "../../views/owner/PengajuanBarangKeluarDetail";

const PengajuanBarangKeluarDetailPage = () => {
  // use title
  useTitle("Pengajuan Barang Keluar Detail");

  return (
    <>
      {/* header */}
      <HeaderPage title="Pengajuan Barang Keluar Detail | AUKEI" />

      {/* content */}
      <PengajuanBarangKeluarDetail />
    </>
  );
};

export default PengajuanBarangKeluarDetailPage;
