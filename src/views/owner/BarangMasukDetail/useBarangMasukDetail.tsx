import { useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useMutation, useQueries } from "@tanstack/react-query";
import { BarangMasukServices } from "../../../services/barangMasuk.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarangMasukDetailValidation } from "../../../validations/barangMasukDetail.validation";
import type { CreateBarangMasukDetailType } from "../../../models/barangMasukDetail.model";
import { ProdukServices } from "../../../services/produk.service";
import type { ResponseProdukForChooseType } from "../../../models/produk.model";
import { useEffect, useRef, useState } from "react";
import { useAlertAnimation } from "../../../hooks/useAlert";
import { BarangMasukDetailServices } from "../../../services/barangMasukDetail.service";
import { useClickOutside } from "../../../hooks/useClickOutSide";

const useBarangMasukDetail = () => {
  // state active produk choose
  const [activeComponentChooseProduk, setActiveComponentChooseProduk] =
    useState<boolean>(false);

  // state produk choose
  const [produkChoose, setProdukChoose] = useState<
    ResponseProdukForChooseType[]
  >([]);

  // state search
  const [search, setSearch] = useState<string>("");

  // handle set is search
  const handleSearch = (value: string) => setSearch(value);

  // use alert
  const { alert, handleSetAlert } = useAlertAnimation();

  // get id from params
  const { id } = useParams<{ id: string }>();
  // parse
  const validatedId = parseId(id);

  // use query
  const data = useQueries({
    queries: [
      {
        queryKey: ["barang-masuk-detail", validatedId],
        queryFn: () => BarangMasukServices.detail({ id: validatedId! }),
        enabled: !!validatedId,
        retry: false,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["produk-for-choose", search],
        queryFn: () => ProdukServices.findAllForChoose({ search }),
        enabled: search !== "",
        retry: false,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const [
    { data: dataBarangMasukDetail, isLoading: isLoadingBarangMasukDetail },
    { data: dataProdukForChoose, isLoading: isLoadingProdukForChoose },
  ] = data;

  // handle handleSetActiveComponentChooseProduk
  const handleShowActiveComponentChooseProduk = () => {
    setActiveComponentChooseProduk(true);
  };

  // handle close
  const handleCloseActiveComponentChooseProduk = () => {
    setActiveComponentChooseProduk(false);
  };

  // use click outside
  const wrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: wrapperRef,
    callback: () => {
      handleCloseActiveComponentChooseProduk();
    },
  });

  // use form create
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<CreateBarangMasukDetailType>({
    resolver: zodResolver(BarangMasukDetailValidation.CREATE),
  });

  // set value barangMasukId
  useEffect(() => {
    setValue("barangMasukId", validatedId!);
  }, [validatedId, setValue]);

  // use mutation
  const {
    mutateAsync: mutateBarangMasukDetail,
    isPending: isPendingBarangMasukDetail,
  } = useMutation({
    mutationFn: (req: CreateBarangMasukDetailType) =>
      BarangMasukDetailServices.addBarang(req),
    onSuccess: () => {
      handleSetAlert("barang_masuk_detail_add_success");
    },
    onError: (err) => {
      console.log(err);
      handleSetAlert("barang_masuk_detail_add_failed");
    },
  });

  // handle submit
  const onSubmit = async (data: CreateBarangMasukDetailType) => {
    await mutateBarangMasukDetail(data);
  };

  // handle set value produkId
  const handleSetValueProdukId = (id: number) => {
    if (produkChoose.some((item) => item.id === id)) {
      handleSetAlert("produk_choose_exist");

      return;
    }

    // set state
    const findData = dataProdukForChoose?.data?.find((item) => item.id === id);
    if (findData) {
      setProdukChoose((prev) => [...prev, findData]);
    }

    // set value
    setValue("produkId", [...produkChoose.map((item) => item.id), id]);

    handleCloseActiveComponentChooseProduk();
  };

  return {
    dataBarangMasukDetail,
    isLoadingBarangMasukDetail,
    dataProdukForChoose,
    register,
    errors,
    handleSubmit,
    handleSearch,
    handleSetValueProdukId,
    alert,
    onSubmit,
    isPendingBarangMasukDetail,
    produkChoose,
    wrapperRef,
    activeComponentChooseProduk,
    handleShowActiveComponentChooseProduk,
    handleCloseActiveComponentChooseProduk,
    isLoadingProdukForChoose,
  };
};

export default useBarangMasukDetail;
