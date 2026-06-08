import { useParams } from "react-router-dom";
import { parseId } from "../../../../helpers/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateBarangKeluarDetailType } from "../../../../models/barangKeluarDetail.model";
import type { ResponseProdukForChooseType } from "../../../../models/produk.model";
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "../../../../hooks/useClickOutSide";
import axios from "axios";
import type { ErrorResponse } from "../../../../types/response.type";
import type { InputSearchRef } from "../../../../types/ref.type";
import useModal from "../../../../hooks/useModal";
import { BarangKeluarDetailValidation } from "../../../../validations/barangKeluarDetail.validation";
import { BarangKeluarDetailServices } from "../../../../services/barangKeluarDetail.service";
import useDataProdukForChoose from "../../../../hooks/useDataProdukForChoose";

const useFormulirTambahBarangKeluar = (params: {
  handleSetToast: (data: string) => void;
  handleSetAlert: (data: string) => void;
}) => {
  const { handleSetToast, handleSetAlert } = params;

  // state active produk choose
  const [activeComponentChooseProduk, setActiveComponentChooseProduk] =
    useState(false);

  // state produk choose
  const [produkChoose, setProdukChoose] =
    useState<ResponseProdukForChooseType | null>(null);

  const inputSearchRef = useRef<InputSearchRef>(null);

  // state search
  const [search, setSearch] = useState("");

  const handleSearch = (value: string) => setSearch(value);

  // query client
  const queryClient = useQueryClient();

  //   use modal
  const {
    modalRef: modalFormulirTambahBarangKeluarRef,
    handleCloseModal: handleCloseModalFormulirTambahBarangKeluar,
    handleShowModal: handleShowModalFormulirTambahBarangKeluar,
  } = useModal();

  // params
  const { id } = useParams<{ id: string }>();
  const validatedId = parseId(id);

  // produk choose query
  const { dataProdukForChoose, isLoadingProdukForChoose } =
    useDataProdukForChoose({ search });

  // click outside
  const wrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: wrapperRef,
    callback: () => {
      setActiveComponentChooseProduk(false);
    },
  });

  // form
  const {
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    control,
  } = useForm<CreateBarangKeluarDetailType>({
    resolver: zodResolver(BarangKeluarDetailValidation.CREATE),
  });

  // jumlah stok controller
  const jumlahStokController = useController({
    control,
    name: "jumlahStok",
  });

  // harga modal satuan controller
  const hargaModalSatuanController = useController({
    control,
    name: "hargaModalSatuan",
  });

  useEffect(() => {
    setValue("barangKeluarId", validatedId!);
  }, [validatedId, setValue]);

  // mutation tambah barang
  const {
    mutateAsync: mutateBarangKeluarDetail,
    isPending: isPendingBarangKeluarDetail,
  } = useMutation({
    mutationFn: (req: CreateBarangKeluarDetailType) =>
      BarangKeluarDetailServices.addBarangKeluar(req),

    onSuccess: () => {
      reset({
        barangKeluarId: validatedId!,
        produkId: undefined,
        jumlahStok: undefined,
        hargaModalSatuan: undefined,
      });

      handleSearch("");

      inputSearchRef.current?.handleReset();

      setProdukChoose(null);

      handleSetToast("barang_keluar_detail_add_success");

      // query
      queryClient.invalidateQueries({
        queryKey: ["barang-keluar-detail", validatedId],
      });
    },

    onError: (err) => {
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

  const handleShowActiveComponentChooseProduk = () => {
    setActiveComponentChooseProduk(true);
  };

  const handleCloseActiveComponentChooseProduk = () => {
    setActiveComponentChooseProduk(false);
  };

  const handleSetValueProdukId = (id: number) => {
    if (produkChoose?.id === id) {
      handleSetAlert("produk_choose_exist");
      return;
    }

    const findData = dataProdukForChoose?.data?.find((item) => item.id === id);

    if (!findData) return;

    setProdukChoose(findData);

    setValue("produkId", findData.id, { shouldValidate: true });

    // set value harga modal satuan
    setValue("hargaModalSatuan", findData.hargaBeli, {
      shouldValidate: true,
    });

    handleCloseActiveComponentChooseProduk();
  };

  const handleDeleteValueProdukId = () => {
    setProdukChoose(null);

    reset({
      produkId: undefined,
    });

    handleCloseActiveComponentChooseProduk();
  };

  return {
    dataProdukForChoose,
    errors,
    handleSearch,
    handleSetValueProdukId,
    handleDeleteValueProdukId,
    handleSubmit,
    isPendingBarangKeluarDetail,
    onSubmit,
    produkChoose,
    wrapperRef,
    activeComponentChooseProduk,
    handleShowActiveComponentChooseProduk,
    handleCloseActiveComponentChooseProduk,
    isLoadingProdukForChoose,
    jumlahStokController,
    inputSearchRef,
    modalFormulirTambahBarangKeluarRef,
    handleShowModalFormulirTambahBarangKeluar,
    handleCloseModalFormulirTambahBarangKeluar,
    hargaModalSatuanController,
  };
};
export default useFormulirTambahBarangKeluar;
