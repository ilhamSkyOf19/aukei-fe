import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import type { UpdateBarangMasukForRequestType } from "../../../../models/barangMasuk.model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useModal from "../../../../hooks/useModal";
import {
  STATUS_STOCK_OPNAME_TYPE,
  type StatusStockOpnameType,
} from "../../../../types/constant.type";
import type { UpdateStockOpnameForRequestType } from "../../../../models/stockOpname.model";
import { StockOpnameValidation } from "../../../../validations/stockOpname.validation";
import { StockOpnameServices } from "../../../../services/stockOpname.service";

const useInformasiStockOpnameDetail = (params: {
  tanggal?: Date;
  keterangan?: string;
  idStockOpnameDetail?: number;
  status?: StatusStockOpnameType;
  handleSetToast: (data: string) => void;
}) => {
  const { keterangan, tanggal, idStockOpnameDetail, handleSetToast, status } =
    params;
  // state key update
  const [keyUpdate, setKeyUpdate] = useState<"tanggal" | "keterangan" | "">("");

  //   query client
  const queryClient = useQueryClient();

  // state show ket
  const [showKet, setShowKet] = useState<boolean>(false);

  // use form upadate
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    control,
  } = useForm<UpdateStockOpnameForRequestType>({
    resolver: zodResolver(StockOpnameValidation.UPDATE),
  });

  //   use controll tanggal masuk
  const tanggalOpnameController = useController({
    name: "tanggalOpname",
    control,
  });

  useEffect(() => {
    if (!keyUpdate) return;

    switch (keyUpdate) {
      case "keterangan":
        reset({
          keterangan,
        });
        break;
    }
  }, [keyUpdate, setValue]);

  //   use modal input tanggal opname
  const {
    modalRef: modalInputTanggalOpnameRef,
    handleShowModal: showModalInputTanggalOpname,
    handleCloseModal: closeModalInputTanggalOpname,
  } = useModal();

  //   handle show modal input tanggal opname
  const handleShowModalInputTanggalOpname = () => {
    if (!tanggal) return;

    reset({
      tanggalOpname: new Date(tanggal).toISOString(),
    });
    showModalInputTanggalOpname();
  };

  //   handle close modal input tanggal opname
  const handleCloseModalInputTanggalOpname = () => {
    reset(undefined);
    closeModalInputTanggalOpname();
  };

  // handle reset form
  const handleResetForm = () => {
    reset(undefined);
    setKeyUpdate("");
  };

  //   mutate

  const { mutateAsync: mutateUpdate, isPending: isPendingUpdate } = useMutation(
    {
      mutationFn: (data: UpdateStockOpnameForRequestType) =>
        StockOpnameServices.update({
          id: idStockOpnameDetail!,
          req: data,
        }),
      onSuccess: () => {
        if (keyUpdate === "keterangan") {
          // handle toast
          handleSetToast("updated_keterangan");
        }

        if (keyUpdate === "tanggal") {
          // handle toast
          handleSetToast("updated_tanggal");
        }

        // refetch
        queryClient.refetchQueries({
          queryKey: ["stock-opname-detail", idStockOpnameDetail],
        });

        // close modal
        closeModalInputTanggalOpname();

        if (keyUpdate === "tanggal") {
          // reset timer
          setTimeout(() => {
            handleResetForm();
          }, 500);
        } else {
          handleResetForm();
        }
      },
      onError: (err) => {
        console.log(err);
      },
    },
  );

  const onSubmit = async (data: UpdateBarangMasukForRequestType) => {
    try {
      if (status === STATUS_STOCK_OPNAME_TYPE.APPROVED) return;

      await mutateUpdate(data);
    } catch (error) {
      console.log(error);
    }
  };

  //   handle key update
  const handleKeyUpdate = (key: "tanggal" | "keterangan") => {
    setKeyUpdate(key);

    //   show modal
    if (key === "tanggal") {
      handleShowModalInputTanggalOpname();
    }
  };

  return {
    register,
    errors,
    handleSubmit,
    onSubmit,
    keyUpdate,
    handleKeyUpdate,
    isPendingUpdate,
    handleResetForm,
    tanggalOpnameController,
    modalInputTanggalOpnameRef,
    handleCloseModalInputTanggalOpname,

    showKet,
    setShowKet,
  };
};

export default useInformasiStockOpnameDetail;
