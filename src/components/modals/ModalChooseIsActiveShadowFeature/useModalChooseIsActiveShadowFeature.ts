import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShadowFeatureServices } from "../../../services/shadowFeature.service";
import type { UpdateIsActiveShadowFeatureType } from "../../../models/shadowFeature.model";
import useModal from "../../../hooks/useModal";
import { useToastAnimation } from "../../../hooks/useToast";
import {
  ROLE_INTERNAL_TYPE,
  type RoleInternalType,
} from "../../../types/constant.type";
import { useShadowStore } from "../../../stores/shadowStore";
import useShowNavigationShadow from "../../../hooks/useShowNavigationShadow";

const useModalChooseIsActiveShadowFeature = (params: {
  handleCloseModal: () => void;
  handleActive: (value: boolean) => void;
  handleSetToastFormParent: (value: string) => void;
  role?: RoleInternalType;
}) => {
  const { handleCloseModal, handleActive, role, handleSetToastFormParent } =
    params;

  // get shadow feature
  const { setShadowIsActive, showNavigation, shadowId } = useShadowStore(
    (state) => state,
  );

  // toast
  const { handleSetToast, toast } = useToastAnimation();

  // query client
  const queryClient = useQueryClient();

  // use query
  const { data: dataShadowFeature, isLoading: isLoadingShadowFeature } =
    useQuery({
      queryKey: ["shadow-feature-list"],
      queryFn: () => {
        return ShadowFeatureServices.findForChoose();
      },
      enabled: role === ROLE_INTERNAL_TYPE.OWNER,
      retry: false,
      refetchOnWindowFocus: false,
    });

  // mutation is active
  const {
    mutateAsync: mutateIsActive,
    isPending: isPendingIsActive,
    variables: variablesIsActive,
  } = useMutation({
    mutationFn: (data: { id: number; req: UpdateIsActiveShadowFeatureType }) =>
      ShadowFeatureServices.updateIsActive(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shadow-feature-list"] });

      // set active
      handleActive(true);

      // handle close modal
      handleCloseModal();

      if (data.data) {
        if (data.data.activedAt) {
          setShadowIsActive({
            shadowId: data.data?.id,
            shadowIsActive: data.data?.isActive,
            showNavigation: data.data?.showNavigation,
          });
        } else {
          setShadowIsActive({
            shadowId: null,
            shadowIsActive: false,
          });
        }
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // handle is active
  const handleIsActive = async (data: { id: number }) => {
    try {
      await mutateIsActive({
        id: data.id,
        req: { activedAt: true },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // handle non active
  const handleNonActive = async () => {
    try {
      // get shadow is active true
      const data = dataShadowFeature?.data?.find(
        (item) => item.isActive === true,
      );

      if (!data) return;
      await mutateIsActive({
        id: data.id,
        req: { deactivedAt: true },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // use modal add shadow feature
  const {
    modalRef: modalAddShadowFeatureRef,
    handleShowModal: handleShowModalAddShadowFeature,
    handleCloseModal: handleCloseModalAddShadowFeature,
  } = useModal();

  // use show navigation
  const {
    isPendingShowNavigation,
    mutateShowNavigation,
    variablesShowNavigation,
  } = useShowNavigationShadow({
    handleSetToast: handleSetToastFormParent,
    callBack: () => handleCloseModal(),
  });

  const handleMutateShowNavigation = async (data: {
    showNavigation: boolean;
  }) => {
    if (shadowId) {
      await mutateShowNavigation({
        id: shadowId!,
        showNavigation: data.showNavigation,
      });
    }
  };

  return {
    dataShadowFeature,
    isLoadingShadowFeature,

    handleIsActive,
    isPendingIsActive,
    modalAddShadowFeatureRef,
    handleShowModalAddShadowFeature,
    handleCloseModalAddShadowFeature,
    toast,
    handleSetToast,
    handleNonActive,
    variablesIsActive,
    showNavigation,

    handleMutateShowNavigation,
    isPendingShowNavigation,
    variablesShowNavigation,
  };
};

export default useModalChooseIsActiveShadowFeature;
