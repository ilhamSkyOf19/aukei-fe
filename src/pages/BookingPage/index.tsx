import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import Kredit from "../../views/all/Kredit";
import Booking from "../../views/all/Booking";

const BookingPage: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Booking");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Booking | AUKEI" />

      {/* view toko */}
      <Booking />
    </>
  );
};

export default BookingPage;
