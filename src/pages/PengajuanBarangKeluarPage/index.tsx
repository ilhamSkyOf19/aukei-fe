import useTitle from "../../hooks/useTitle";
import HeaderPage from "../../layouts/HeaderPage";
import BarangKeluar from "../../views/owner/Inventori/BarangKeluar";

const PengajuanBarangKeluarPage = () => {
  //   use title
  useTitle("pengajuan barang keluar");

  return (
    <>
      {/* header */}
      <HeaderPage title="Pengajuan Barang Keluar | AUKEI" />

      {/* content */}
      <BarangKeluar fromPengajuanBarang />
    </>
  );
};

export default PengajuanBarangKeluarPage;
