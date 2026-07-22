import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import BookingByPelanggan from "../../views/all/BookingByPelanggan";

const BookingByPelangganPage: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Pelanggan Booking");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Pelanggan Booking | AUKEI" />

      {/* view toko */}
      <BookingByPelanggan />
    </>
  );
};

export default BookingByPelangganPage;
