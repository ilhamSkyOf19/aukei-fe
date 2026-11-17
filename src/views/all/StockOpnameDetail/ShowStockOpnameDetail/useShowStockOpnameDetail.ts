import { useImperativeHandle, useState, type ForwardedRef } from "react";

import type { UpdateStockOpnameDetailType } from "../../../../models/stockOpnameDetail.model";

import type {
  JenisPenyesuaianStockOpnameType,
  StatusStockOpnameType,
} from "../../../../types/constant.type";
import useDeleteStockOpnameDetail from "../../../../hooks/useDeleteStockOpnameDetail";
import useUpdateProdukStockOpname from "../../../../hooks/useUpdateProdukStockOpname";
import useModal from "../../../../hooks/useModal";
import { useQuery } from "@tanstack/react-query";
import { StockOpnameServices } from "../../../../services/stockOpname.service";
import type { ChildRef } from "../../../../types/ref.type";
import { useFilter } from "../../../../hooks/useFilter";

const useShowStockOpname = (params: {
  status?: StatusStockOpnameType | null;
  handleSetToast: (value: string) => void;
  stockOpnameId?: number | null;
  ref: ForwardedRef<ChildRef>;
}) => {
  const { status, handleSetToast, stockOpnameId, ref } = params;

  // field update active
  const [activeField, setActiveField] = useState<
    "stokFisik" | "jenisPenyesuaian" | null
  >(null);

  const { filter: sort, setFilter: handleSort } = useFilter({
    paramName: "sort",
    allowQuery: ["asc", "desc"],
    defaultValueCustom: "asc",
  });

  const { filter: page, setFilter: handlePage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // Filter jumlah data per halaman (query param "limit")
  const { filter: limit, setFilter: handleLimit } = useFilter({
    paramName: "limit",
    isNumber: true,
  });

  const {
    data: dataDaftarProduk,
    isLoading: isLoadingDaftarProduk,
    isFetching: isFetchingDaftarProduk,
    refetch: refetchDaftarProduk,
  } = useQuery({
    queryKey: [
      "daftar-produk-stock-opname",
      stockOpnameId,
      { sort, page, limit },
    ],

    queryFn: () =>
      StockOpnameServices.getDaftarProduk({
        id: stockOpnameId!,
        query: {
          ...(sort && { sort }),
          ...(page && { page }),
          ...(limit && { limit }),
        },
      }),

    enabled: !!stockOpnameId,

    retry: false,

    refetchOnWindowFocus: false,
  });

  // ============================================================
  // HIGHLIGHT
  // ============================================================

  // modal update
  const {
    modalRef: modalUpdateRef,
    handleShowModal: handleShowModalUpdate,
    handleCloseModal: handleCloseModalUpdate,
    dataModal: dataUpdateModal,
  } = useModal<{
    id: number;
    produkId: number;
    stokFisik: number;
    jenisPenyesuaian?: JenisPenyesuaianStockOpnameType;
  }>();

  // ============================================================
  // MODAL DELETE
  // ============================================================
  const {
    dataDelete,
    handleCloseModalDelete,
    handleDelete,
    handleShowModalDelete,
    isPendingDelete,
    modalDeleteRef,
  } = useDeleteStockOpnameDetail({
    handleSetToast,
    status,
    stockOpnameId,
  });

  // ============================================================
  // UPDATE STATE
  // ============================================================

  const [dataUpdate, setDataUpdate] = useState<
    | (UpdateStockOpnameDetailType & {
        id: number;
      })
    | null
  >(null);

  // ============================================================
  // UPDATE
  // ============================================================

  const {
    handleSubmit,
    isDirty,
    isPendingUpdate,
    reset,
    jenisPenyesuaianController,
    stokFisikController,
    mutateUpdate,
  } = useUpdateProdukStockOpname({
    status,
    setDataUpdate: () => setDataUpdate(null),
  });

  // ============================================================
  // SET DATA UPDATE
  // ============================================================

  const handleSetDataUpdate = (params: {
    active: "stokFisik" | "jenisPenyesuaian";
    data:
      | (UpdateStockOpnameDetailType & {
          id: number;
        })
      | null;
  }) => {
    const { data } = params;

    if (!data) return;
    if (activeField === "stokFisik") {
      setDataUpdate({
        id: data.id,
        produkId: data.produkId,
        stokFisik: data.stokFisik,
      });
      reset({
        stokFisik: data.stokFisik,
        produkId: data.produkId,
      });
    } else {
      setDataUpdate({
        id: data.id,
        jenisPenyesuaian: data.jenisPenyesuaian,
      });
      reset({
        jenisPenyesuaian: data.jenisPenyesuaian,
      });
    }

    setActiveField(params.active);
  };

  // ============================================================
  // CLEAR UPDATE
  // ============================================================

  const handleClearDataUpdate = () => {
    reset();

    setDataUpdate(null);
  };

  // ============================================================
  // HANDLE UPDATE
  // ============================================================

  const onSubmit = async (data: UpdateStockOpnameDetailType) => {
    try {
      if (!dataUpdate || !status) return;

      await mutateUpdate({
        id: dataUpdate.id,
        req: {
          produkId: dataUpdate.produkId,
          stokFisik: data.stokFisik,
          jenisPenyesuaian: data.jenisPenyesuaian,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRefresh = async () => {
    await refetchDaftarProduk({
      throwOnError: true,
    });
  };

  useImperativeHandle(ref, () => ({
    refetchActive: handleRefresh,
  }));

  return {
    // delete
    modalDeleteRef,
    handleCloseModalDelete,
    handleShowModalDelete,
    handleDelete,
    isPendingDelete,
    dataDelete,

    // update
    dataUpdate,
    handleSetDataUpdate,
    handleClearDataUpdate,
    handleSubmit,
    onSubmit,
    isPendingUpdate,
    isDirty,
    jenisPenyesuaianController,

    stokFisikController,

    activeField,

    modalUpdateRef,
    handleShowModalUpdate,
    handleCloseModalUpdate,
    dataUpdateModal,

    // daftar produk
    dataDaftarProduk,
    isLoadingDaftarProduk: isLoadingDaftarProduk || isFetchingDaftarProduk,

    handlePage,
    handleLimit,
    handleSort,
    sort,
  };
};

export default useShowStockOpname;
