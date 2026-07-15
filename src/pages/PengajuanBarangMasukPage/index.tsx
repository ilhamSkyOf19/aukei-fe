import useTitle from "../../hooks/useTitle";
import HeaderPage from "../../layouts/HeaderPage";
import BarangMasuk from "../../views/owner/Inventori/BarangMasuk";

const PengajuanBarangMasukPage = () => {
  //   use title
  useTitle("pengajuan barang masuk");

  return (
    <>
      {/* header */}
      <HeaderPage title="Pengajuan Barang Masuk | AUKEI" />

      {/* content */}
      <BarangMasuk fromPengajuanBarang />
    </>
  );
};

export default PengajuanBarangMasukPage;
