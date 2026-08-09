import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { TransactionServices } from "../../../services/transaction.service";
import {
  useController,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  CreateReturBarangForService,
  CreateReturnRequestType,
} from "../../../models/returBarang.model";
import { ReturBarangValidations } from "../../../validations/returBarang.validation";
import { useEffect, useMemo } from "react";
import useConfirm from "../../../hooks/useConfirm";
import { ReturBarangServices } from "../../../services/returBarang.service";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";
import { useAuthStore } from "../../../stores/authStore";
import { ROLE_INTERNAL_TYPE } from "../../../types/constant.type";
import useSizeWindows from "../../../hooks/useSizeWindows";

const useReturBarang = () => {
  const pengguna = useAuthStore((state) => state.pengguna);

  // navigate
  const navigate = useNavigate();

  const currentPathname = useLocation().pathname;

  //   get transaction id from params
  const { transactionId, returBarangId } = useParams<{
    transactionId: string;
    returBarangId: string;
  }>();

  // window size
  const windowSize = useSizeWindows();

  // validate
  const validateTransactionId = parseId(transactionId);

  // validated retur barang id
  const validateReturBarangId = parseId(returBarangId);

  // use query
  const data = useQueries({
    queries: [
      {
        queryKey: ["transaction-for-retur-barang", validateTransactionId],
        queryFn: () =>
          TransactionServices.findTransaksiForReturBarang({
            id: validateTransactionId!,
          }),
        enabled: !!validateTransactionId,
        retry: false,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["return-details", validateReturBarangId],
        queryFn: () =>
          ReturBarangServices.findAllByReturnTransactionId({
            id: validateReturBarangId!,
          }),
        enabled: !!validateReturBarangId,
        retry: false,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const [
    { data: dataForReturBarang, isLoading: isLoadingForReturBarang },
    { data: dataReturDetails, isLoading: isLoadingReturDetails },
  ] = data;

  // use modal confirm
  const {
    confirm,
    data: dataConfirm,
    handleCancel: handleCancelConfirm,
    handleConfirm,
    modalRef: modalConfirmRef,
    handleCloseModal: handleCloseModalConfirm,
  } = useConfirm<{
    bigTitle: string;
    smallTitle: string;
  }>();

  // use form
  const {
    control,
    reset,
    setError,
    clearErrors,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateReturnRequestType>({
    resolver: zodResolver(ReturBarangValidations.CREATE),
    defaultValues: {
      details: [],
    },
  });

  // set default value
  useEffect(() => {
    if (!dataForReturBarang?.data || !dataReturDetails?.data) {
      return;
    }

    const transactionDetails = dataForReturBarang.data.details;

    const transactionDetailMap = new Map(
      transactionDetails.map((item) => [item.id, item]),
    );

    reset({
      details: dataReturDetails.data.map((returDetail) => {
        const transactionDetail = transactionDetailMap.get(
          returDetail.transactionDetailId,
        );

        return {
          transactionDetailId: returDetail.transactionDetailId,

          quantityGood: returDetail.quantityGood,
          quantityDamaged: returDetail.quantityDamaged,
          quantityReturn: returDetail.quantityReturn,
          totalRefund: returDetail.totalRefund,

          // data dari transaksi
          hargaJual: transactionDetail?.hargaJual ?? 0,
          img: transactionDetail?.produk.img ?? "",
          kode: transactionDetail?.produk.kode ?? "",
          maxQuantity:
            (transactionDetail?.quantity ?? 0) -
            (transactionDetail?.totalRetur ?? 0),
          nama: transactionDetail?.produk.nama ?? "",
        };
      }),
    });
  }, [dataForReturBarang, dataReturDetails, reset]);

  //   custom total refund controller
  const customTotalRefundController = useController({
    control,
    name: "customTotalRefund",
  });

  //   use field array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  //   handle append
  const handleAppend = (params: {
    detailId: number;
    nama: string;
    kode: string;
    img: string;
    hargaJual: number;
    maxQuantity: number;
    quantityWasRetur: number;
  }) => {
    append({
      transactionDetailId: params.detailId,
      nama: params.nama,
      kode: params.kode,
      img: params.img,
      hargaJual: params.hargaJual,
      quantityGood: 0,
      quantityDamaged: 0,
      maxQuantity: params.maxQuantity - params.quantityWasRetur,
    });
  };

  const detailsWatch = useWatch({
    control,
    name: "details",
  });

  // quantity
  const quantityMap = useMemo(() => {
    return new Map(
      dataForReturBarang?.data?.details.map((detail) => [
        detail.id,
        detail.quantity,
      ]),
    );
  }, [dataForReturBarang]);

  // use effect
  useEffect(() => {
    detailsWatch.forEach((detail, index) => {
      const maxQty = quantityMap.get(detail.transactionDetailId) ?? 0;

      const totalReturn =
        (detail.quantityGood ?? 0) + (detail.quantityDamaged ?? 0);

      if (totalReturn > maxQty) {
        setError(`details.${index}.quantityGood`, {
          type: "manual",
          message: `Jumlah return tidak boleh melebihi ${maxQty}.`,
        });
        setError(`details.${index}.quantityDamaged`, {
          type: "manual",
          message: `Jumlah return tidak boleh melebihi ${maxQty}.`,
        });
      } else {
        clearErrors(`details.${index}.quantityGood`);
        clearErrors(`details.${index}.quantityDamaged`);
      }
    });
  }, [detailsWatch, quantityMap, setError, clearErrors]);

  const summary = useMemo(() => {
    return detailsWatch.reduce(
      (acc, detail, index) => {
        const hargaJual = fields[index]?.hargaJual ?? 0;

        acc.totalBarangRusak += detail.quantityDamaged ?? 0;
        acc.totalBarangBagus += detail.quantityGood ?? 0;
        acc.totalRefund +=
          ((detail.quantityGood ?? 0) + (detail.quantityDamaged ?? 0)) *
          hargaJual;

        return acc;
      },
      {
        totalBarangRusak: 0,
        totalBarangBagus: 0,
        totalRefund: 0,
      },
    );
  }, [detailsWatch, fields]);

  //   handle back
  const handleBack = () => {
    return navigate(currentPathname.split("/").slice(0, -1).join("/"));
  };

  //   handle batal retur
  const handleBatalRetur = async () => {
    // confirm
    const useConfirm = await confirm({
      bigTitle: "Apakah Anda yakin ingin membatalkan retur barang?",
      smallTitle: "Data retur barang yang sudah ditambahkan akan dihapus.",
    });

    if (!useConfirm) return;

    // reset
    reset();

    // handle back
    handleBack();
  };

  // watch custom total refund
  const customTotalRefundWatch = useWatch({
    control,
    name: "customTotalRefund",
  });

  // mutation
  const {
    mutateAsync: mutateReturBarang,
    isPending: isPendingMutateReturBarang,
  } = useMutation({
    mutationFn: (data: CreateReturBarangForService) =>
      ReturBarangServices.create(data),
    onSuccess: (data) => {
      // reset
      reset();

      if (data) {
        navigate(
          `${currentPathname.split("/").slice(0, -1).join("/")}/daftar-retur-barang/detail/${data.data?.id}`,
          {
            state: {
              toast:
                pengguna?.role === ROLE_INTERNAL_TYPE.OWNER
                  ? "created_retur_barang_owner"
                  : "created_retur_barang_kasir",
            },
          },
        );
      }

      // close modal confirm
      handleCloseModalConfirm();
    },
    onError: (err) => {
      if (axios.isAxiosError<ErrorResponse>(err)) {
        if (err.response?.data.meta.customField?.includes("overload_qty")) {
          // handle error nya
          setError(`details`, {
            type: "manual",
            message: `Return barang melebihi quantity yang sudah dipesan.`,
          });
        }
      }
    },
  });

  // on submit
  const onSubmit = async (data: { keterangan?: string }) => {
    try {
      // check validated id
      if (!validateTransactionId) return;

      // confirm
      const isConfirm = await confirm(
        {
          bigTitle: "Apakah Anda yakin ingin memproses retur barang?",
          smallTitle:
            pengguna?.role === ROLE_INTERNAL_TYPE.OWNER
              ? "Pastikan seluruh data retur sudah benar. Retur akan masuk tahap review. Silakan review dan setujui jika data sudah sesuai."
              : "Pastikan seluruh data retur sudah benar. Setelah diajukan, retur akan menunggu verifikasi dari owner sebelum diproses.",
        },
        {
          disableCloseAfterSubmit: true,
        },
      );

      if (!isConfirm) return;

      // call mutation
      await mutateReturBarang({
        transactionId: validateTransactionId!,
        customTotalRefund: customTotalRefundWatch,
        keterangan: data.keterangan,
        details: detailsWatch.map((item) => ({
          quantityDamaged: item.quantityDamaged,
          quantityGood: item.quantityGood,
          transactionDetailId: item.transactionDetailId,
        })),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const isCanSimpanAndAjukan = useMemo(() => {
    return (
      fields.length > 0 &&
      detailsWatch.every(
        (item) =>
          item.quantityGood > 0 ||
          item.quantityDamaged > 0 ||
          item.maxQuantity <= item.quantityDamaged + item.quantityGood,
      )
    );
  }, [detailsWatch, fields]);

  return {
    handleBack,
    dataForReturBarang,
    isLoadingForReturBarang,
    fields,
    handleAppend,
    remove,
    control,
    summary,
    customTotalRefundController,
    handleBatalRetur,
    modalConfirmRef,
    handleCancelConfirm,
    handleConfirm,
    dataConfirm,
    onSubmit,
    isPendingMutateReturBarang,
    handleSubmit,
    isCanSimpanAndAjukan,
    pengguna,
    windowSize,
    register,
    errors,

    validateReturBarangId,
    isLoadingReturDetails,
  };
};

export default useReturBarang;
