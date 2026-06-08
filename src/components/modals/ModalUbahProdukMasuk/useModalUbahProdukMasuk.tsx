import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarangMasukDetailValidation } from "../../../validations/barangMasukDetail.validation";
import type { UpdateBarangMasukDetailType } from "../../../models/barangMasukDetail.model";
import type { ResponseProdukForChooseType } from "../../../models/produk.model";
import { useEffect, useRef, useState } from "react";
import { useAlertAnimation } from "../../../hooks/useAlert";
import { BarangMasukDetailServices } from "../../../services/barangMasukDetail.service";
import { useClickOutside } from "../../../hooks/useClickOutSide";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";
import type { InputSearchRef } from "../../../types/ref.type";
import { useController, useForm } from "react-hook-form";
import type { StatusInventoriType } from "../../../types/constant.type";
import useDataProdukForChoose from "../../../hooks/useDataProdukForChoose";

const useModalUbahProdukMasuk = (params: {
  idBarangMasuk?: number;
  status?: StatusInventoriType;
  dataUpdate: {
    produkId?: number;
    jumlahBox?: number;
  };
  handleCloseModal: () => void;
}) => {
  // params
  const {
    idBarangMasuk,
    status,
    handleCloseModal,
    dataUpdate: { jumlahBox, produkId },
  } = params;

  // navigate
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  const queryClient = useQueryClient();

  const [activeComponentChooseProduk, setActiveComponentChooseProduk] =
    useState(false);

  const [produkChoose, setProdukChoose] =
    useState<ResponseProdukForChooseType | null>(null);

  const [search, setSearch] = useState("");

  const inputSearchRef = useRef<InputSearchRef>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { alert, handleSetAlert } = useAlertAnimation();

  const { id } = useParams<{ id: string }>();
  const validatedId = parseId(id);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const {
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    setError,
    control,
  } = useForm<UpdateBarangMasukDetailType>({
    resolver: zodResolver(BarangMasukDetailValidation.UPDATE),
  });

  // reset
  useEffect(() => {
    reset({
      produkId,
      jumlahBox,
    });
  }, [reset, jumlahBox]);

  // jumlah box controller
  const jumlahBoxController = useController({
    control,
    name: "jumlahBox",
  });

  const { dataProdukForChoose, isLoadingProdukForChoose } =
    useDataProdukForChoose({ search });

  useClickOutside({
    ref: wrapperRef,
    callback: () => {
      setActiveComponentChooseProduk(false);
    },
  });

  const handleShowActiveComponentChooseProduk = () => {
    setActiveComponentChooseProduk(true);
  };

  const handleCloseActiveComponentChooseProduk = () => {
    setActiveComponentChooseProduk(false);
  };

  const {
    mutateAsync: mutateBarangMasukDetail,
    isPending: isPendingBarangMasukDetail,
  } = useMutation({
    mutationFn: (req: UpdateBarangMasukDetailType) =>
      BarangMasukDetailServices.update({
        id: idBarangMasuk!,
        req: {
          produkId: req.produkId,
          jumlahBox: req.jumlahBox,
        },
        status: status!,
      }),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["barang-masuk-detail", validatedId],
      });

      if (data?.data) {
        reset({
          produkId: data.data.produk.id,
          jumlahBox: data.data.jumlahBox,
        });
      }

      setSearch("");

      inputSearchRef.current?.handleReset();

      setProdukChoose(null);

      // set toast
      navigate(currentPathname, {
        state: {
          toast: "updated_barang_masuk_detail",
        },
      });

      // close modal
      handleCloseModal();
    },

    onError: (err) => {
      console.log(err);

      if (axios.isAxiosError<ErrorResponse>(err)) {
        if (err.response?.data?.meta?.customField?.includes("same_produk")) {
          handleSetAlert("produk_choose_exist_in_data");
        }
        if (err.response?.data?.meta?.statusCode === 409) {
          if (
            err.response?.data?.meta?.customField?.includes(
              "detail_barang_masuk_barangMasukId_produkId_key",
            )
          ) {
            handleSetAlert("produk_choose_exist_in_data");
          }
        }
      }
    },
  });

  const onSubmit = async (data: UpdateBarangMasukDetailType) => {
    try {
      if (!idBarangMasuk || !status) return;

      const isProdukChanged =
        produkChoose === null ? false : data.produkId !== produkId;
      const isJumlahChanged = data.jumlahBox !== jumlahBox;
      if (!isProdukChanged && produkChoose) {
        handleSetAlert("produk_choose_exist_in_data");
        return;
      }

      if (!isProdukChanged && !isJumlahChanged) {
        setError("produkId", {
          message: "Minimal ubah produk atau jumlah box",
        });

        setError("jumlahBox", {
          message: "Minimal ubah produk atau jumlah box",
        });

        return;
      }

      const payload: UpdateBarangMasukDetailType = {
        produkId: isProdukChanged ? data.produkId : undefined,
        jumlahBox: isJumlahChanged ? data.jumlahBox : undefined,
      };

      await mutateBarangMasukDetail(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetValueProdukId = (id: number) => {
    if (produkChoose?.id === id) {
      handleSetAlert("produk_choose_exist");
      return;
    }

    // check same produk id
    if (produkChoose?.id === id) {
      handleSetAlert("produk_choose_exist_in_data");
      return;
    }

    const findData = dataProdukForChoose?.data?.find((item) => item.id === id);

    if (!findData) return;

    setProdukChoose(findData);

    setValue("produkId", findData.id, {
      shouldValidate: true,
    });

    handleCloseActiveComponentChooseProduk();
  };

  const handleDeleteValueProdukId = () => {
    setProdukChoose(null);

    setValue("produkId", undefined);

    handleCloseActiveComponentChooseProduk();
  };

  return {
    handleSubmit,
    onSubmit,

    wrapperRef,

    handleSearch,
    inputSearchRef,

    handleCloseActiveComponentChooseProduk,
    handleShowActiveComponentChooseProduk,

    errors,

    activeComponentChooseProduk,

    isLoadingProdukForChoose,
    dataProdukForChoose,

    handleSetValueProdukId,
    handleDeleteValueProdukId,

    produkChoose,

    isPendingBarangMasukDetail,

    alert,

    jumlahBoxController,
  };
};

export default useModalUbahProdukMasuk;
