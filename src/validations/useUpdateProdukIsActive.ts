import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProdukServices } from "../services/produk.service";

type Props = {
  handleSetToast: (toast: string) => void;
  handleInvalidate?: () => void;
};
const useUpdateProdukIsActive = (params: Props) => {
  const queryClient = useQueryClient();

  const { handleSetToast, handleInvalidate } = params;

  // Mutation untuk mengubah status aktif/nonaktif produk
  const {
    mutateAsync: mutateUpdateIsActive,
    isPending: isPendingUpdateIsActive,
    variables: variablesUpdateIsActive,
  } = useMutation({
    mutationFn: (data: { id: number; status: boolean }) =>
      ProdukServices.updateStatus({
        id: data.id,
        status: data.status,
      }),
    onSuccess: () => {
      handleSetToast("updated_status");

      if (handleInvalidate) {
        handleInvalidate();
      } else {
        queryClient.invalidateQueries({ queryKey: ["produk"] });
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // Ubah status aktif/nonaktif satu produk
  const handelUpdateIsActive = async (data: {
    id: number;
    status: boolean;
  }) => {
    try {
      await mutateUpdateIsActive(data);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handelUpdateIsActive,
    isPendingUpdateIsActive,
    variablesUpdateIsActive,
  };
};

export default useUpdateProdukIsActive;
