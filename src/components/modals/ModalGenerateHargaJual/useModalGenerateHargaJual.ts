import { useController, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProdukValidation } from "../../../validations/produk.validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProdukServices } from "../../../services/produk.service";
import { useState } from "react";
import type { ResponseGetModalType } from "../../../models/produk.model";
import { differenceInMinutes } from "date-fns";

const useModalGenerateHargaJual = (params: {
  handleCloseModal: () => void;
  handleSetToast: (toast: string) => void;
  fromDetail?: boolean;
}) => {
  const { handleCloseModal, handleSetToast, fromDetail } = params;

  //   invalidate
  const queryClient = useQueryClient();

  // state harga modal
  const [dataHargaModal, setHargaModal] = useState<
    (ResponseGetModalType & { createdAt: Date }) | null
  >(null);

  // state hasil generate harga
  const [hasilGenerateHargaJual, setHasilGenerateHargaJual] = useState<{
    raw: number;
    final: number;
  }>({
    final: 0,
    raw: 0,
  });

  // use form
  const { control, trigger, reset } = useForm({
    resolver: zodResolver(ProdukValidation.GENERATE_HARGA),
  });

  // custom laba controller
  const customLabaController = useController({
    control,
    name: "customLaba",
  });

  //   use watch
  const customLabaWatch = useWatch({
    control,
    name: "customLaba",
  });

  // handle generate harga jual
  const generateHargaJual = (data: ResponseGetModalType): void => {
    const { totalModal, totalStok } = data;

    const totalProfit = totalStok * customLabaWatch;

    const totalOmzet = totalModal + totalProfit;

    const hargaJual = Math.round(totalOmzet / totalStok);

    return setHasilGenerateHargaJual({ final: hargaJual, raw: hargaJual });
  };

  //   handle bulatkan ke atas
  const handleBulatkanKeAtas = () => {
    if (!hasilGenerateHargaJual) return;

    const hargaJual = Math.ceil(hasilGenerateHargaJual.raw / 500) * 500;
    return setHasilGenerateHargaJual((prev) => ({ ...prev, final: hargaJual }));
  };

  //   handle bulatkan ke bawah
  const handleBulatkanKeBawah = () => {
    if (!hasilGenerateHargaJual) return;

    const hargaJual = Math.floor(hasilGenerateHargaJual.raw / 500) * 500;
    return setHasilGenerateHargaJual((prev) => ({ ...prev, final: hargaJual }));
  };

  const {
    mutateAsync: mutateGetHargaModal,
    isPending: isPendingGetHargaModal,
  } = useMutation({
    mutationFn: (id: number) => ProdukServices.hargaModal(id),
    onSuccess: (data) => {
      if (data.data) {
        setHargaModal({
          totalModal: data.data.totalModal,
          totalStok: data.data.totalStok,
          createdAt: new Date(),
        });

        generateHargaJual(data.data);
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  //   handle generate harga
  const handleGenerateHargaJual = async (id?: number) => {
    try {
      if (!id) return;

      const laba = await trigger();

      if (!laba) return;

      if (dataHargaModal) {
        if (differenceInMinutes(new Date(), dataHargaModal.createdAt) <= 1) {
          return generateHargaJual(dataHargaModal);
        }
      }

      await mutateGetHargaModal(id);
    } catch (error) {
      console.log(error);
    }
  };

  //   handle batal
  const closeModal = () => {
    // handle close modal
    handleCloseModal();

    // reset
    reset();

    // reset state
    setHasilGenerateHargaJual({
      final: 0,
      raw: 0,
    });

    // reset data
    setHargaModal(null);
  };

  //   mutate update harga jual
  const {
    mutateAsync: mutateUpdateHargaJual,
    isPending: isPendingUpdateHargaJual,
  } = useMutation({
    mutationFn: (data: { id: number; hargaJual: number }) =>
      ProdukServices.updateHargaJual({
        id: data.id,
        req: { hargaJual: data.hargaJual },
      }),
    onSuccess: (data) => {
      closeModal();

      //   invalidate
      if (fromDetail) {
        queryClient.invalidateQueries({
          queryKey: ["detail-produk", data.data?.id],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["produk"] });
      }

      // set toast
      handleSetToast("updated_harga_jual_produk");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  //   handle update harga jual
  const handleUpdateHargaJual = async (id?: number) => {
    try {
      if (!id || !hasilGenerateHargaJual) return;

      await mutateUpdateHargaJual({
        id,
        hargaJual: hasilGenerateHargaJual.final,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    customLabaController,
    isPendingGetHargaModal,
    handleGenerateHargaJual,
    hasilGenerateHargaJual,
    handleBatal: closeModal,
    handleUpdateHargaJual,
    isPendingUpdateHargaJual,
    handleBulatkanKeAtas,
    handleBulatkanKeBawah,
  };
};

export default useModalGenerateHargaJual;
