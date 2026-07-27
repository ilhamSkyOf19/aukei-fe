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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Daftar pelanggan yang dicentang untuk aksi hapus massal
  const [choosePelanggan, setChoosePelanggan] = useState<
    { id: number; nama: string }[]
  >([]);

  // Toggle centang/un-centang pelanggan pada daftar pilihan hapus massal
  const handleSetChoosePelanggan = (data: { id: number; nama: string }) => {
    if (choosePelanggan.some((item) => item.id === data.id)) {
      setChoosePelanggan(choosePelanggan.filter((item) => item.id !== data.id));
    } else {
      setChoosePelanggan((prev) => [...prev, data]);
    }
  };

  // Modal alert saat penghapusan pelanggan gagal (misal karena masih punya riwayat transaksi)
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

  // Modal formulir tambah/edit pelanggan
  const {
    modalRef: modalFormulirPelangganRef,
    handleShowModal: showModalFormulirPelanggan,
    handleCloseModal: handleCloseModalFormulirPelanggan,
    idModal: idPelangganForUpdate,
    dataModal: dataFormulirPelanggan,
  } = useModal<{ data?: ResponsePelangganType }>();

  // Modal konfirmasi hapus pelanggan secara massal
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

  // Toast notifikasi hasil aksi (create/update/delete)
  const { toast, handleSetToast } = useToastAnimation();

  // Filter pencarian pelanggan (query param "search")
  const { search, setSearch: handleSearch } = useFilterSearch("search");

  // Filter urutan data (query param "sort")
  const { filter: sort, setFilter: handleSort } = useFilter({
    paramName: "sort",
    allowQuery: ["asc", "desc"],
  });

  // Filter halaman (pagination, query param "page")
  const { filter: page, setFilter: handlePage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // Filter jumlah data per halaman (query param "limit")
  const { filter: limit, setFilter: handleLimit } = useFilter({
    paramName: "limit",
    isNumber: true,
  });

  // Ambil data pelanggan beserta riwayat transaksi dari server sesuai filter
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

  // Apakah data pelanggan sudah selesai dimuat dan tidak kosong
  const isExistDataPelanggan: boolean =
    !isLoadingPelanggan && !!dataPelanggan?.data?.data?.length;

  // Buka modal formulir pelanggan; jika id diberikan, isi data pelanggan untuk mode edit
  const handleShowModalFormulirPelanggan = (id?: number) => {
    if (id) {
      const pelangganDitemukan = dataPelanggan?.data?.data.find(
        (item) => item.id === id,
      );

      if (pelangganDitemukan) {
        return showModalFormulirPelanggan(id, { data: pelangganDitemukan });
      }

      return;
    } else {
      return showModalFormulirPelanggan();
    }
  };

  // Mutation untuk menghapus beberapa pelanggan sekaligus
  const { mutateAsync: deleteMany, isPending: isPendingDeleteMany } =
    useMutation({
      mutationFn: (ids: number[]) => PelangganServices.deleteMany({ ids }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pelanggan"] });

        handleSetToast("deleted_pelanggan");
        handleCloseModalDeleteMany();

        // Reset pilihan setelah berhasil dihapus
        setChoosePelanggan([]);
      },
      onError: (err) => {
        // Tampilkan modal khusus jika gagal karena pelanggan masih punya riwayat transaksi
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

  // Proses hapus massal pelanggan yang dicentang
  const handleDeleteMany = async () => {
    try {
      // Tidak ada yang dicentang, tidak perlu proses apa pun
      if (choosePelanggan.length === 0) {
        return;
      }

      // Cek apakah seluruh data pelanggan sama persis dengan yang dicentang
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

  // Mutation untuk mengubah status aktif/nonaktif pelanggan
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
      queryClient.invalidateQueries({ queryKey: ["pelanggan"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // Ubah status aktif/nonaktif satu pelanggan
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

  // Arahkan ke halaman detail riwayat transaksi pelanggan
  const handleRedirectRiwayatTransaksiDetail = (id: number) => {
    navigate(`/dashboard/riwayat-transaksi/pelanggan/${id}`);
  };

  // Hapus satu pelanggan (modal konfirmasi, mutation, dsb dikelola oleh useDeletePelanggan)
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

  // Ekspos state & handler yang dibutuhkan oleh komponen UI daftar pelanggan
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
