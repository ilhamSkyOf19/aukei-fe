import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useLocation, useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import Kasir from "../../views/kasir/Kasir";

type Props = {
  isUpdateKeranjang?: boolean;
  isUpdateTransaction?: boolean;
};
const KasirPage: FC<Props> = ({ isUpdateKeranjang, isUpdateTransaction }) => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle(
      isUpdateKeranjang
        ? "Keranjang"
        : isUpdateTransaction
          ? "Ubah Produk Transaksi"
          : "Kasir",
    );
  }, [handleTitle]);

  const location = useLocation();

  return (
    <>
      {/* header page */}
      <HeaderPage
        title={`${isUpdateKeranjang ? "Keranjang" : isUpdateTransaction ? "Ubah Produk Transaksi" : "Kasir"} | AUKEI`}
      />

      {/* view toko */}
      <Kasir key={location.pathname} />
    </>
  );
};

export default KasirPage;
