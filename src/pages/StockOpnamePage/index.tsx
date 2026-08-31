import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import StokOpname from "../../views/all/StockOpname";

type Props = {
  fromPengajuan?: boolean;
};
const StockOpnamePage: FC<Props> = ({ fromPengajuan }) => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle(fromPengajuan ? "Pengajuan Stok Opname" : "Stok Opname");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage
        title={
          fromPengajuan
            ? "Pengajuan Stok Opname | AUKEI"
            : "Stok Opname | AUKEI"
        }
      />

      {/* view login */}
      <StokOpname fromPengajuan={fromPengajuan} />
    </>
  );
};

export default StockOpnamePage;
