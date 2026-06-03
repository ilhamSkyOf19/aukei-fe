import useTitle from "../../hooks/useTitle";
import HeaderPage from "../../layouts/HeaderPage";
import FormulirProduk from "../../views/owner/Produk/FormulirProduk";

const FormulirProdukPage = () => {
  // use title
  useTitle("Formulir Produk");

  return (
    <>
      {/* header */}
      <HeaderPage title="Formulir Produk | AUKEI" />

      {/* content */}
      <FormulirProduk />
    </>
  );
};

export default FormulirProdukPage;
