import { useParams } from "react-router-dom";
import { parseId } from "../../helpers/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import axios from "axios";
import { useFieldArray, useForm } from "react-hook-form";

import type { ResponseProdukForChooseType } from "../../models/produk.model";
import type { ErrorResponse } from "../../types/response.type";

import { StockOpnameDetailServices } from "../../services/stockOpnameDetail.service";

import type {
  CreateStockOpnameDetailArrayForServiceType,
  CreateStockOpnameDetailArrayType,
} from "../../models/stockOpnameDetail.model";
import useDataProdukForChooseInfinity from "../../hooks/useDataProdukforChooseInfinity";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import useFilterState from "../../services/useFilterState";

// ============================================================
// TYPES
// ============================================================

type FormValues = {
  details: CreateStockOpnameDetailArrayType["details"];
};

// ============================================================
// HOOK
// ============================================================

const useFormulirTambahStockOpname = (params: {
  handleCloseModal: () => void;
  handleSetToast: (data: string) => void;
  handleSetAlert: (data: string) => void;
  produkChooseIds?: number[];
}) => {
  const { handleCloseModal, handleSetToast, handleSetAlert, produkChooseIds } =
    params;

  // ============================================================
  // QUERY CLIENT
  // ============================================================

  const queryClient = useQueryClient();

  // ============================================================
  // PARAMS
  // ============================================================

  const { id } = useParams<{ id: string }>();

  const validatedId = parseId(id);

  const { handleKategori, setSearch, search, kategori } = useFilterState();

  // ============================================================
  // DATA PRODUK
  // ============================================================

  const {
    isLoadingProdukForChoose: isLoadingDataProduk,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    dataProduk,
  } = useDataProdukForChooseInfinity({
    search,
    kategori,
  });

  // ============================================================
  // FORM
  // ============================================================

  const {
    control,
    getValues,
    setValue,
    reset,
    setError,
    clearErrors,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      details: [],
    },
  });

  // ============================================================
  // FIELD ARRAY
  // ============================================================

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  // ============================================================
  // CHECK PRODUK
  // ============================================================

  const isChecked = (produkId: number) => {
    return fields.some((field) => field.produkId === produkId);
  };

  // ============================================================
  // GET INDEX
  // ============================================================

  const getFieldIndex = (produkId: number) => {
    return fields.findIndex((field) => field.produkId === produkId);
  };

  // ============================================================
  // APPEND
  // ============================================================

  const handleAppend = (produk: ResponseProdukForChooseType) => {
    if (isChecked(produk.id)) {
      return;
    }

    append({
      produkId: produk.id,
      stokFisik: produk.stok,
      selisih: 0,
    });
  };

  // ============================================================
  // REMOVE
  // ============================================================

  const handleRemove = (produkId: number) => {
    const index = getFieldIndex(produkId);

    if (index === -1) {
      return;
    }

    clearErrors(`details.${index}.produkId`);

    remove(index);
  };

  // ============================================================
  // TOGGLE PRODUK
  // ============================================================

  const handleToggleProduct = (produk?: ResponseProdukForChooseType) => {
    if (!produk) return;

    if (isChecked(produk.id)) {
      handleRemove(produk.id);
      return;
    }

    handleAppend(produk);
  };

  // ============================================================
  // GET DETAIL
  // ============================================================

  const getDetail = (produkId: number) => {
    const index = getFieldIndex(produkId);

    if (index === -1) {
      return undefined;
    }

    return getValues(`details.${index}`);
  };

  // ============================================================
  // GET SELISIH
  // ============================================================

  const getSelisih = (produk: ResponseProdukForChooseType) => {
    const detail = getDetail(produk.id);

    if (!detail) {
      return 0;
    }

    return detail.stokFisik - produk.stok;
  };

  // ============================================================
  // CHANGE STOK FISIK
  // ============================================================

  const handleChangeStokFisik = (
    produk: ResponseProdukForChooseType,
    value: string,
  ) => {
    const index = getFieldIndex(produk.id);

    if (index === -1) {
      return;
    }

    const stokFisik = value === "" ? 0 : Number(value);

    setValue(`details.${index}.stokFisik`, stokFisik, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  // ============================================================
  // TOGGLE PENYESUAIAN
  // ============================================================

  // ============================================================
  // SELECT ALL STATE
  // ============================================================

  const isAllChecked = useMemo(() => {
    const selectableProduk = dataProduk.filter(
      (produk) => !produkChooseIds?.includes(produk?.id ?? 0),
    );

    if (selectableProduk.length === 0) {
      return false;
    }

    const selectedProdukIds = new Set(fields.map((field) => field.produkId));

    return selectableProduk.every((produk) =>
      selectedProdukIds.has(produk?.id ?? 0),
    );
  }, [dataProduk, produkChooseIds, fields]);

  // ============================================================
  // SELECT ALL
  // ============================================================

  const handleToggleSelectAll = () => {
    if (!dataProduk || !dataProduk?.length) return;

    if (isAllChecked) {
      clearErrors("details");
      remove();
      return;
    }

    const selectedProdukIds = new Set(fields.map((field) => field.produkId));

    const productsToAppend = dataProduk
      .filter((produk) => produk?.id !== undefined)
      .filter((produk) => !produkChooseIds?.includes(produk?.id!))
      .filter((produk) => !selectedProdukIds.has(produk?.id!))
      .map((produk) => ({
        produkId: produk?.id ?? 0,
        stokFisik: produk?.stok ?? 0,
        selisih: 0,
      }));

    if (productsToAppend.length > 0) {
      clearErrors("details");
      append(productsToAppend);
    }
  };

  // ============================================================
  // SET DUPLICATE ERROR
  // ============================================================

  const setDuplicateProdukErrors = (produkIds: number[]) => {
    produkIds.forEach((produkId) => {
      const index = getFieldIndex(produkId);

      if (index === -1) {
        return;
      }

      setError(`details.${index}.produkId`, {
        type: "duplicate_produk",
        message: "Produk sudah ditambahkan pada stock opname",
      });
    });
  };

  // ============================================================
  // GET DUPLICATE PRODUK ID FROM RESPONSE
  // ============================================================

  const getDuplicateProdukIds = (error: unknown): number[] => {
    if (!axios.isAxiosError<ErrorResponse>(error)) {
      return [];
    }

    const customField = error.response?.data?.meta?.customField;

    if (!Array.isArray(customField)) {
      return [];
    }

    /*
     * Backend:
     *
     * customField: [
     *   "duplicate_produk",
     *   "1, 2, 3"
     * ]
     */

    const produkIdsValue = customField.find(
      (value) => typeof value === "string" && /^[\d,\s]+$/.test(value),
    );

    if (!produkIdsValue) {
      return [];
    }

    return produkIdsValue
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isInteger(value) && value > 0);
  };

  // ============================================================
  // MUTATION
  // ============================================================

  const {
    mutateAsync: mutateStockOpnameDetail,
    isPending: isPendingStockOpnameDetail,
  } = useMutation({
    mutationFn: async (payload: CreateStockOpnameDetailArrayForServiceType) => {
      return await StockOpnameDetailServices.create(payload);
    },

    // ==========================================================
    // SUCCESS
    // ==========================================================

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stock-opname-detail", validatedId],
      });

      reset({
        details: [],
      });

      handleCloseModal();

      handleSetToast("stock_opname_detail_add_success");
    },

    // ==========================================================
    // ERROR
    // ==========================================================

    onError: (err) => {
      console.log(err);

      if (!axios.isAxiosError<ErrorResponse>(err)) {
        return;
      }

      const meta = err.response?.data?.meta;

      // ========================================================
      // DUPLICATE PRODUK
      // ========================================================

      if (meta?.customField?.includes("duplicate_produk")) {
        const duplicateProdukIds = getDuplicateProdukIds(err);

        /*
         * Contoh:
         *
         * Backend:
         * customField: [
         *   "duplicate_produk",
         *   "1, 2, 3"
         * ]
         *
         * duplicateProdukIds:
         * [1, 2, 3]
         */

        setDuplicateProdukErrors(duplicateProdukIds);

        return;
      }

      // ========================================================
      // PRODUK TIDAK DITEMUKAN
      // ========================================================

      if (meta?.customField?.includes("produk_not_found")) {
        handleSetAlert("produk_not_found");

        return;
      }
    },
  });

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = handleFormSubmit(async (formData) => {
    const payload = formData.details;

    if (payload.length === 0) {
      return;
    }

    try {
      await mutateStockOpnameDetail({
        stockOpnameId: validatedId!,
        details: payload.map((item) => ({
          produkId: item.produkId,

          stokFisik: item.stokFisik,

          jenisPenyesuaian: item.jenisPenyesuaian,

          keteranganPenyesuaian: item.keteranganPenyesuaian,
        })),
      });
    } catch (error) {
      console.log(error);
    }
  });

  // ============================================================
  // RESET FORM
  // ============================================================

  const handleReset = () => {
    reset({
      details: [],
    });
  };

  // use infinity scroll
  const { containerRef, loadMoreRef } = useInfiniteScroll({
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    rootMargin: "10px",
  });

  // ============================================================
  // RETURN
  // ============================================================

  return {
    // ========================================================
    // PRODUK
    // ========================================================

    dataProduk,
    isLoadingDataProduk,

    // ========================================================
    // FORM
    // ========================================================

    control,
    fields,
    errors,
    getValues,
    setValue,
    setError,
    clearErrors,

    // ========================================================
    // FIELD ARRAY
    // ========================================================

    append,
    remove,

    // ========================================================
    // CHECK PRODUK
    // ========================================================

    isChecked,

    // ========================================================
    // PRODUK ACTION
    // ========================================================

    handleAppend,
    handleRemove,
    handleToggleProduct,

    // ========================================================
    // STOK FISIK
    // ========================================================

    handleChangeStokFisik,
    getSelisih,

    // ========================================================
    // PENYESUAIAN
    // ========================================================

    // ========================================================
    // SELECT ALL
    // ========================================================

    isAllChecked,
    handleToggleSelectAll,

    // ========================================================
    // SUBMIT
    // ========================================================

    handleSubmit,
    handleReset,

    // ========================================================
    // MUTATION
    // ========================================================

    isPendingStockOpnameDetail,

    containerRef,

    loadMoreRef,

    setSearch,

    handleKategori,

    kategori,

    isFetchingNextPage,
  };
};

export default useFormulirTambahStockOpname;
