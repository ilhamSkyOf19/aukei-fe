import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import StockOpnameDetail from "../../views/all/StockOpnameDetail";

type Props = {
  fromPengajuan?: boolean;
};
const StockOpnameDetailPage: FC<Props> = ({ fromPengajuan }) => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle(
      fromPengajuan ? "Pengajuan Stok Opname Detail" : "Stok Opname Detail",
    );
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage
        title={
          fromPengajuan
            ? "Pengajuan Stok Opname Detail | AUKEI"
            : "Stok Opname Detail | AUKEI"
        }
      />

      {/* view login */}
      <StockOpnameDetail fromPengajuan={fromPengajuan} />
    </>
  );
};

export default StockOpnameDetailPage;
