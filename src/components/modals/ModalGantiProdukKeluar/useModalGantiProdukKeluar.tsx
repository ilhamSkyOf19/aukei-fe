import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarangKeluarDetailValidation } from "../../../validations/barangKeluarDetail.validation";
import type { UpdateBarangKeluarDetailType } from "../../../models/barangKeluarDetail.model";
import type { ResponseProdukForChooseType } from "../../../models/produk.model";
import { useRef, useState } from "react";
import { useAlertAnimation } from "../../../hooks/useAlert";
import { BarangKeluarDetailServices } from "../../../services/barangKeluarDetail.service";
import { useClickOutside } from "../../../hooks/useClickOutSide";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";
import type { InputSearchRef } from "../../../types/ref.type";
import { useForm } from "react-hook-form";
import type { StatusInventoriType } from "../../../types/constant.type";
import useDataProdukForChoose from "../../../hooks/useDataProdukForChoose";

const useModalGantiProdukKeluar = (params: {
  idBarangKeluar?: number;
  status?: StatusInventoriType;
  handleCloseModal: () => void;
}) => {
  // params
  const { idBarangKeluar, status, handleCloseModal } = params;

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
  } = useForm<UpdateBarangKeluarDetailType>({
    resolver: zodResolver(BarangKeluarDetailValidation.UPDATE),
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
    mutateAsync: mutateBarangKeluarDetail,
    isPending: isPendingBarangKeluarDetail,
  } = useMutation({
    mutationFn: (req: UpdateBarangKeluarDetailType) =>
      BarangKeluarDetailServices.update({
        id: idBarangKeluar!,
        req: {
          produkId: req.produkId,
        },
        status: status!,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["barang-Keluar-detail", validatedId],
      });

      reset({
        produkId: undefined,
        jumlahStok: undefined,
        hargaModalSatuan: undefined,
      });

      setSearch("");

      inputSearchRef.current?.handleReset();

      setProdukChoose(null);

      // set toast
      navigate(currentPathname, {
        state: {
          toast: "updated_barang_keluar_detail",
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
      }
    },
  });

  const onSubmit = async (data: UpdateBarangKeluarDetailType) => {
    try {
      if (!idBarangKeluar || !status) return;

      await mutateBarangKeluarDetail(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetValueProdukId = (id: number) => {
    if (produkChoose?.id === id) {
      handleSetAlert("produk_choose_exist");
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

    isPendingBarangKeluarDetail,

    alert,
  };
};

export default useModalGantiProdukKeluar;
