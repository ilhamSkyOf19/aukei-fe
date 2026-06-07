import { useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { BarangMasukServices } from "../../../services/barangMasuk.service";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarangMasukDetailValidation } from "../../../validations/barangMasukDetail.validation";
import type { CreateBarangMasukDetailType } from "../../../models/barangMasukDetail.model";
import { ProdukServices } from "../../../services/produk.service";
import type { ResponseProdukForChooseType } from "../../../models/produk.model";
import { useEffect, useRef, useState } from "react";
import { useAlertAnimation } from "../../../hooks/useAlert";
import { BarangMasukDetailServices } from "../../../services/barangMasukDetail.service";
import { useToastAnimation } from "../../../hooks/useToast";
import { useClickOutside } from "../../../hooks/useClickOutSide";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";
import useConfirm from "../../../hooks/useConfirm";
import { STATUS_INVENTORI_TYPE } from "../../../types/constant.type";
import type { InputSearchRef } from "../../../types/ref.type";
import useModal from "../../../hooks/useModal";

const useBarangMasukDetail = () => {
  // query client
  const queryClient = useQueryClient();

  // state active produk choose
  const [activeComponentChooseProduk, setActiveComponentChooseProduk] =
    useState<boolean>(false);

  // state produk choose
  const [produkChoose, setProdukChoose] = useState<
    ResponseProdukForChooseType[]
  >([]);

  const inputSearchRef = useRef<InputSearchRef>(null);

  // show modal konfirmasi posting
  const {
    modalRef: modalKonfirmasiPostingRef,
    confirm,
    handleConfirm: handleConfirmPosting,
    handleCancel: handleCancelConfirmPosting,
  } = useConfirm();

  // use modal tambah barang masuk
  const {
    modalRef: modalFormulirTambahBarangRef,
    handleCloseModal: handleCloseModalFormulirTambahBarang,
    handleShowModal: handleShowModalFormulirTambahBarang,
  } = useModal();

  // state search
  const [search, setSearch] = useState<string>("");

  // handle set is search
  const handleSearch = (value: string) => setSearch(value);

  // handle

  // use alert
  const { alert, handleSetAlert } = useAlertAnimation();

  // use toast
  const { toast, handleSetToast } = useToastAnimation();

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
        queryFn: () => ProdukServices.findAllForChoose({ search: search }),
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

  // wrapper modal

  useClickOutside({
    ref: wrapperRef,
    callback: () => {
      handleCloseActiveComponentChooseProduk();
    },
  });

  // use form create
  const {
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    control,
  } = useForm<CreateBarangMasukDetailType>({
    resolver: zodResolver(BarangMasukDetailValidation.CREATE),
  });

  // jumlah box controller
  const jumlahBoxController = useController({
    control,
    name: "jumlahBox",
  });

  // set value barangMasukId
  useEffect(() => {
    setValue("barangMasukId", validatedId!);
  }, [validatedId]);

  // use mutation
  const {
    mutateAsync: mutateBarangMasukDetail,
    isPending: isPendingBarangMasukDetail,
  } = useMutation({
    mutationFn: (req: CreateBarangMasukDetailType) =>
      BarangMasukDetailServices.addBarang(req),
    onSuccess: () => {
      // invalidated
      queryClient.invalidateQueries({
        queryKey: ["barang-masuk-detail", validatedId],
      });

      // set value
      reset({
        barangMasukId: validatedId!,
        produkId: [],
        jumlahBox: undefined,
      });

      // reset
      handleSearch("");

      // reset
      inputSearchRef.current?.handleReset();

      setProdukChoose([]);

      handleSetToast("barang_masuk_detail_add_success");
    },
    onError: (err) => {
      console.log(err);
      if (axios.isAxiosError<ErrorResponse>(err)) {
        if (err?.response?.data?.meta?.statusCode === 409) {
          handleSetAlert("produk_choose_exist_in_data");
        }
      }
    },
  });

  // handle submit
  const onSubmit = async (data: CreateBarangMasukDetailType) => {
    // check status
    if (dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.POSTED)
      return;

    console.log(data);

    // hit
    await mutateBarangMasukDetail(data);
  };

  // handle set value produkId
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

  // handle delete value produkId
  const handleDeleteValueProdukId = (id: number) => {
    const newProdukChoose = produkChoose.filter((item) => item.id !== id);

    setProdukChoose(newProdukChoose);

    setValue(
      "produkId",
      newProdukChoose.map((item) => item.id),
    );

    handleCloseActiveComponentChooseProduk();
  };

  // mutate posting
  const { mutateAsync: mutatePosting, isPending: isPendingPosting } =
    useMutation({
      mutationFn: (id: number) => BarangMasukServices.posted(id),
      onSuccess: () => {
        // handle toast
        handleSetToast("posted");

        // reset
        reset();

        // revalidated
        queryClient.invalidateQueries({
          queryKey: ["barang-masuk-detail", validatedId],
        });
      },
      onError: (err) => {
        console.log(err);
      },
    });

  // handle posting
  const handlePosting = async (id: number) => {
    try {
      if (dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.POSTED)
        return;

      // confirm
      const isConfirm = await confirm();

      if (!isConfirm) {
        return;
      }

      await mutatePosting(id);
    } catch (error) {
      console.log(error);
    }
  };

  // mutate cancel posting
  const {
    mutateAsync: mutateCancelPosting,
    isPending: isPendingCancelPosting,
  } = useMutation({
    mutationFn: (id: number) => BarangMasukServices.cancelPosted(id),

    onSuccess: () => {
      // handle toast
      handleSetToast("cancel_posted");

      // revalidated
      queryClient.invalidateQueries({
        queryKey: ["barang-masuk-detail", validatedId],
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // is expired
  const isExpired =
    dataBarangMasukDetail?.data &&
    Date.now() - new Date(dataBarangMasukDetail?.data?.createdAt).getTime() >
      24 * 60 * 60 * 1000;

  // handle posting
  const handleCancelPosting = async (id: number) => {
    try {
      if (
        dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT ||
        isExpired
      )
        return;

      // confirm
      const isConfirm = await confirm();

      if (!isConfirm) {
        return;
      }

      await mutateCancelPosting(id);
    } catch (error) {
      console.log(error);
    }
  };

  const isStatusPosted =
    dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.POSTED;
  const isStatusDraft =
    dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT;

  return {
    dataBarangMasukDetail,
    isLoadingBarangMasukDetail,
    dataProdukForChoose,
    errors,
    handleSubmit,
    handleSearch,
    handleSetValueProdukId,
    handleDeleteValueProdukId,
    alert,
    onSubmit,
    isPendingBarangMasukDetail,
    produkChoose,
    wrapperRef,
    activeComponentChooseProduk,
    handleShowActiveComponentChooseProduk,
    handleCloseActiveComponentChooseProduk,
    isLoadingProdukForChoose,
    toast,
    handlePosting,
    isPendingPosting,
    modalKonfirmasiPostingRef,
    handleCancelPosting,
    handleConfirmPosting,
    handleCancelConfirmPosting,
    isPendingCancelPosting,
    isStatusPosted,
    isStatusDraft,
    isExpired,
    jumlahBoxController,
    inputSearchRef,
    modalFormulirTambahBarangRef,
    handleShowModalFormulirTambahBarang,
    handleCloseModalFormulirTambahBarang,
  };
};

export default useBarangMasukDetail;
