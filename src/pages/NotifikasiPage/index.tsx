import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import Notifikasi from "../../views/all/Notifikasi";

const NotifikasiPage: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Notifikasi");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Notifikasi | AUKEI" />

      {/* view toko */}
      <Notifikasi />
    </>
  );
};

export default NotifikasiPage;
