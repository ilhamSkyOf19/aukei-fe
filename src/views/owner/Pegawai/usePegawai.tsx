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
  // query client
  const queryClient = useQueryClient();

  // state choose barang
  const [choosePegawai, setChoosePegawai] = useState<
    { id: number; nama: string }[]
  >([]);

  // handle set choose
  const handleSetChoosePegawai = (data: { id: number; nama: string }) => {
    if (choosePegawai.some((item) => item.id === data.id)) {
      setChoosePegawai(choosePegawai.filter((item) => item.id !== data.id));
    } else {
      setChoosePegawai((prev) => [...prev, data]);
    }
  };

  // use modal
  const {
    modalRef: modalFormulirPegawaiRef,
    handleShowModal: showModalFormulirPegawai,
    handleCloseModal: handleCloseModalFormulirPegawai,
    idModal: idPegawaiForUpdate,
    dataModal: dataFormulirPegawai,
  } = useModal<{ data?: ResponsePegawaiType }>();

  // use modal delete many
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

  const isExistDataPegawai: boolean =
    !isLoadingPegawai && dataPegawai?.data?.data
      ? dataPegawai?.data?.data?.length > 0
        ? true
        : false
      : false;

  // handle show modal
  const handleShowModalFormulirPegawai = (id?: number) => {
    // find pegawai
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

  // use mutation delete many
  const { mutateAsync: deleteMany, isPending: isPendingDeleteMany } =
    useMutation({
      mutationFn: (ids: number[]) => PegawaiServices.deleteMany(ids),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pegawai"] });

        // handle toast
        handleSetToast("deleted_pegawai");

        // close modal
        handleCloseModalDeleteMany();

        // reset choose
        setChoosePegawai([]);
      },
      onError: (err) => {
        console.log(err);
      },
    });

  // handle delete many
  const handleDeleteMany = async () => {
    try {
      // check choose barang
      if (choosePegawai.length === 0) {
        return;
      }

      // check
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

  // use delete barang masuk
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
  };
};

export default usePegawai;
