import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarangKeluarDetailValidation } from "../../../validations/barangKeluarDetail.validation";
import type { CreateBarangKeluarDetailType } from "../../../models/barangKeluarDetail.model";
import type { ResponseProdukForChooseType } from "../../../models/produk.model";
import { useEffect, useRef, useState } from "react";
import { useAlertAnimation } from "../../../hooks/useAlert";
import { useClickOutside } from "../../../hooks/useClickOutSide";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";
import type { InputSearchRef } from "../../../types/ref.type";
import useDataProdukForChoose from "../../../hooks/useDataProdukForChoose";
import { BarangKeluarDetailServices } from "../../../services/barangKeluarDetail.service";

const useModalFormulirTambahBarangKeluar = (params: {
  handleCloseModal: () => void;
}) => {
  const queryClient = useQueryClient();

  // navigate
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

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
    control,
  } = useForm<CreateBarangKeluarDetailType>({
    resolver: zodResolver(BarangKeluarDetailValidation.CREATE),
  });

  const jumlahStokController = useController({
    control,
    name: "jumlahStok",
  });

  const hargaModalSatuanController = useController({
    control,
    name: "hargaModalSatuan",
  });

  useEffect(() => {
    setValue("barangKeluarId", validatedId!);
  }, [validatedId, setValue]);

  // use produk for choose
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
    mutationFn: (req: CreateBarangKeluarDetailType) =>
      BarangKeluarDetailServices.addBarangKeluar(req),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["barang-keluar-detail", validatedId],
      });

      reset({
        barangKeluarId: validatedId!,
        produkId: undefined,
        jumlahStok: undefined,
        hargaModalSatuan: undefined,
      });

      //   handle close modal
      params.handleCloseModal();

      setSearch("");

      inputSearchRef.current?.handleReset();

      setProdukChoose(null);

      // set toast
      navigate(currentPathname, {
        state: {
          toast: "updated_barang_keluar_detail",
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

  const onSubmit = async (data: CreateBarangKeluarDetailType) => {
    await mutateBarangKeluarDetail(data);
  };

  const handleSetValueProdukId = (id: number) => {
    if (produkChoose?.id === id) {
      handleSetAlert("produk_choose_exist");
      return;
    }

    const findDataProduk = dataProdukForChoose?.data?.find(
      (item) => item.id === id,
    );

    if (!findDataProduk) return;

    setValue("produkId", findDataProduk.id, {
      shouldValidate: true,
    });

    // set value harga modal satuan
    setValue("hargaModalSatuan", findDataProduk.hargaBeli, {
      shouldValidate: true,
    });

    // set produk choose
    setProdukChoose(findDataProduk);

    handleCloseActiveComponentChooseProduk();
  };

  const handleDeleteValueProdukId = () => {
    setProdukChoose(null);

    reset({
      barangKeluarId: validatedId!,
      produkId: undefined,
      hargaModalSatuan: undefined,
      jumlahStok: undefined,
    });

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

    jumlahStokController,
    hargaModalSatuanController,

    isPendingBarangKeluarDetail,

    alert,
  };
};

export default useModalFormulirTambahBarangKeluar;
