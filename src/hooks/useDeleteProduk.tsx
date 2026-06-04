import { useMutation } from "@tanstack/react-query";
import { ProdukServices } from "../services/produk.service";
import { useNavigate } from "react-router-dom";

const useDeleteProduk = (params: {
  validatedIdParams: number | null;
  handleCloseModal: () => void;
  redirectPathname: string;
  handleInvalidate?: () => void;
}) => {
  // params
  const {
    handleCloseModal,
    validatedIdParams,
    redirectPathname,
    handleInvalidate,
  } = params;

  // navigate
  const navigate = useNavigate();

  const { mutateAsync: mutateDeleteProduk, isPending: isPendingDeleteProduk } =
    useMutation({
      mutationFn: () => {
        if (!validatedIdParams) {
          throw new Error("ID produk tidak ditemukan");
        }

        return ProdukServices.delete(validatedIdParams);
      },
      onSuccess: () => {
        // close modal
        handleCloseModal();

        // set toast
        navigate(redirectPathname, {
          state: {
            toast: "deleted_produk",
          },
        });

        // invalidate
        handleInvalidate?.();
      },
      onError: (err) => {
        console.log(err);
      },
    });

  // handle delete
  const handleDeleteProduk = async () => {
    try {
      await mutateDeleteProduk();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleDeleteProduk,
    isPendingDeleteProduk,
  };
};

export default useDeleteProduk;
