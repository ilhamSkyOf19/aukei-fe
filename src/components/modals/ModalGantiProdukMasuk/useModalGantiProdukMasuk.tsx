import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarangMasukDetailValidation } from "../../../validations/barangMasukDetail.validation";
import type { UpdateBarangMasukDetailType } from "../../../models/barangMasukDetail.model";
import { ProdukServices } from "../../../services/produk.service";
import type { ResponseProdukForChooseType } from "../../../models/produk.model";
import { useRef, useState } from "react";
import { useAlertAnimation } from "../../../hooks/useAlert";
import { BarangMasukDetailServices } from "../../../services/barangMasukDetail.service";
import { useClickOutside } from "../../../hooks/useClickOutSide";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";
import type { InputSearchRef } from "../../../types/ref.type";
import { useForm } from "react-hook-form";
import type { StatusInventoriType } from "../../../types/constant.type";

const useModalGantiProdukMasuk = (params: {
  idBarangMasuk?: number;
  status?: StatusInventoriType;
  handleCloseModal: () => void;
}) => {
  // params
  const { idBarangMasuk, status, handleCloseModal } = params;

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
  } = useForm<UpdateBarangMasukDetailType>({
    resolver: zodResolver(BarangMasukDetailValidation.UPDATE),
  });

  const { data: dataProdukForChoose, isLoading: isLoadingProdukForChoose } =
    useQuery({
      queryKey: ["produk-for-choose", search],
      queryFn: () =>
        ProdukServices.findAllForChoose({
          search,
        }),
      enabled: search !== "",
      retry: false,
      refetchOnWindowFocus: false,
    });

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
        },
        status: status!,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["barang-masuk-detail", validatedId],
      });

      reset({
        produkId: undefined,
        jumlahBox: undefined,
      });

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
      }
    },
  });

  const onSubmit = async (data: UpdateBarangMasukDetailType) => {
    try {
      if (!idBarangMasuk || !status) return;

      await mutateBarangMasukDetail(data);
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

    isPendingBarangMasukDetail,

    alert,
  };
};

export default useModalGantiProdukMasuk;
