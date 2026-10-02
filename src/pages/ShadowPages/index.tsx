import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import Shadow from "../../views/owner/Shadow";

const ShadowPages: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Bayangan");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Bayangan | AUKEI" />

      {/* view login */}
      <Shadow />
    </>
  );
};

export default ShadowPages;
