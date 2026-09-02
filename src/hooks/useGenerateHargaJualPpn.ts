import { ProdukServices } from "../services/produk.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useGenerateHargaJualPpn = (params: {
  handleSetToast: (value: string) => void;
}) => {
  const { handleSetToast } = params;
  // use query
  const queryClient = useQueryClient();

  const { mutateAsync: mutateGetHargaPpn, isPending: isPendingGetHargaPpn } =
    useMutation({
      mutationFn: () => ProdukServices.updateHargaPpn(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["produk"] });

        handleSetToast("updated_harga_ppn");
      },
      onError: (err) => {
        console.log(err);
      },
    });

  // handle generate
  const handleGetHargaPpn = async () => {
    try {
      await mutateGetHargaPpn();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleGetHargaPpn,
    isPendingGetHargaPpn,
  };
};

export default useGenerateHargaJualPpn;
