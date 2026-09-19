import { useState } from "react";

import type { UpdateStockOpnameDetailType } from "../../../../models/stockOpnameDetail.model";

import type {
  JenisPenyesuaianStockOpnameType,
  StatusStockOpnameType,
} from "../../../../types/constant.type";
import useDeleteStockOpnameDetail from "../../../../hooks/useDeleteStockOpnameDetail";
import useUpdateProdukStockOpname from "../../../../hooks/useUpdateProdukStockOpname";
import useModal from "../../../../hooks/useModal";

const useShowStockOpname = (params: {
  status?: StatusStockOpnameType;
  handleSetToast: (value: string) => void;
  stockOpnameId?: number;
}) => {
  const { status, handleSetToast, stockOpnameId } = params;

  // field update active
  const [activeField, setActiveField] = useState<
    "stokFisik" | "jenisPenyesuaian" | null
  >(null);

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
  };
};

export default useShowStockOpname;
