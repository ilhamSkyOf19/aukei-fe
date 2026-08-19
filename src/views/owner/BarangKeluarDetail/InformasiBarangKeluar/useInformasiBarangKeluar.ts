import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import type { UpdateBarangMasukForRequestType } from "../../../../models/barangMasuk.model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useModal from "../../../../hooks/useModal";
import type { IJenisKeluarType } from "../../../../models/jenisKeluar.model";
import type { UpdateBarangKeluarForRequestType } from "../../../../models/barangKeluar.model";
import { BarangKeluarValidation } from "../../../../validations/barangKeluar.validation";
import { BarangKeluarServices } from "../../../../services/barangKeluar.service";
import { JenisKeluarServices } from "../../../../services/jenisKeluar.service";
import {
  STATUS_INVENTORI_TYPE,
  type StatusInventoriType,
} from "../../../../types/constant.type";

const useInformasiBarangKeluar = (params: {
  tanggalKeluar?: Date;
  keterangan?: string;
  jenisKeluar?: Pick<IJenisKeluarType, "id" | "nama">;
  idBarangKeluarDetail?: number;
  status?: StatusInventoriType;
  handleSetToast: (data: string) => void;
}) => {
  const {
    keterangan,
    tanggalKeluar,
    jenisKeluar,
    idBarangKeluarDetail,
    handleSetToast,
    status,
  } = params;
  // state key update
  const [keyUpdate, setKeyUpdate] = useState<
    "tanggalKeluar" | "keterangan" | "jenisKeluar" | ""
  >("");

  //   query client
  const queryClient = useQueryClient();

  // get jenis keluar
  const { data: dataJenisKeluarForChoose, isLoading: isLoadingJenisKeluar } =
    useQuery({
      queryKey: ["jenis-keluar-for-choose"],
      queryFn: () => JenisKeluarServices.findAll(),
      retry: false,
      refetchOnWindowFocus: false,
    });

  // use form upadate
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    control,
    setError,
  } = useForm<UpdateBarangKeluarForRequestType>({
    resolver: zodResolver(BarangKeluarValidation.UPDATE),
  });

  //   use controll tanggal keluar
  const tanggalKeluarController = useController({
    name: "tanggalKeluar",
    control,
  });

  //   use controll jenis keluar
  const jenisKeluarIdController = useController({
    name: "jenisKeluarId",
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
      case "jenisKeluar":
        reset({
          jenisKeluarId: jenisKeluar?.id,
        });
        break;
    }
  }, [keyUpdate, setValue]);

  //   use modal input tanggal keluar
  const {
    modalRef: modalInputTanggalKeluarRef,
    handleShowModal: showModalInputTanggalKeluar,
    handleCloseModal: closeModalInputTanggalKeluar,
  } = useModal();

  //   handle show modal input tanggal masuk
  const handleShowModalInputTanggalKeluar = () => {
    if (!tanggalKeluar) return;

    reset({
      tanggalKeluar: new Date(tanggalKeluar).toISOString(),
    });
    showModalInputTanggalKeluar();
  };

  //   handle close modal input tanggal masuk
  const handleCloseModalInputTanggalKeluar = () => {
    reset(undefined);
    closeModalInputTanggalKeluar();
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
        BarangKeluarServices.update({
          id: idBarangKeluarDetail!,
          req: data,
        }),
      onSuccess: () => {
        if (keyUpdate === "keterangan") {
          // handle toast
          handleSetToast("updated_keterangan");
        }

        if (keyUpdate === "tanggalKeluar") {
          // handle toast
          handleSetToast("updated_tanggalKeluar");
        }

        if (keyUpdate === "jenisKeluar") {
          // handle toast
          handleSetToast("updated_tanggalKeluar");
        }

        // refetch
        queryClient.refetchQueries({
          queryKey: ["barang-keluar-detail", idBarangKeluarDetail],
        });

        // close modal
        closeModalInputTanggalKeluar();

        // reset timer
        if (keyUpdate === "tanggalKeluar") {
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

  const onSubmit = async (data: UpdateBarangKeluarForRequestType) => {
    try {
      // status
      if (status === STATUS_INVENTORI_TYPE.POSTED) return;
      // check
      if (data.jenisKeluarId) {
        const findJenisKeluar = dataJenisKeluarForChoose?.data?.find(
          (item) => item.id === data.jenisKeluarId,
        );

        if (!findJenisKeluar) {
          return setError("jenisKeluarId", {
            message: "Jenis keluar tidak ditemukan",
          });
        }

        if (findJenisKeluar.id === jenisKeluar?.id) {
          return setError("jenisKeluarId", {
            message: "Jenis keluar tidak boleh sama",
          });
        }
      }

      await mutateUpdate(data);
    } catch (error) {
      console.log(error);
    }
  };

  //   handle key update
  const handleKeyUpdate = (
    key: "tanggalKeluar" | "keterangan" | "jenisKeluar",
  ) => {
    setKeyUpdate(key);

    //   show modal
    if (key === "tanggalKeluar") {
      handleShowModalInputTanggalKeluar();
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
    modalInputTanggalKeluarRef,
    handleCloseModalInputTanggalKeluar,
    tanggalKeluarController,
    jenisKeluarIdController,
    dataJenisKeluarForChoose,
    isLoadingJenisKeluar,
  };
};

export default useInformasiBarangKeluar;
