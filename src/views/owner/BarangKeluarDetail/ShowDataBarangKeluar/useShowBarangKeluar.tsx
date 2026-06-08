import { useMutation, useQueryClient } from "@tanstack/react-query";
import useHighlight from "../../../../hooks/useHighlight";
import useModal from "../../../../hooks/useModal";
import { useLocation, useNavigate } from "react-router-dom";
import {
  STATUS_INVENTORI_TYPE,
  type StatusInventoriType,
} from "../../../../types/constant.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useController, useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import type { ErrorResponse } from "../../../../types/response.type";
import { BarangKeluarDetailServices } from "../../../../services/barangKeluarDetail.service";
import type { UpdateBarangKeluarDetailType } from "../../../../models/barangKeluarDetail.model";
import { BarangKeluarDetailValidation } from "../../../../validations/barangKeluarDetail.validation";

const useShowBarangKeluar = (params: { status?: StatusInventoriType }) => {
  const { status } = params;

  // query client
  const queryClient = useQueryClient();

  // navigate
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  // use modal
  const {
    modalRef: modalDeleteRef,
    handleCloseModal: handleCloseModalDelete,
    handleShowModal: handleShowModalDelete,
    idModal: idDelete,
    dataDelete,
  } = useModal();

  // use modal ganti produk
  const {
    modalRef: modalGantiProdukRef,
    handleCloseModal: handleCloseModalGantiProduk,
    handleShowModal: handleShowModalGantiProduk,
    idModal: idBarangKeluar,
  } = useModal();

  //   use mutation
  const { mutateAsync: mutateDelete, isPending: isPendingDelete } = useMutation(
    {
      mutationFn: (data: { id: number; status: StatusInventoriType }) =>
        BarangKeluarDetailServices.delete(data),
      onSuccess: () => {
        // invalidate
        queryClient.invalidateQueries({ queryKey: ["barang-keluar-detail"] });

        // set toast
        navigate(currentPathname, {
          state: {
            toast: "deleted_barang_keluar_detail",
          },
        });

        // handle close
        handleCloseModalDelete();
      },
      onError: (err) => {
        console.log(err);
        handleCloseModalDelete();
      },
    },
  );

  //   handle delete
  const handleDelete = async () => {
    try {
      if (!idDelete || !status) return;

      await mutateDelete({
        id: idDelete,
        status,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // state data update
  const [dataUpdate, setDataUpdate] = useState<
    | (UpdateBarangKeluarDetailType & {
        id: number;
        type: "jumlahStok" | "hargaModalSatuan";
      })
    | null
  >(null);

  // update data
  const {
    control,
    setValue,
    formState: { isDirty },
    reset,
    handleSubmit,
    setError,
  } = useForm<UpdateBarangKeluarDetailType>({
    resolver: zodResolver(BarangKeluarDetailValidation.UPDATE),
  });

  // jumlah box controller
  const jumlahStokController = useController({
    control,
    name: "jumlahStok",
  });

  // harga modal satuan controller
  const hargaModalSatuanController = useController({
    control,
    name: "hargaModalSatuan",
  });

  // handle set is data update
  const handleSetDataUpdate = (params: {
    data:
      | (UpdateBarangKeluarDetailType & {
          id: number;
          type: "jumlahStok" | "hargaModalSatuan";
        })
      | null;
  }) => {
    const { data } = params;

    // set state
    if (data) {
      // set state
      setDataUpdate({
        id: data.id,
        produkId: undefined,
        jumlahStok: data.jumlahStok,
        hargaModalSatuan: data.hargaModalSatuan,
        type: data.type,
      });

      // set value
      setValue("produkId", data.produkId);
      setValue("jumlahStok", data.jumlahStok);
      setValue("hargaModalSatuan", data.hargaModalSatuan);
    }
  };

  // handle clear form
  const handleClearDataUpdate = () => {
    reset();
    setDataUpdate(null);
  };

  // mutation
  const { mutateAsync: mutateUpdate, isPending: isPendingUpdate } = useMutation(
    {
      mutationFn: (
        data: UpdateBarangKeluarDetailType & {
          id: number;
          status: StatusInventoriType;
        },
      ) =>
        BarangKeluarDetailServices.update({
          id: data.id,
          req: {
            produkId: data.produkId,
            jumlahStok: data.jumlahStok,
            hargaModalSatuan: data.hargaModalSatuan,
          },
          status: data.status,
        }),
      onSuccess: () => {
        // invalidate
        queryClient.invalidateQueries({
          queryKey: ["barang-keluar-detail"],
        });

        // set toast
        navigate(currentPathname, {
          state: {
            toast: "updated_barang_keluar_detail",
          },
        });

        // set data update
        setDataUpdate(null);

        // reset
        reset();
      },
      onError: (err) => {
        if (axios.isAxiosError<ErrorResponse>(err)) {
          if (
            err?.response?.data?.meta?.customField?.includes("same_jumlah_stok")
          ) {
            setError("jumlahStok", {
              message: "Jumlah Stok tidak boleh sama dengan sebelumnya",
            });
          }
        }
      },
    },
  );

  // handle update
  const onSubmit = async (data: UpdateBarangKeluarDetailType) => {
    try {
      if (!dataUpdate || !data || !status) return;

      console.log(data.jumlahStok, dataUpdate.jumlahStok);

      // check same jumlah stok
      if (
        dataUpdate.type === "jumlahStok" &&
        data.jumlahStok === dataUpdate.jumlahStok
      ) {
        setError("jumlahStok", {
          message: "Jumlah Stok tidak boleh sama dengan sebelumnya",
        });
        return;
      }

      let finalData: UpdateBarangKeluarDetailType | null = null;

      if (dataUpdate.type === "jumlahStok") {
        finalData = {
          jumlahStok: data.jumlahStok,
        };
      } else if (dataUpdate.type === "hargaModalSatuan") {
        finalData = {
          hargaModalSatuan: data.hargaModalSatuan,
        };
      }

      console.log(finalData);

      await mutateUpdate({ ...finalData, id: dataUpdate.id, status });
    } catch (error) {
      console.log(error);
    }
  };

  // highlight
  const {
    handleSetIsHighlight: handleSetIsActiveAksi,
    isHighlight: isActiveAksi,
    wrapperRef,
  } = useHighlight();

  // status
  const isStatusPosted = status === STATUS_INVENTORI_TYPE.POSTED;

  return {
    handleSetIsActiveAksi,
    isActiveAksi,
    wrapperRef,
    handleShowModalDelete,
    handleCloseModalDelete,
    modalDeleteRef,
    isPendingDelete,
    handleDelete,
    dataDelete,
    handleSetDataUpdate,
    dataUpdate,
    handleClearDataUpdate,
    handleSubmit,
    onSubmit,
    isPendingUpdate,
    isStatusPosted,
    isDirty,
    jumlahStokController,
    modalGantiProdukRef,
    handleCloseModalGantiProduk,
    handleShowModalGantiProduk,
    idBarangKeluar,
    hargaModalSatuanController,
  };
};

export default useShowBarangKeluar;
