import { useState } from "react";
import { useToastAnimation } from "../../../hooks/useToast";
import { useFilterSearch } from "../../../hooks/useFilterSearch";
import { useFilter } from "../../../hooks/useFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PelangganServices } from "../../../services/pelanggan.service";
import useModal from "../../../hooks/useModal";
import type { ResponsePelangganType } from "../../../models/pelanggan.model";
import useDeletePelanggan from "../../../hooks/useDeletePelanggan";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";
import { useNavigate } from "react-router-dom";

const usePelanggan = () => {
  // navigate
  const navigate = useNavigate();

  // query client
  const queryClient = useQueryClient();

  // state choose barang
  const [choosePelanggan, setChoosePelanggan] = useState<
    { id: number; nama: string }[]
  >([]);

  // handle set choose
  const handleSetChoosePelanggan = (data: { id: number; nama: string }) => {
    if (choosePelanggan.some((item) => item.id === data.id)) {
      setChoosePelanggan(choosePelanggan.filter((item) => item.id !== data.id));
    } else {
      setChoosePelanggan((prev) => [...prev, data]);
    }
  };

  // use modal alert failed delete
  const {
    modalRef: modalFailedDeleteRef,
    handleShowModal: handleShowModalFailedDelete,
    handleCloseModal: handleCloseModalFailedDelete,
    dataModal: dataFailedDelete,
  } = useModal<{
    data?: { nama: string };
    message: string;
    description: string;
  }>();

  // use modal
  const {
    modalRef: modalFormulirPelangganRef,
    handleShowModal: showModalFormulirPelanggan,
    handleCloseModal: handleCloseModalFormulirPelanggan,
    idModal: idPelangganForUpdate,
    dataModal: dataFormulirPelanggan,
  } = useModal<{ data?: ResponsePelangganType }>();

  // use modal delete many
  const {
    modalRef: modalDeleteManyRef,
    handleShowModal: handleShowModalDeleteMany,
    handleCloseModal: handleCloseModalDeleteMany,
    dataModal: dataDeleteMany,
  } = useModal<{
    data: {
      nama: string;
    }[];
  }>();

  // use toast
  const { toast, handleSetToast } = useToastAnimation();

  //   filter search
  const { search, setSearch: handleSearch } = useFilterSearch("search");

  // sort
  const { filter: sort, setFilter: handleSort } = useFilter({
    paramName: "sort",
    allowQuery: ["asc", "desc"],
  });

  //   page
  const { filter: page, setFilter: handlePage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  //   limit
  const { filter: limit, setFilter: handleLimit } = useFilter({
    paramName: "limit",
    isNumber: true,
  });

  //   call query
  const { data: dataPelanggan, isLoading: isLoadingPelanggan } = useQuery({
    queryKey: ["pelanggan", search, sort, page, limit],
    queryFn: () =>
      PelangganServices.findAllWithRiwayat({
        ...(search && { search }),
        ...(sort && { sort }),
        ...(limit && { limit }),
        ...(page && { page }),
      }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const isExistDataPelanggan: boolean =
    !isLoadingPelanggan && dataPelanggan?.data?.data
      ? dataPelanggan?.data?.data?.length > 0
        ? true
        : false
      : false;

  // handle show modal
  const handleShowModalFormulirPelanggan = (id?: number) => {
    // find Pelanggan
    if (id) {
      const Pelanggan = dataPelanggan?.data?.data.find(
        (item) => item.id === id,
      );

      if (Pelanggan) {
        return showModalFormulirPelanggan(id, { data: Pelanggan });
      }

      return;
    } else {
      return showModalFormulirPelanggan();
    }
  };

  // use mutation delete many
  const { mutateAsync: deleteMany, isPending: isPendingDeleteMany } =
    useMutation({
      mutationFn: (ids: number[]) => PelangganServices.deleteMany({ ids }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pelanggan"] });

        // handle toast
        handleSetToast("deleted_pelanggan");

        // close modal
        handleCloseModalDeleteMany();

        // reset choose
        setChoosePelanggan([]);
      },
      onError: (err) => {
        if (axios.isAxiosError<ErrorResponse>(err)) {
          if (
            err.response?.data.meta.message?.includes(
              "Relationship constraint failed",
            )
          ) {
            handleShowModalFailedDelete(undefined, {
              message: `Mohon maaf beberapa pelanggan yang dipilih tidak dapat dihapus karena memiliki riwayat transaksi`,
              description:
                "Silahkan pilih pelanggan yang tidak memiliki riwayat transaksi",
            });
          }
        }
      },
    });

  // handle delete many
  const handleDeleteMany = async () => {
    try {
      // check choose barang
      if (choosePelanggan.length === 0) {
        return;
      }

      // check
      const isSame =
        dataPelanggan?.data?.data.length === choosePelanggan.length &&
        dataPelanggan?.data?.data.every((item) =>
          choosePelanggan.includes({
            id: item.id,
            nama: item.nama,
          }),
        );

      if (isSame) return;

      await deleteMany(choosePelanggan.map((item) => item.id));
    } catch (error) {
      console.log(error);
    }
  };

  // handle update is active
  const {
    mutateAsync: mutateUpdateIsActive,
    isPending: isPendingUpdateIsActive,
    variables: variablesUpdateIsActive,
  } = useMutation({
    mutationFn: (data: { id: number; status: boolean }) =>
      PelangganServices.updateisActive({
        id: data.id,
        req: { status: data.status },
      }),
    onSuccess: () => {
      handleSetToast("updated_status");

      // invalidate
      queryClient.invalidateQueries({ queryKey: ["pelanggan"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // handle update is active
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

  // handle redirect riwayat transaksi
  const handleRedirectRiwayatTransaksiDetail = (id: number) => {
    navigate(`/dashboard/riwayat-transaksi/detail/${id}`);
  };

  // use delete pelanggan
  const {
    dataDelete,
    handleCloseModalDelete,
    handleDelete,
    handleShowModalDelete,
    isPendingDelete,
    modalDeleteRef,
  } = useDeletePelanggan({
    handleShowModalFailedDelete,
    handleInvalidate: () =>
      queryClient.refetchQueries({ queryKey: ["pelanggan"] }),
    handleToast: handleSetToast,
  });

  return {
    toast,
    dataPelanggan,
    isLoadingPelanggan,
    handleSearch,
    handleSort,
    handlePage,
    handleLimit,
    isExistDataPelanggan,
    modalFormulirPelangganRef,
    handleShowModalFormulirPelanggan,
    handleCloseModalFormulirPelanggan,
    idPelangganForUpdate,
    dataFormulirPelanggan,
    handleShowModalDelete,
    handleCloseModalDelete,
    dataDelete,
    isPendingDelete,
    modalDeleteRef,
    handleDelete,
    handleDeleteMany,
    isPendingDeleteMany,
    modalDeleteManyRef,
    dataDeleteMany,
    handleShowModalDeleteMany,
    handleCloseModalDeleteMany,
    handleSetChoosePelanggan,
    choosePelanggan,
    sort,
    modalFailedDeleteRef,
    handleCloseModalFailedDelete,
    dataFailedDelete,
    handelUpdateIsActive,
    isPendingUpdateIsActive,
    variablesUpdateIsActive,
    handleRedirectRiwayatTransaksiDetail,
  };
};

export default usePelanggan;
