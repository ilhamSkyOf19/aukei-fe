import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShadowFeatureServices } from "../services/shadowFeature.service";
import { useShadowStore } from "../stores/shadowStore";

const useShowNavigationShadow = (params: {
  handleSetToast?: (value: string) => void;
  callBack?: () => void;
}) => {
  const { handleSetToast, callBack } = params;

  // query client
  const queryClient = useQueryClient();

  // use shadow feature
  const setShadowIsActive = useShadowStore((state) => state.setShadowIsActive);

  const {
    mutateAsync: mutateShowNavigation,
    isPending: isPendingShowNavigation,
    variables: variablesShowNavigation,
  } = useMutation({
    mutationFn: (data: { id: number; showNavigation: boolean }) =>
      ShadowFeatureServices.updateShowNavigation({
        id: data.id,
        req: {
          showNavigation: data.showNavigation,
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shadow-feature-list"] });

      if (data.data) {
        setShadowIsActive({
          shadowId: data.data?.id,
          shadowIsActive: data.data?.isActive,
          showNavigation: data.data?.showNavigation,
        });

        handleSetToast?.(
          data.data.showNavigation === false
            ? "close_navigation"
            : "open_navigation",
        );
      }

      callBack?.();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return {
    mutateShowNavigation,
    isPendingShowNavigation,
    variablesShowNavigation,
  };
};

export default useShowNavigationShadow;
