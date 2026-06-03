import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../types/constant.type";

const useTitle = (title: string) => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle(title);
  }, [handleTitle, title]);
};

export default useTitle;
