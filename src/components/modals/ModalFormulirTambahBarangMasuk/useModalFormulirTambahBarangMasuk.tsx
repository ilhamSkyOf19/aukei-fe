import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarangMasukDetailValidation } from "../../../validations/barangMasukDetail.validation";
import type { CreateBarangMasukDetailType } from "../../../models/barangMasukDetail.model";
import { ProdukServices } from "../../../services/produk.service";
import type { ResponseProdukForChooseType } from "../../../models/produk.model";
import { useEffect, useRef, useState } from "react";
import { useAlertAnimation } from "../../../hooks/useAlert";
import { BarangMasukDetailServices } from "../../../services/barangMasukDetail.service";
import { useClickOutside } from "../../../hooks/useClickOutSide";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";
import type { InputSearchRef } from "../../../types/ref.type";

const useModalFormulirTambahBarangMasuk = (params: {
  handleCloseModal: () => void;
}) => {
  const queryClient = useQueryClient();

  // navigate
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  const [activeComponentChooseProduk, setActiveComponentChooseProduk] =
    useState(false);

  const [produkChoose, setProdukChoose] = useState<
    ResponseProdukForChooseType[]
  >([]);

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
    control,
  } = useForm<CreateBarangMasukDetailType>({
    resolver: zodResolver(BarangMasukDetailValidation.CREATE),
  });

  const jumlahBoxController = useController({
    control,
    name: "jumlahBox",
  });

  useEffect(() => {
    setValue("barangMasukId", validatedId!);
  }, [validatedId, setValue]);

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
    mutationFn: (req: CreateBarangMasukDetailType) =>
      BarangMasukDetailServices.addBarang(req),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["barang-masuk-detail", validatedId],
      });

      reset({
        barangMasukId: validatedId!,
        produkId: [],
        jumlahBox: undefined,
      });

      //   handle close modal
      params.handleCloseModal();

      setSearch("");

      inputSearchRef.current?.handleReset();

      setProdukChoose([]);

      // set toast
      navigate(currentPathname, {
        state: {
          toast: "updated_barang_masuk_detail",
        },
      });
    },

    onError: (err) => {
      console.log(err);

      if (axios.isAxiosError<ErrorResponse>(err)) {
        if (err.response?.data?.meta?.statusCode === 409) {
          handleSetAlert("produk_choose_exist_in_data");
        }
      }
    },
  });

  const onSubmit = async (data: CreateBarangMasukDetailType) => {
    await mutateBarangMasukDetail(data);
  };

  const handleSetValueProdukId = (id: number) => {
    if (produkChoose.some((item) => item.id === id)) {
      handleSetAlert("produk_choose_exist");
      return;
    }

    const findData = dataProdukForChoose?.data?.find((item) => item.id === id);

    if (!findData) return;

    const newProdukChoose = [...produkChoose, findData];

    setProdukChoose(newProdukChoose);

    setValue(
      "produkId",
      newProdukChoose.map((item) => item.id),
      {
        shouldValidate: true,
      },
    );

    handleCloseActiveComponentChooseProduk();
  };

  const handleDeleteValueProdukId = (id: number) => {
    const newProdukChoose = produkChoose.filter((item) => item.id !== id);

    setProdukChoose(newProdukChoose);

    setValue(
      "produkId",
      newProdukChoose.map((item) => item.id),
    );

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

    jumlahBoxController,

    isPendingBarangMasukDetail,

    alert,
  };
};

export default useModalFormulirTambahBarangMasuk;
