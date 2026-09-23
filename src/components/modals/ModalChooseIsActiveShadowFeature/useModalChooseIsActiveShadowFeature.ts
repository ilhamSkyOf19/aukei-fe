import { useQuery } from "@tanstack/react-query";
import { ShadowFeatureServices } from "../../../services/shadowFeature.service";
import { useState } from "react";

const useModalChooseIsActiveShadowFeature = () => {
  //   state is active
  const [isActive, setIsActive] = useState<boolean>(false);

  // use query
  const { data: dataShadowFeature, isLoading: isLoadingShadowFeature } =
    useQuery({
      queryKey: ["shadow-feature-list"],
      queryFn: () => {
        return ShadowFeatureServices.findForChoose();
      },
      retry: false,
      refetchOnWindowFocus: false,
    });

  return {
    dataShadowFeature,
    isLoadingShadowFeature,
    isActive,
    setIsActive,
  };
};

export default useModalChooseIsActiveShadowFeature;
