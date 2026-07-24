import { useState } from "react";
import { useToastAnimation } from "../../../hooks/useToast";
import { useFilterSearch } from "../../../hooks/useFilterSearch";
import { useFilter } from "../../../hooks/useFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PegawaiServices } from "../../../services/pegawai.service";
import useModal from "../../../hooks/useModal";
import type { ResponsePegawaiType } from "../../../models/pegawai.model";
import useDeletePegawai from "../../../hooks/useDeletePegawai";

const usePegawai = () => {
  const queryClient = useQueryClient();

  // Daftar pegawai yang dicentang untuk aksi hapus massal
  const [choosePegawai, setChoosePegawai] = useState<
    { id: number; nama: string }[]
  >([]);

  // Toggle centang/un-centang pegawai pada daftar pilihan hapus massal
  const handleSetChoosePegawai = (data: { id: number; nama: string }) => {
    if (choosePegawai.some((item) => item.id === data.id)) {
      setChoosePegawai(choosePegawai.filter((item) => item.id !== data.id));
    } else {
      setChoosePegawai((prev) => [...prev, data]);
    }
  };

  // Modal formulir tambah/edit pegawai
  const {
    modalRef: modalFormulirPegawaiRef,
    handleShowModal: showModalFormulirPegawai,
    handleCloseModal: handleCloseModalFormulirPegawai,
    idModal: idPegawaiForUpdate,
    dataModal: dataFormulirPegawai,
  } = useModal<{ data?: ResponsePegawaiType }>();

  // Modal konfirmasi hapus pegawai secara massal
  const {
    modalRef: modalDeleteManyRef,
    handleShowModal: handleShowModalDeleteMany,
    handleCloseModal: handleCloseModalDeleteMany,
    dataModal: dataDeleteMany,
  } = useModal<{
    data: {
      id: number;
      nama: string;
    }[];
  }>();

  // Toast notifikasi hasil aksi (create/update/delete)
  const { toast, handleSetToast } = useToastAnimation();

  // Filter pencarian pegawai (query param "search")
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

  // Ambil data pegawai dari server sesuai filter search/sort/page/limit
  const { data: dataPegawai, isLoading: isLoadingPegawai } = useQuery({
    queryKey: ["pegawai", search, sort, page, limit],
    queryFn: () =>
      PegawaiServices.findAll({
        ...(search && { search }),
        ...(sort && { sort }),
        ...(limit && { limit }),
        ...(page && { page }),
      }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Apakah data pegawai sudah selesai dimuat dan tidak kosong
  const isExistDataPegawai: boolean =
    !isLoadingPegawai && !!dataPegawai?.data?.data?.length;

  // Buka modal formulir pegawai; jika id diberikan, isi data pegawai untuk mode edit
  const handleShowModalFormulirPegawai = (id?: number) => {
    if (id) {
      const pegawai = dataPegawai?.data?.data.find((item) => item.id === id);

      if (pegawai) {
        return showModalFormulirPegawai(id, { data: pegawai });
      }

      return;
    } else {
      return showModalFormulirPegawai();
    }
  };

  // Mutation untuk menghapus beberapa pegawai sekaligus
  const { mutateAsync: deleteMany, isPending: isPendingDeleteMany } =
    useMutation({
      mutationFn: (ids: number[]) => PegawaiServices.deleteMany(ids),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pegawai"] });

        handleSetToast("deleted_pegawai");
        handleCloseModalDeleteMany();

        // Reset pilihan setelah berhasil dihapus
        setChoosePegawai([]);
      },
      onError: (err) => {
        console.log(err);
      },
    });

  // Proses hapus massal pegawai yang dicentang
  const handleDeleteMany = async () => {
    try {
      // Tidak ada yang dicentang, tidak perlu proses apa pun
      if (choosePegawai.length === 0) {
        return;
      }

      // Cek apakah seluruh data pegawai sama persis dengan yang dicentang
      const isSame =
        dataPegawai?.data?.data.length === choosePegawai.length &&
        dataPegawai?.data?.data.every((item) =>
          choosePegawai.includes({
            id: item.id,
            nama: item.nama,
          }),
        );

      if (isSame) return;

      await deleteMany(choosePegawai.map((item) => item.id));
    } catch (error) {
      console.log(error);
    }
  };

  // Hapus satu pegawai (modal konfirmasi, mutation, dsb dikelola oleh useDeletePegawai)
  const {
    dataDelete,
    handleCloseModalDelete,
    handleDelete,
    handleShowModalDelete,
    isPendingDelete,
    modalDeleteRef,
  } = useDeletePegawai({
    handleInvalidate: () =>
      queryClient.refetchQueries({ queryKey: ["pegawai"] }),
    handleToast: handleSetToast,
  });

  // Mutation untuk mengubah status aktif/nonaktif pegawai
  const {
    mutateAsync: mutateUpdateIsActive,
    isPending: isPendingUpdateIsActive,
    variables: variablesUpdateIsActive,
  } = useMutation({
    mutationFn: (data: { id: number; status: boolean }) =>
      PegawaiServices.updateIsActive({
        id: data.id,
        req: { status: data.status },
      }),
    onSuccess: () => {
      handleSetToast("updated_status");
      queryClient.invalidateQueries({ queryKey: ["pegawai"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // Ubah status aktif/nonaktif satu pegawai
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

  // Ekspos state & handler yang dibutuhkan oleh komponen UI daftar pegawai
  return {
    toast,
    dataPegawai,
    isLoadingPegawai,
    handleSearch,
    handleSort,
    handlePage,
    handleLimit,
    isExistDataPegawai,
    modalFormulirPegawaiRef,
    handleShowModalFormulirPegawai,
    handleCloseModalFormulirPegawai,
    idPegawaiForUpdate,
    dataFormulirPegawai,
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
    handleSetChoosePegawai,
    choosePegawai,
    sort,
    handelUpdateIsActive,
    variablesUpdateIsActive,
    isPendingUpdateIsActive,
  };
};

export default usePegawai;
