import { useFilterSearch } from "../../../../../hooks/useFilterSearch";
import { useFilter } from "../../../../../hooks/useFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KategoriProdukServices } from "../../../../../services/kategoriProduk.service";
import useModal from "../../../../../hooks/useModal";
import { useEffect, useState } from "react";
import type { UpdateKategoriProdukType } from "../../../../../models/kategoriProduk.model";
import { useToastAnimation } from "../../../../../hooks/useToast";
import axios from "axios";
import type { ErrorResponse } from "../../../../../types/response.type";
import { useAlertAnimation } from "../../../../../hooks/useAlert";

const useShowData = () => {
  // query client
  const queryClient = useQueryClient();

  // state data update
  const [dataKategoriForUpdate, setDataKategoriForUpdate] = useState<
    (UpdateKategoriProdukType & { id: number }) | null
  >(null);

  // toast
  const { toast, handleSetToast } = useToastAnimation();

  // alert
  const { alert, handleSetAlert } = useAlertAnimation();

  // search filter
  const { search, setSearch: handleSearch } = useFilterSearch("search");

  // sort filter
  const { filter: sort, setFilter: handleSort } = useFilter({
    paramName: "sort",
    allowQuery: ["asc", "desc"],
  });

  // page filter
  const { filter: page, setFilter: handlePage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // limit filter
  const { filter: limit, setFilter: handleLimit } = useFilter({
    paramName: "limit",
    isNumber: true,
  });

  // use query
  const { data: dataKategoriProduk, isLoading: isLoadingKategoriProduk } =
    useQuery({
      queryKey: ["kategori-produk", { search, sort, limit, page }],
      queryFn: () =>
        KategoriProdukServices.findAll({
          ...(search && { search }),
          ...(sort && { sort }),
          ...(limit && { limit }),
          ...(page && { page }),
        }),
      refetchOnWindowFocus: false,
      retry: false,
    });

  // is exist data
  const isExistDataKategoriProduk =
    !isLoadingKategoriProduk && dataKategoriProduk?.data?.data
      ? dataKategoriProduk?.data?.data?.length > 0
        ? true
        : false
      : false;

  // use modal
  const {
    modalRef: modalFormulirKategoriRef,
    handleCloseModal: closeModalFormulirKategori,
    handleShowModal: handleShowModalFormulirKategori,
    idModal: idModalFormulirKategori,
  } = useModal();

  // use modal delete
  const {
    modalRef: modalDeleteRef,
    handleCloseModal: handleCloseModalDelete,
    handleShowModal: handleShowModalDelete,
    idModal: idModalDelete,
    dataModal: dataDelete,
  } = useModal<{ nama: string }>();

  // set data update
  useEffect(() => {
    if (idModalFormulirKategori) {
      const findData = dataKategoriProduk?.data?.data?.find(
        (item) => item.id === idModalFormulirKategori,
      );

      // check
      if (findData) {
        setDataKategoriForUpdate({
          id: findData.id,
          nama: findData.nama,
          keterangan: findData.keterangan || undefined,
        });
      }
    }
  }, [idModalFormulirKategori]);

  // handle close modal
  const handleCloseModalFormulirKategori = () => {
    setDataKategoriForUpdate(null);
    closeModalFormulirKategori();
  };

  // use mutation delete
  const { mutateAsync: handleMutateDelete, isPending: isPendingDelete } =
    useMutation({
      mutationFn: (id: number) => KategoriProdukServices.delete(id),
      onSuccess: () => {
        // handle toast
        handleSetToast("deleted");

        // refetch
        queryClient.invalidateQueries({ queryKey: ["kategori-produk"] });

        handleCloseModalDelete();
      },
      onError: (err) => {
        // handle close modal delete
        handleCloseModalDelete();

        if (axios.isAxiosError<ErrorResponse>(err)) {
          if (
            err?.response?.data?.meta?.customField?.includes("KategoriProduk")
          ) {
            // show modal alert
            handleSetAlert("cancel_delete");
          }
        }
      },
    });

  // handle delete
  const handleDelete = async () => {
    try {
      if (idModalDelete) {
        await handleMutateDelete(idModalDelete);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleSearch,
    handleSort,
    handleLimit,
    handlePage,
    dataKategoriProduk,
    isLoadingKategoriProduk,
    isExistDataKategoriProduk,
    modalFormulirKategoriRef,
    handleCloseModalFormulirKategori,
    handleShowModalFormulirKategori,
    dataKategoriForUpdate,
    handleDelete,
    isPendingDelete,
    modalDeleteRef,
    handleShowModalDelete,
    handleCloseModalDelete,
    dataDelete,
    toast,
    alert,
  };
};

export default useShowData;
