import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import type { UpdateBarangMasukForRequestType } from "../../../../models/barangMasuk.model";
import { BarangMasukValidation } from "../../../../validations/barangMasuk.validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BarangMasukServices } from "../../../../services/barangMasuk.service";
import useModal from "../../../../hooks/useModal";
import {
  STATUS_INVENTORI_TYPE,
  type StatusInventoriType,
} from "../../../../types/constant.type";

const useInformasiBarangMasuk = (params: {
  tanggalMasuk?: Date;
  keterangan?: string;
  idBarangMasukDetail?: number;
  status?: StatusInventoriType;
  handleSetToast: (data: string) => void;
}) => {
  const {
    keterangan,
    tanggalMasuk,
    idBarangMasukDetail,
    handleSetToast,
    status,
  } = params;
  // state key update
  const [keyUpdate, setKeyUpdate] = useState<
    "tanggalMasuk" | "keterangan" | ""
  >("");

  //   query client
  const queryClient = useQueryClient();

  // use form upadate
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    control,
  } = useForm<UpdateBarangMasukForRequestType>({
    resolver: zodResolver(BarangMasukValidation.UPDATE),
  });

  //   use controll tanggal masuk
  const tanggalMasukController = useController({
    name: "tanggalMasuk",
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

  //   use modal input tanggal masuk
  const {
    modalRef: modalInputTanggalMasukRef,
    handleShowModal: showModalInputTanggalMasuk,
    handleCloseModal: closeModalInputTanggalMasuk,
  } = useModal();

  //   handle show modal input tanggal masuk
  const handleShowModalInputTanggalMasuk = () => {
    if (!tanggalMasuk) return;

    reset({
      tanggalMasuk: new Date(tanggalMasuk).toISOString(),
    });
    showModalInputTanggalMasuk();
  };

  //   handle close modal input tanggal masuk
  const handleCloseModalInputTanggalMasuk = () => {
    reset(undefined);
    closeModalInputTanggalMasuk();
  };

  // handle reset form
  const handleResetForm = () => {
    reset(undefined);
    setKeyUpdate("");
  };

  //   mutate

  const { mutateAsync: mutateUpdate, isPending: isPendingUpdate } = useMutation(
    {
      mutationFn: (data: UpdateBarangMasukForRequestType) =>
        BarangMasukServices.update({
          id: idBarangMasukDetail!,
          req: data,
        }),
      onSuccess: () => {
        if (keyUpdate === "keterangan") {
          // handle toast
          handleSetToast("updated_keterangan");
        }

        if (keyUpdate === "tanggalMasuk") {
          // handle toast
          handleSetToast("updated_tanggalMasuk");
        }

        // refetch
        queryClient.refetchQueries({
          queryKey: ["barang-masuk-detail", idBarangMasukDetail],
        });

        // close modal
        closeModalInputTanggalMasuk();

        if (keyUpdate === "tanggalMasuk") {
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
      if (status === STATUS_INVENTORI_TYPE.POSTED) return;

      await mutateUpdate(data);
    } catch (error) {
      console.log(error);
    }
  };

  //   handle key update
  const handleKeyUpdate = (key: "tanggalMasuk" | "keterangan") => {
    setKeyUpdate(key);

    //   show modal
    if (key === "tanggalMasuk") {
      handleShowModalInputTanggalMasuk();
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
    modalInputTanggalMasukRef,
    handleCloseModalInputTanggalMasuk,
    tanggalMasukController,
  };
};

export default useInformasiBarangMasuk;
