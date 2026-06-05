import useTitle from "../../hooks/useTitle";
import HeaderPage from "../../layouts/HeaderPage";
import Inventori from "../../views/owner/Inventori";

const InventoriPage = () => {
  //   use title
  useTitle("Inventori");

  return (
    <>
      {/* header */}
      <HeaderPage title="Inventori | AUKEI" />

      {/* content */}
      <Inventori />
    </>
  );
};

export default InventoriPage;
