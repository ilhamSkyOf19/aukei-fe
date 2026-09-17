import { useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import axios from "axios";
import { useFieldArray, useForm } from "react-hook-form";

import type { ResponseProdukForChooseType } from "../../../models/produk.model";
import type { ErrorResponse } from "../../../types/response.type";

import useDataProdukForChoose from "../../../hooks/useDataProdukForChoose";

import { StockOpnameDetailServices } from "../../../services/stockOpnameDetail.service";
import type { CreateStockOpnameDetailType } from "../../../models/stockOpnameDetail.model";

// ============================================================
// TYPES
// ============================================================

type FormValues = {
  details: CreateStockOpnameDetailType[];
};

// ============================================================
// HOOK
// ============================================================

const useModalFormulirTambahProdukStockOpname = (params: {
  handleCloseModal: () => void;
  handleSetToast: (data: string) => void;
  handleSetAlert: (data: string) => void;
}) => {
  const { handleCloseModal, handleSetToast, handleSetAlert } = params;

  // ============================================================
  // QUERY CLIENT
  // ============================================================

  const queryClient = useQueryClient();

  // ============================================================
  // PARAMS
  // ============================================================

  const { id } = useParams<{ id: string }>();

  const validatedId = parseId(id);

  // ============================================================
  // DATA PRODUK
  // ============================================================

  const { dataProdukForChoose, isLoadingProdukForChoose: isLoadingDataProduk } =
    useDataProdukForChoose({
      search: "",
    });

  const dataProduk = useMemo(
    () => dataProdukForChoose?.data ?? [],
    [dataProdukForChoose?.data],
  );

  // ============================================================
  // FORM
  // ============================================================

  const {
    control,
    getValues,
    setValue,
    reset,
    handleSubmit: handleFormSubmit,
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
    // Jangan tambahkan jika sudah dipilih
    if (isChecked(produk.id)) {
      return;
    }

    append({
      stockOpnameId: validatedId!,
      produkId: produk.id,

      // Default stok fisik = stok sistem
      stokFisik: produk.stok,

      // Stok fisik sama dengan stok sistem
      // sehingga selisih = 0
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

    remove(index);
  };

  // ============================================================
  // TOGGLE PRODUK
  // ============================================================

  const handleToggleProduct = (produk: ResponseProdukForChooseType) => {
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

    return detail.selisih;
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

    const stokFisik = value === "" ? produk.stok : Number(value);

    const selisih = stokFisik - produk.stok;

    // Update stok fisik
    setValue(`details.${index}.stokFisik`, stokFisik, {
      shouldDirty: true,
      shouldValidate: true,
    });

    // Update selisih
    setValue(`details.${index}.selisih`, selisih, {
      shouldDirty: true,
      shouldValidate: true,
    });

    // ========================================================
    // LOGIKA PENYESUAIAN
    // ========================================================
    //
    // Selisih negatif:
    // stok fisik < stok sistem
    // => default penyesuaian = true
    //
    // Selisih 0 / positif:
    // => penyesuaian = false
    //
    // ========================================================

    // if (selisih < 0) {
    //   setValue(`details.${index}.penyesuaian`, true, {
    //     shouldDirty: true,
    //     shouldValidate: true,
    //   });
    // } else {
    //   setValue(`details.${index}.penyesuaian`, false, {
    //     shouldDirty: true,
    //     shouldValidate: true,
    //   });
    // }
  };

  // ============================================================
  // TOGGLE PENYESUAIAN
  // ============================================================

  const handleTogglePenyesuaian = (produkId: number) => {
    const index = getFieldIndex(produkId);

    if (index === -1) {
      return;
    }

    const detail = getValues(`details.${index}`);

    // Penyesuaian hanya boleh dilakukan
    // jika stok fisik lebih kecil dari stok sistem
    if (detail.selisih >= 0) {
      return;
    }

    // setValue(`details.${index}.penyesuaian`, !detail.penyesuaian, {
    //   shouldDirty: true,
    //   shouldValidate: true,
    // });
  };

  // ============================================================
  // SELECT ALL STATE
  // ============================================================

  const isAllChecked = useMemo(() => {
    if (dataProduk.length === 0) {
      return false;
    }

    return fields.length === dataProduk.length;
  }, [dataProduk.length, fields.length]);

  // ============================================================
  // SELECT ALL
  // ============================================================

  const handleToggleSelectAll = () => {
    // Jika semua sudah dipilih
    // maka hapus semua
    if (isAllChecked) {
      remove();
      return;
    }

    // Produk yang sudah dipilih
    const selectedProdukIds = new Set(fields.map((field) => field.produkId));

    // Hanya append produk yang belum dipilih
    const productsToAppend = dataProduk
      .filter((produk) => !selectedProdukIds.has(produk.id))
      .map((produk) => ({
        stockOpnameId: validatedId!,
        produkId: produk.id,
        stokFisik: produk.stok,
        selisih: 0,
        penyesuaian: true,
      }));

    if (productsToAppend.length > 0) {
      append(productsToAppend);
    }
  };

  // ============================================================
  // MUTATION
  // ============================================================

  const {
    mutateAsync: mutateStockOpnameDetail,
    isPending: isPendingStockOpnameDetail,
  } = useMutation({
    mutationFn: async (payload: CreateStockOpnameDetailType[]) => {
      return Promise.all(
        payload.map((detail) => StockOpnameDetailServices.create(detail)),
      );
    },

    onSuccess: () => {
      // Refresh data detail stock opname
      queryClient.invalidateQueries({
        queryKey: ["stock-opname-detail", validatedId],
      });

      // Reset form
      reset({
        details: [],
      });

      // Tutup modal
      handleCloseModal();

      // Toast success
      handleSetToast("stock_opname_detail_add_success");
    },

    onError: (err) => {
      console.log(err);

      if (axios.isAxiosError<ErrorResponse>(err)) {
        // Conflict
        if (err.response?.data?.meta?.statusCode === 409) {
          handleSetAlert("produk_choose_exist_in_data");

          return;
        }

        // Duplicate produk
        if (
          err.response?.data?.meta?.customField?.includes("duplicate_produk")
        ) {
          handleSetAlert("produk_choose_exist_in_data");

          return;
        }
      }
    },
  });

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = handleFormSubmit(async (formData) => {
    const payload = formData.details;

    // Tidak ada produk
    if (payload.length === 0) {
      return;
    }

    try {
      console.log("PAYLOAD STOCK OPNAME DETAIL:", payload);

      await mutateStockOpnameDetail(payload);
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
    getValues,
    setValue,

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

    handleTogglePenyesuaian,

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
  };
};

export default useModalFormulirTambahProdukStockOpname;
