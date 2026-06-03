import useTitle from "../../hooks/useTitle";
import HeaderPage from "../../layouts/HeaderPage";
import ProdukDetail from "../../views/all/ProdukDetail";

const ProdukDetailPage = () => {
  // title
  useTitle("Produk Detail");

  return (
    <>
      {/* header */}
      <HeaderPage title="Produk Detail | AUKEI" />

      {/* content */}
      <ProdukDetail />
    </>
  );
};

export default ProdukDetailPage;
