import { useParams } from "react-router-dom";
import { parseId } from "../../../../helpers/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarangMasukDetailValidation } from "../../../../validations/barangMasukDetail.validation";
import type { CreateBarangMasukDetailType } from "../../../../models/barangMasukDetail.model";
import { ProdukServices } from "../../../../services/produk.service";
import type { ResponseProdukForChooseType } from "../../../../models/produk.model";
import { useEffect, useRef, useState } from "react";
import { BarangMasukDetailServices } from "../../../../services/barangMasukDetail.service";
import { useClickOutside } from "../../../../hooks/useClickOutSide";
import axios from "axios";
import type { ErrorResponse } from "../../../../types/response.type";
import type { InputSearchRef } from "../../../../types/ref.type";
import useModal from "../../../../hooks/useModal";
import useDataProdukForChoose from "../../../../hooks/useDataProdukForChoose";

const useFormulirTambahBarangMasuk = (params: {
  handleSetToast: (data: string) => void;
  handleSetAlert: (data: string) => void;
}) => {
  const { handleSetToast, handleSetAlert } = params;

  // state active produk choose
  const [activeComponentChooseProduk, setActiveComponentChooseProduk] =
    useState(false);

  // state produk choose
  const [produkChoose, setProdukChoose] = useState<
    ResponseProdukForChooseType[]
  >([]);

  const inputSearchRef = useRef<InputSearchRef>(null);

  // state search
  const [search, setSearch] = useState("");

  const handleSearch = (value: string) => setSearch(value);

  // query client
  const queryClient = useQueryClient();

  //   use modal
  const {
    modalRef: modalFormulirTambahBarangRef,
    handleCloseModal: handleCloseModalFormulirTambahBarang,
    handleShowModal: handleShowModalFormulirTambahBarang,
  } = useModal();

  // params
  const { id } = useParams<{ id: string }>();
  const validatedId = parseId(id);

  // produk choose query
  // use produk for choose
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

  // mutation tambah barang
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

      handleSearch("");

      inputSearchRef.current?.handleReset();

      setProdukChoose([]);

      handleSetToast("barang_masuk_detail_add_success");
    },

    onError: (err) => {
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

  const handleShowActiveComponentChooseProduk = () => {
    setActiveComponentChooseProduk(true);
  };

  const handleCloseActiveComponentChooseProduk = () => {
    setActiveComponentChooseProduk(false);
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
      { shouldValidate: true },
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
  };

  return {
    dataProdukForChoose,
    errors,
    handleSearch,
    handleSetValueProdukId,
    handleDeleteValueProdukId,
    handleSubmit,
    isPendingBarangMasukDetail,
    onSubmit,
    produkChoose,
    wrapperRef,
    activeComponentChooseProduk,
    handleShowActiveComponentChooseProduk,
    handleCloseActiveComponentChooseProduk,
    isLoadingProdukForChoose,
    jumlahBoxController,
    inputSearchRef,
    modalFormulirTambahBarangRef,
    handleShowModalFormulirTambahBarang,
    handleCloseModalFormulirTambahBarang,
  };
};
export default useFormulirTambahBarangMasuk;
