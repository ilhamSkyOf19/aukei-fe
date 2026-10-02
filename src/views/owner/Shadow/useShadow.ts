import { Scissors, type LucideIcon } from "lucide-react";
import { useState } from "react";
import type { ResponsePeriodeShadowType } from "../../../models/periodeShadow.model";
import { useShadowStore } from "../../../stores/shadowStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PeriodeShadowServices } from "../../../services/periodeShadow.service";
import { useToastAnimation } from "../../../hooks/useToast";
import useModal from "../../../hooks/useModal";
import type { CreateShadowCutTransactionType } from "../../../models/shadowTransaction.model";
import { ShadowTransactionServices } from "../../../services/shadowTransaction.service";
import useShowNavigationShadow from "../../../hooks/useShowNavigationShadow";
import { useNavigate } from "react-router-dom";

const pilihan: {
  key: "pangkasSemua" | "pangkasLaba";
  label: string;
  icon: LucideIcon;
}[] = [
  {
    key: "pangkasSemua",
    label: "Pangkas Semua",
    icon: Scissors,
  },
  {
    key: "pangkasLaba",
    label: "Pangkas Laba",
    icon: Scissors,
  },
];

const useShadow = () => {
  // get shadow is active
  const { shadowIsActive, shadowId } = useShadowStore((state) => state);

  // query client
  const queryClient = useQueryClient();

  // navigate
  const navigate = useNavigate();

  // toast
  const { handleSetToast, toast } = useToastAnimation();

  const [selected, setSelected] = useState<"pangkasSemua" | "pangkasLaba">(
    "pangkasSemua",
  );

  const [isUpdateActive, setIsUpdateActive] =
    useState<ResponsePeriodeShadowType | null>(null);

  // use query
  const { data: dataPeriodeShadow, isLoading: isLoadingPeriodeShadow } =
    useQuery({
      queryKey: ["periode-shadow"],
      queryFn: () => PeriodeShadowServices.findAll(),
      enabled: shadowIsActive,
      retry: false,
      refetchOnWindowFocus: false,
    });

  // use modal
  const {
    modalRef: modalFormulirPeriodeShadowRef,
    dataModal: dataFormulirPeriodeShadow,
    handleCloseModal: handleCloseModalFormulirPeriodeShadow,
    handleShowModal: handleShowModalFormulirPeriodeShadow,
  } = useModal<{ id?: number; data?: ResponsePeriodeShadowType }>();

  // use mutation cut all
  const {
    mutateAsync: mutateCutAll,
    isPending: isPendingCutAll,
    variables: variablesCutAll,
  } = useMutation({
    mutationFn: (data: CreateShadowCutTransactionType) =>
      ShadowTransactionServices.cutAll(data),
    onSuccess: () => {
      handleSetToast("generate");

      queryClient.invalidateQueries({ queryKey: ["periode-shadow"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // handle mutate cut all
  const handleCutAll = async (
    data: Pick<CreateShadowCutTransactionType, "customOmzet" | "periode">,
  ) => {
    try {
      if (!shadowId) return;

      await mutateCutAll({
        ...data,
        shadowFeatureId: shadowId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const {
    isPendingShowNavigation: isPendingCloseNavigation,
    mutateShowNavigation,
  } = useShowNavigationShadow({
    callBack: () => navigate("/dashboard"),
  });

  // handle show navigation
  const handleCloseNavigation = async () => {
    try {
      if (shadowId) {
        await mutateShowNavigation({
          id: shadowId,
          showNavigation: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    pilihan,
    selected,
    setSelected,
    isUpdateActive,
    setIsUpdateActive,
    dataPeriodeShadow,
    isLoadingPeriodeShadow,
    toast,
    handleSetToast,

    modalFormulirPeriodeShadowRef,
    dataFormulirPeriodeShadow,
    handleCloseModalFormulirPeriodeShadow,
    handleShowModalFormulirPeriodeShadow,

    handleCutAll,
    isPendingCutAll,
    variablesCutAll,

    handleCloseNavigation,
    isPendingCloseNavigation,
  };
};

export default useShadow;
