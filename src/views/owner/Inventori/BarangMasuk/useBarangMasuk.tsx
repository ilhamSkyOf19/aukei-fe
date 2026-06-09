import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarangMasukServices } from "../../../../services/barangMasuk.service";
import { useFilterSearch } from "../../../../hooks/useFilterSearch";
import { useFilter } from "../../../../hooks/useFilter";
import { useToastAnimation } from "../../../../hooks/useToast";
import useModal from "../../../../hooks/useModal";
import { useLocation, useNavigate } from "react-router-dom";
import useHighlight from "../../../../hooks/useHighlight";
import useDeleteBarangMasuk from "../../../../hooks/useDeleteBarangMasuk";
import { useState } from "react";
import useFilterRangeDate from "../../../../hooks/useFilterRangeDate";

const useBarangMasuk = () => {
  // navigate
  const navigate = useNavigate();
  // current pathname
  const currentPathname = useLocation().pathname;

  // query client
  const queryClient = useQueryClient();

  // state choose barang
  const [chooseBarangMasuk, setChooseBarangMasuk] = useState<
    { id: number; kodeReferensi: string }[]
  >([]);

  // handle set choose
  const handleSetChooseBarangMasuk = (data: {
    id: number;
    kodeReferensi: string;
  }) => {
    if (chooseBarangMasuk.some((item) => item.id === data.id)) {
      setChooseBarangMasuk(
        chooseBarangMasuk.filter((item) => item.id !== data.id),
      );
    } else {
      setChooseBarangMasuk((prev) => [...prev, data]);
    }
  };

  // filter search
  const { search, setSearch: handleSearch } = useFilterSearch("search");

  // highlight
  const {
    handleSetIsHighlight: handleSetIsActiveAksi,
    isHighlight: isActiveAksi,
    wrapperRef,
  } = useHighlight();

  // use modal formulir barang masuk
  const {
    modalRef: modalFormulirBarangMasukRef,
    handleCloseModal: handleCloseModalFormulirBarangMasuk,
    handleShowModal: handleShowModalFormulirBarangMasuk,
  } = useModal();

  // use modal
  const {
    modalRef: modalDeleteManyRef,
    handleShowModal: handleShowModalDeleteMany,
    handleCloseModal: handleCloseModalDeleteMany,
    dataModal: dataDeleteMany,
  } = useModal<{
    data: {
      id: number;
      kodeReferensi: string;
    }[];
  }>();

  // filter sort
  const { filter: sort, setFilter: handleSort } = useFilter({
    paramName: "sort",
    allowQuery: ["asc", "desc"],
  });

  // filter limit
  const { filter: limit, setFilter: handleLimit } = useFilter({
    paramName: "limit",
    isNumber: true,
  });

  // filter page
  const { filter: page, setFilter: handlePage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // filter range date
  const { endDate, startDate } = useFilterRangeDate();

  //   toast
  const { toast, handleSetToast } = useToastAnimation();

  // query
  const { data: dataBarangMasuk, isLoading: isLoadingBarangMasuk } = useQuery({
    queryKey: ["barang-masuk", search, sort, limit, page, startDate, endDate],
    queryFn: () =>
      BarangMasukServices.all({
        ...(search && { search }),
        ...(sort && { sort }),
        ...(limit && { limit }),
        ...(page && { page }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  //   is exist data
  const isExistDataBarangMasuk: boolean =
    !isLoadingBarangMasuk && dataBarangMasuk?.data?.data
      ? dataBarangMasuk?.data?.data?.length > 0
        ? true
        : false
      : false;

  // handle redirect detail
  const handleRedirectDetail = (id: number) => {
    navigate(`${currentPathname}/barang-masuk/${id}`);
  };

  // use mutation delete many
  const { mutateAsync: deleteMany, isPending: isPendingDeleteMany } =
    useMutation({
      mutationFn: (ids: number[]) => BarangMasukServices.deleteMany(ids),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["barang-masuk"] });

        // handle toast
        handleSetToast("deleted_barang_masuk");

        // close modal
        handleCloseModalDeleteMany();

        // reset choose
        setChooseBarangMasuk([]);
      },
      onError: (err) => {
        console.log(err);
      },
    });

  // handle delete many
  const handleDeleteMany = async () => {
    try {
      // check choose barang
      if (chooseBarangMasuk.length === 0) {
        return;
      }

      // check
      const isSame =
        dataBarangMasuk?.data?.data.length === chooseBarangMasuk.length &&
        dataBarangMasuk?.data?.data.every((item) =>
          chooseBarangMasuk.includes({
            id: item.id,
            kodeReferensi: item.kodeReferensi,
          }),
        );

      if (isSame) return;

      await deleteMany(chooseBarangMasuk.map((item) => item.id));
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
  } = useDeleteBarangMasuk({
    handleInvalidate: () =>
      queryClient.refetchQueries({ queryKey: ["barang-masuk"] }),
    handleToast: handleSetToast,
  });

  return {
    dataBarangMasuk,
    isLoadingBarangMasuk,
    handleSearch,
    handleSort,
    handleLimit,
    handlePage,
    toast,
    isExistDataBarangMasuk,
    modalFormulirBarangMasukRef,
    handleCloseModalFormulirBarangMasuk,
    handleShowModalFormulirBarangMasuk,
    isActiveAksi,
    handleSetIsActiveAksi,
    wrapperRef,
    handleRedirectDetail,
    modalDeleteRef,
    handleCloseModalDelete,
    handleShowModalDelete,
    handleDelete,
    dataDelete,
    isPendingDelete,
    chooseBarangMasuk,
    handleSetChooseBarangMasuk,
    modalDeleteManyRef,
    handleShowModalDeleteMany,
    handleCloseModalDeleteMany,
    handleDeleteMany,
    dataDeleteMany,
    isPendingDeleteMany,
  };
};

export default useBarangMasuk;
