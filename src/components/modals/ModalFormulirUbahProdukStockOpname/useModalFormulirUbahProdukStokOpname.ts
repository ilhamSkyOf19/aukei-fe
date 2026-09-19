import { useEffect, useRef, useState } from "react";
import type { InputSearchRef } from "../../../types/ref.type";
import type { ResponseProdukForChooseType } from "../../../models/produk.model";

import type { StatusStockOpnameType } from "../../../types/constant.type";
import type { UpdateStockOpnameDetailType } from "../../../models/stockOpnameDetail.model";

import useUpdateProdukStockOpname from "../../../hooks/useUpdateProdukStockOpname";
import useDataProdukForChoose from "../../../hooks/useDataProdukForChoose";
import { useClickOutside } from "../../../hooks/useClickOutside";

const useModalFormulirUbahProdukStokOpname = (params: {
  handleCloseModal: () => void;

  status?: StatusStockOpnameType;

  dataUpdate: {
    detailId?: number;
    stokFisik?: number;
    jenisPenyesuaian?: UpdateStockOpnameDetailType["jenisPenyesuaian"];
    produkId?: number;
  };
}) => {
  const { dataUpdate, handleCloseModal, status } = params;

  // =========================================================
  // REF
  // =========================================================

  const inputSearchRef = useRef<InputSearchRef>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // =========================================================
  // STATE SEARCH PRODUK
  // =========================================================

  const [search, setSearch] = useState<string>("");

  // =========================================================
  // STATE SELISIH
  // =========================================================

  const [selisih, setSelisih] = useState<number>(0);

  // =========================================================
  // STATE PRODUK CHOOSE
  // =========================================================

  const [activeComponentChooseProduk, setActiveComponentChooseProduk] =
    useState(false);

  const [produkChoose, setProdukChoose] = useState<
    ResponseProdukForChooseType[]
  >([]);

  // =========================================================
  // DATA PRODUK
  // =========================================================

  const { dataProdukForChoose, isLoadingProdukForChoose } =
    useDataProdukForChoose({
      search,
    });

  // =========================================================
  // FORM & MUTATION
  // =========================================================

  const {
    handleSubmit,
    reset,
    setValue,
    isDirty,

    stokFisikController,
    jenisPenyesuaianController,

    mutateUpdate,
    isPendingUpdate,
    errors,
  } = useUpdateProdukStockOpname({
    status,
    dataUpdate,
  });

  // =========================================================
  // CLICK OUTSIDE
  // =========================================================

  useClickOutside({
    refs: [wrapperRef],
    callback: () => {
      setActiveComponentChooseProduk(false);
    },
  });

  // =========================================================
  // SEARCH PRODUK
  // =========================================================

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  // =========================================================
  // SHOW DROPDOWN PRODUK
  // =========================================================

  const handleShowActiveComponentChooseProduk = () => {
    setActiveComponentChooseProduk(true);
  };

  // =========================================================
  // HIDE DROPDOWN PRODUK
  // =========================================================

  const handleCloseActiveComponentChooseProduk = () => {
    setActiveComponentChooseProduk(false);
  };

  // =========================================================
  // HITUNG SELISIH
  // =========================================================

  const calculateSelisih = (stokSistem: number, stokFisik: number) => {
    return stokFisik - stokSistem;
  };

  // =========================================================
  // PILIH PRODUK
  // =========================================================

  const handleSetValueProdukId = (id: number) => {
    const findData = dataProdukForChoose?.data?.find((item) => item.id === id);

    if (!findData) return;

    // Produk yang dipilih
    setProdukChoose([findData]);

    // Set produk ID ke form
    setValue("produkId", findData.id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // =======================================================
    // HITUNG SELISIH
    // =======================================================

    const stokSistem = Number(findData.stok ?? 0);

    const stokFisik = Number(stokFisikController.field.value ?? 0);

    const newSelisih = calculateSelisih(stokSistem, stokFisik);

    setSelisih(newSelisih);

    // =======================================================
    // TUTUP DROPDOWN
    // =======================================================

    handleCloseActiveComponentChooseProduk();

    // Reset search
    setSearch("");

    inputSearchRef.current?.handleReset();
  };

  // =========================================================
  // HAPUS / CLEAR PRODUK
  // =========================================================

  const handleDeleteValueProdukId = (id: number) => {
    setProdukChoose((prev) => prev.filter((item) => item.id !== id));

    setValue("produkId", undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Karena tidak ada produk yang dipilih,
    // selisih kembali 0.
    setSelisih(0);

    setSearch("");

    inputSearchRef.current?.handleReset();

    handleCloseActiveComponentChooseProduk();
  };

  // =========================================================
  // UPDATE SELISIH KETIKA STOK FISIK BERUBAH
  // =========================================================

  useEffect(() => {
    const produk = produkChoose[0];

    if (!produk) {
      setSelisih(0);
      return;
    }

    const stokSistem = Number(produk.stok ?? 0);

    const stokFisik = Number(stokFisikController.field.value ?? 0);

    const newSelisih = calculateSelisih(stokSistem, stokFisik);

    setSelisih(newSelisih);
  }, [produkChoose, stokFisikController.field.value]);

  // =========================================================
  // SET PRODUK AWAL
  // =========================================================

  useEffect(() => {
    if (!dataUpdate.produkId) {
      setProdukChoose([]);
      return;
    }

    const findData = dataProdukForChoose?.data?.find(
      (item) => item.id === dataUpdate.produkId,
    );

    if (findData) {
      setProdukChoose([findData]);

      // Hitung selisih awal
      const stokSistem = Number(findData.stok ?? 0);

      const stokFisik = Number(stokFisikController.field.value ?? 0);

      setSelisih(calculateSelisih(stokSistem, stokFisik));
    }
  }, [
    dataUpdate.produkId,
    dataProdukForChoose?.data,
    stokFisikController.field.value,
  ]);

  // =========================================================
  // SUBMIT
  // =========================================================

  const onSubmit = async (data: UpdateStockOpnameDetailType) => {
    if (!dataUpdate.detailId) return;

    // Produk tidak berubah
    if (data.produkId === dataUpdate.produkId) {
      delete data.produkId;
    }

    // Jenis penyesuaian tidak berubah
    if (data.jenisPenyesuaian === dataUpdate.jenisPenyesuaian && selisih >= 0) {
      delete data.jenisPenyesuaian;
    }

    // Stok fisik tidak berubah
    if (data.stokFisik === dataUpdate.stokFisik) {
      delete data.stokFisik;
    }

    await mutateUpdate({
      id: dataUpdate.detailId,
      req: data,
    });

    handleCloseModal();
  };

  // =========================================================
  // RETURN
  // =========================================================

  return {
    // Existing
    inputSearchRef,
    wrapperRef,

    handleSubmit,
    reset,
    isDirty,

    stokFisikController,
    jenisPenyesuaianController,

    onSubmit,
    isPendingUpdate,

    errors,

    // Search
    handleSearch,

    // Dropdown
    activeComponentChooseProduk,
    handleShowActiveComponentChooseProduk,
    handleCloseActiveComponentChooseProduk,

    // Data produk
    dataProdukForChoose,
    isLoadingProdukForChoose,

    // Produk choose
    produkChoose,
    handleSetValueProdukId,
    handleDeleteValueProdukId,

    // Selisih
    selisih,
  };
};

export default useModalFormulirUbahProdukStokOpname;
