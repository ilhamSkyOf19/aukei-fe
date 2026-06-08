import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarangKeluarDetailValidation } from "../../../validations/barangKeluarDetail.validation";
import type { UpdateBarangKeluarDetailType } from "../../../models/barangKeluarDetail.model";
import type { ResponseProdukForChooseType } from "../../../models/produk.model";
import { useEffect, useRef, useState } from "react";
import { useAlertAnimation } from "../../../hooks/useAlert";
import { BarangKeluarDetailServices } from "../../../services/barangKeluarDetail.service";
import { useClickOutside } from "../../../hooks/useClickOutSide";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";
import type { InputSearchRef } from "../../../types/ref.type";
import { useController, useForm } from "react-hook-form";
import type { StatusInventoriType } from "../../../types/constant.type";
import useDataProdukForChoose from "../../../hooks/useDataProdukForChoose";

const useModalUbahProdukKeluar = (params: {
  idBarangKeluar?: number;
  status?: StatusInventoriType;
  dataUpdate: {
    jumlahStok?: number;
    hargaModalSatuan?: number;
    produkId?: number;
  };
  handleCloseModal: () => void;
}) => {
  // params
  const {
    idBarangKeluar,
    status,
    handleCloseModal,
    dataUpdate: { jumlahStok, hargaModalSatuan, produkId },
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
  } = useForm<UpdateBarangKeluarDetailType>({
    resolver: zodResolver(BarangKeluarDetailValidation.UPDATE),
  });

  // reset
  useEffect(() => {
    reset({
      produkId,
      jumlahStok,
      hargaModalSatuan,
    });
  }, [reset, jumlahStok, hargaModalSatuan]);

  // jumlah stok control
  const jumlahStokController = useController({
    control,
    name: "jumlahStok",
  });

  // harga modal satuan control
  const hargaModalSatuanController = useController({
    control,
    name: "hargaModalSatuan",
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
          jumlahStok: req.jumlahStok,
          hargaModalSatuan: req.hargaModalSatuan,
        },
        status: status!,
      }),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["barang-keluar-detail", validatedId],
      });

      if (data?.data) {
        reset({
          produkId: data.data.produk.id,
          jumlahStok: data.data.jumlahStok,
          hargaModalSatuan: data.data.hargaModalSatuan,
        });
      }

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
        if (err.response?.data?.meta?.statusCode === 409) {
          if (
            err.response?.data?.meta?.customField?.includes(
              "detail_barang_keluar_barangKeluarId_produkId_key",
            )
          ) {
            handleSetAlert("produk_choose_exist_in_data");
          }
        }
      }
    },
  });

  const onSubmit = async (data: UpdateBarangKeluarDetailType) => {
    try {
      if (!idBarangKeluar || !status) return;

      const isProdukChanged =
        produkChoose === null ? false : data.produkId !== produkId;
      const isJumlahStokChanged = data.jumlahStok !== jumlahStok;
      const isHargaModalSatuanChanged =
        data.hargaModalSatuan !== hargaModalSatuan;

      if (!isProdukChanged && produkChoose) {
        handleSetAlert("produk_choose_exist_in_data");
        return;
      }

      // check
      if (
        !isProdukChanged &&
        !isJumlahStokChanged &&
        !isHargaModalSatuanChanged
      ) {
        setError("produkId", {
          message: "Minimal ubah produk, jumlah stok atau harga modal satuan",
        });

        setError("jumlahStok", {
          message: "Minimal ubah produk, jumlah stok atau harga modal satuan",
        });

        setError("hargaModalSatuan", {
          message: "Minimal ubah produk, jumlah stok atau harga modal satuan",
        });

        return;
      }

      const payload: UpdateBarangKeluarDetailType = {
        produkId: isProdukChanged ? data.produkId : undefined,
        jumlahStok: isJumlahStokChanged ? data.jumlahStok : undefined,
        hargaModalSatuan: isHargaModalSatuanChanged
          ? data.hargaModalSatuan
          : undefined,
      };

      console.log(payload);

      await mutateBarangKeluarDetail(payload);
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

    jumlahStokController,
    hargaModalSatuanController,
  };
};

export default useModalUbahProdukKeluar;
