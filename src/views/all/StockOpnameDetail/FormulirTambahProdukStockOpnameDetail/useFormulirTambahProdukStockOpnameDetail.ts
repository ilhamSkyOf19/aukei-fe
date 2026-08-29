import { useParams } from "react-router-dom";
import { parseId } from "../../../../helpers/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ResponseProdukForChooseType } from "../../../../models/produk.model";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import type { ErrorResponse } from "../../../../types/response.type";
import type { InputSearchRef } from "../../../../types/ref.type";
import useModal from "../../../../hooks/useModal";
import useDataProdukForChoose from "../../../../hooks/useDataProdukForChoose";
import { useClickOutside } from "../../../../hooks/useClickOutside";

import type { CreateStockOpnameDetailType } from "../../../../models/stockOpnameDetail.model";
import { StockOpnameDetailValidation } from "../../../../validations/stockOpnameDetail.validation";
import { StockOpnameDetailServices } from "../../../../services/stockOpnameDetail.service";

const useFormulirTambahProdukStockOpnameDetail = (params: {
  handleSetToast: (data: string) => void;
  handleSetAlert: (data: string) => void;
}) => {
  const { handleSetToast, handleSetAlert } = params;

  // ============================================================
  // STATE ACTIVE PRODUK CHOOSE
  // ============================================================

  const [activeComponentChooseProduk, setActiveComponentChooseProduk] =
    useState(false);

  // ============================================================
  // STATE PRODUK CHOOSE
  // ============================================================

  const [produkChoose, setProdukChoose] =
    useState<ResponseProdukForChooseType | null>(null);

  // ============================================================
  // REF
  // ============================================================

  const inputSearchRef = useRef<InputSearchRef>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // STATE SEARCH
  // ============================================================

  const [search, setSearch] = useState("");

  const handleSearch = (value: string) => setSearch(value);

  // ============================================================
  // QUERY CLIENT
  // ============================================================

  const queryClient = useQueryClient();

  // ============================================================
  // MODAL
  // ============================================================

  const {
    modalRef: modalFormulirTambahBarangRef,
    handleCloseModal: handleCloseModalFormulirTambahBarang,
    handleShowModal: handleShowModalFormulirTambahBarang,
  } = useModal();

  // ============================================================
  // PARAMS
  // ============================================================

  const { id } = useParams<{ id: string }>();

  const validatedId = parseId(id);

  // ============================================================
  // PRODUK CHOOSE QUERY
  // ============================================================

  const { dataProdukForChoose, isLoadingProdukForChoose } =
    useDataProdukForChoose({
      search,
    });

  // ============================================================
  // CLICK OUTSIDE
  // ============================================================

  useClickOutside({
    refs: [wrapperRef],
    callback: () => {
      setActiveComponentChooseProduk(false);
    },
  });

  // ============================================================
  // FORM
  // ============================================================

  const {
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    control,
  } = useForm<CreateStockOpnameDetailType>({
    resolver: zodResolver(StockOpnameDetailValidation.CREATE),
  });

  // ============================================================
  // CONTROLLER
  // ============================================================

  const stokFisikController = useController({
    control,
    name: "stokFisik",
  });

  // ============================================================
  // SET STOCK OPNAME ID
  // ============================================================

  useEffect(() => {
    if (!validatedId) return;

    setValue("stockOpnameId", validatedId);
  }, [validatedId, setValue]);

  // ============================================================
  // MUTATION TAMBAH STOCK OPNAME DETAIL
  // ============================================================

  const {
    mutateAsync: mutateStockOpnameDetail,
    isPending: isPendingStockOpnameDetail,
  } = useMutation({
    mutationFn: (req: CreateStockOpnameDetailType) =>
      StockOpnameDetailServices.create(req),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stock-opname-detail", validatedId],
      });

      reset({
        stockOpnameId: validatedId!,
        produkId: undefined,
        stokFisik: undefined,
      });

      handleSearch("");

      inputSearchRef.current?.handleReset();

      setProdukChoose(null);

      handleSetToast("stock_opname_detail_add_success");
    },

    onError: (err) => {
      if (axios.isAxiosError<ErrorResponse>(err)) {
        if (err.response?.data?.meta?.statusCode === 409) {
          handleSetAlert("produk_choose_exist_in_data");
        }
      }
    },
  });

  // ============================================================
  // SUBMIT
  // ============================================================

  const onSubmit = async (data: CreateStockOpnameDetailType) => {
    try {
      await mutateStockOpnameDetail(data);
    } catch (error) {
      console.log(error);
    }
  };

  // ============================================================
  // HANDLE ACTIVE COMPONENT PRODUK
  // ============================================================

  const handleShowActiveComponentChooseProduk = () => {
    setActiveComponentChooseProduk(true);
  };

  const handleCloseActiveComponentChooseProduk = () => {
    setActiveComponentChooseProduk(false);
  };

  // ============================================================
  // SET PRODUK
  // ============================================================

  const handleSetValueProdukId = (id: number) => {
    const findData = dataProdukForChoose?.data?.find((item) => item.id === id);

    if (!findData) return;

    setProdukChoose(findData);

    setValue("produkId", findData.id, {
      shouldValidate: true,
    });

    handleCloseActiveComponentChooseProduk();
  };

  // ============================================================
  // DELETE PRODUK
  // ============================================================

  const handleDeleteValueProdukId = () => {
    setProdukChoose(null);

    // setValue("produkId", undefined, {
    //   shouldValidate: true,
    // });
  };

  return {
    // data
    dataProdukForChoose,
    produkChoose,

    // form
    errors,
    handleSubmit,
    onSubmit,

    // controller
    stokFisikController,

    // mutation
    isPendingStockOpnameDetail,

    // search
    handleSearch,

    // produk
    handleSetValueProdukId,
    handleDeleteValueProdukId,

    // component choose
    wrapperRef,
    activeComponentChooseProduk,
    handleShowActiveComponentChooseProduk,
    handleCloseActiveComponentChooseProduk,

    // loading
    isLoadingProdukForChoose,

    // ref
    inputSearchRef,

    // modal
    modalFormulirTambahBarangRef,
    handleShowModalFormulirTambahBarang,
    handleCloseModalFormulirTambahBarang,
  };
};

export default useFormulirTambahProdukStockOpnameDetail;
