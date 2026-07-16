import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarangKeluarServices } from "../../../../services/barangKeluar.service";
import { useFilterSearch } from "../../../../hooks/useFilterSearch";
import { useFilter } from "../../../../hooks/useFilter";
import { useToastAnimation } from "../../../../hooks/useToast";
import useModal from "../../../../hooks/useModal";
import { useLocation, useNavigate } from "react-router-dom";
import useDeleteBarangKeluar from "../../../../hooks/useDeleteBarangKeluar";
import { useState } from "react";
import useFilterRangeDate from "../../../../hooks/useFilterRangeDate";
import { PengajuanBarangKeluarServices } from "../../../../services/pengajuanBarangkeluar.service";
import useSizeWindows from "../../../../hooks/useSizeWindows";

const useBarangKeluar = (params: { fromPengajuanBarang?: boolean }) => {
  // params
  const { fromPengajuanBarang } = params;

  // window size
  const windowSize = useSizeWindows();

  // navigate
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  // query client
  const queryClient = useQueryClient();

  // filter search
  const { search, setSearch: handleSearch } = useFilterSearch("search");

  // state choose barang
  const [chooseBarangKeluar, setChooseBarangKeluar] = useState<
    { id: number; kodeReferensi: string }[]
  >([]);

  // handle set choose
  const handleSetChooseBarangKeluar = (data: {
    id: number;
    kodeReferensi: string;
  }) => {
    if (chooseBarangKeluar.some((item) => item.id === data.id)) {
      setChooseBarangKeluar(
        chooseBarangKeluar.filter((item) => item.id !== data.id),
      );
    } else {
      setChooseBarangKeluar((prev) => [...prev, data]);
    }
  };

  // use modal formulir barang keluar
  const {
    modalRef: modalFormulirBarangKeluarRef,
    handleCloseModal: handleCloseModalFormulirBarangKeluar,
    handleShowModal: handleShowModalFormulirBarangKeluar,
  } = useModal();

  // use modal delete
  const {
    modalRef: modalDeleteManyRef,
    handleCloseModal: handleCloseModalDeleteMany,
    handleShowModal: handleShowModalDeleteMany,
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
  const { startDate, endDate } = useFilterRangeDate();

  //   toast
  const { toast, handleSetToast } = useToastAnimation();

  // query
  const { data: dataBarangKeluar, isLoading: isLoadingBarangKeluar } = useQuery(
    {
      queryKey: [
        fromPengajuanBarang ? "barang-keluar-by-author" : "barang-keluar",
        search,
        sort,
        limit,
        page,
        startDate,
        endDate,
      ],
      queryFn: () => {
        if (fromPengajuanBarang) {
          return PengajuanBarangKeluarServices.allByAuthor({
            ...(search && { search }),
            ...(sort && { sort }),
            ...(limit && { limit }),
            ...(page && { page }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
          });
        } else {
          return BarangKeluarServices.all({
            ...(search && { search }),
            ...(sort && { sort }),
            ...(limit && { limit }),
            ...(page && { page }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
          });
        }
      },
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  //   is exist data
  const isExistDataBarangKeluar: boolean =
    !isLoadingBarangKeluar && dataBarangKeluar?.data?.data
      ? dataBarangKeluar?.data?.data?.length > 0
        ? true
        : false
      : false;

  // handle redirect detail
  const handleRedirectDetail = (id: number) => {
    if (fromPengajuanBarang) {
      navigate(`${currentPathname}/${id}`);
    } else {
      navigate(`${currentPathname}/barang-keluar/${id}`);
    }
  };

  // use mutation delete many
  const { mutateAsync: deleteMany, isPending: isPendingDeleteMany } =
    useMutation({
      mutationFn: (ids: number[]) => BarangKeluarServices.deleteMany(ids),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            fromPengajuanBarang ? "barang-keluar-by-author" : "barang-keluar",
          ],
        });

        // handle toast
        handleSetToast("deleted_barang_keluar");

        // close modal
        handleCloseModalDeleteMany();

        // reset choose
        setChooseBarangKeluar([]);
      },
      onError: (err) => {
        console.log(err);
      },
    });

  // handle delete many
  const handleDeleteMany = async () => {
    try {
      // check choose barang
      if (chooseBarangKeluar.length === 0) {
        return;
      }

      // check
      const isSame =
        dataBarangKeluar?.data?.data.length === chooseBarangKeluar.length &&
        dataBarangKeluar?.data?.data.every((item) =>
          chooseBarangKeluar.includes({
            id: item.id,
            kodeReferensi: item.kodeReferensi,
          }),
        );

      if (isSame) return;

      await deleteMany(chooseBarangKeluar.map((item) => item.id));
    } catch (error) {
      console.log(error);
    }
  };

  // use delete barang Keluar
  const {
    dataDelete,
    handleCloseModalDelete,
    handleDelete,
    handleShowModalDelete,
    isPendingDelete,
    modalDeleteRef,
  } = useDeleteBarangKeluar({
    handleInvalidate: () =>
      queryClient.refetchQueries({
        queryKey: [
          fromPengajuanBarang ? "barang-keluar-by-author" : "barang-keluar",
        ],
      }),
    handleToast: handleSetToast,
  });

  return {
    dataBarangKeluar,
    isLoadingBarangKeluar,
    handleSearch,
    handleSort,
    handleLimit,
    handlePage,
    toast,
    isExistDataBarangKeluar,
    modalFormulirBarangKeluarRef,
    handleCloseModalFormulirBarangKeluar,
    handleShowModalFormulirBarangKeluar,
    handleRedirectDetail,
    modalDeleteRef,
    handleCloseModalDelete,
    handleShowModalDelete,
    handleDelete,
    dataDelete,
    isPendingDelete,
    modalDeleteManyRef,
    handleCloseModalDeleteMany,
    handleShowModalDeleteMany,
    handleDeleteMany,
    dataDeleteMany,
    isPendingDeleteMany,
    chooseBarangKeluar,
    handleSetChooseBarangKeluar,
    sort,
    windowSize,
  };
};

export default useBarangKeluar;
