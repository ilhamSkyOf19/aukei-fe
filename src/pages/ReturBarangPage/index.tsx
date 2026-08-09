import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import ReturBarang from "../../views/kasir/ReturBarang";

type Props = {
  ubahData?: boolean;
};
const ReturBarangPage: FC<Props> = ({ ubahData }) => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle(ubahData ? "Ubah Retur Barang" : "Retur Barang");
  }, [handleTitle, ubahData]);

  return (
    <>
      {/* header page */}
      <HeaderPage
        title={ubahData ? "Ubah Retur Barang | AUKEI" : "Retur Barang | AUKEI"}
      />

      {/* view login */}
      <ReturBarang />
    </>
  );
};

export default ReturBarangPage;
