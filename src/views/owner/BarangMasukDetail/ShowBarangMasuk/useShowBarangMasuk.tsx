import { useMutation, useQueryClient } from "@tanstack/react-query";
import useHighlight from "../../../../hooks/useHighlight";
import useModal from "../../../../hooks/useModal";
import { BarangMasukDetailServices } from "../../../../services/barangMasukDetail.service";
import { useLocation, useNavigate } from "react-router-dom";
import {
  STATUS_INVENTORI_TYPE,
  type StatusInventoriType,
} from "../../../../types/constant.type";
import type { UpdateBarangMasukDetailType } from "../../../../models/barangMasukDetail.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useController, useForm } from "react-hook-form";
import { BarangMasukDetailValidation } from "../../../../validations/barangMasukDetail.validation";
import { useState } from "react";
import axios from "axios";
import type { ErrorResponse } from "../../../../types/response.type";

const useShowBarangMasuk = (params: { status?: StatusInventoriType }) => {
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
    idModal: idBarangMasuk,
  } = useModal();

  //   use mutation
  const { mutateAsync: mutateDelete, isPending: isPendingDelete } = useMutation(
    {
      mutationFn: (data: { id: number; status: StatusInventoriType }) =>
        BarangMasukDetailServices.delete(data),
      onSuccess: () => {
        // invalidate
        queryClient.invalidateQueries({ queryKey: ["barang-masuk-detail"] });

        // set toast
        navigate(currentPathname, {
          state: {
            toast: "deleted_barang_masuk_detail",
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
    | (UpdateBarangMasukDetailType & {
        id: number;
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
  } = useForm<UpdateBarangMasukDetailType>({
    resolver: zodResolver(BarangMasukDetailValidation.UPDATE),
  });

  // jumlah box controller
  const jumlahBoxController = useController({
    control,
    name: "jumlahBox",
  });

  // handle set is data update
  const handleSetDataUpdate = (params: {
    data: (UpdateBarangMasukDetailType & { id: number }) | null;
  }) => {
    const { data } = params;

    // set state
    if (data) {
      // set state
      setDataUpdate({
        id: data.id,
        produkId: data.produkId,
        jumlahBox: data.jumlahBox,
      });

      // set value
      setValue("produkId", data.produkId);
      setValue("jumlahBox", data.jumlahBox);
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
        data: UpdateBarangMasukDetailType & {
          id: number;
          status: StatusInventoriType;
        },
      ) =>
        BarangMasukDetailServices.update({
          id: data.id,
          req: {
            produkId: data.produkId,
            jumlahBox: data.jumlahBox,
          },
          status: data.status,
        }),
      onSuccess: () => {
        // invalidate
        queryClient.invalidateQueries({
          queryKey: ["barang-masuk-detail"],
        });

        // set toast
        navigate(currentPathname, {
          state: {
            toast: "updated_barang_masuk_detail",
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
            err?.response?.data?.meta?.customField?.includes("same_jumlah_box")
          ) {
            setError("jumlahBox", {
              message: "Jumlah Box tidak boleh sama dengan sebelumnya",
            });
          }
        }
      },
    },
  );

  // handle update
  const onSubmit = async (data: UpdateBarangMasukDetailType) => {
    try {
      if (!dataUpdate || !data || !status) return;

      await mutateUpdate({
        jumlahBox: data.jumlahBox,
        id: dataUpdate.id,
        status,
      });
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
    jumlahBoxController,
    modalGantiProdukRef,
    handleCloseModalGantiProduk,
    handleShowModalGantiProduk,
    idBarangMasuk,
  };
};

export default useShowBarangMasuk;
