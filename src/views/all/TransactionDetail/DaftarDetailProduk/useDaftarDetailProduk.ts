import { useState } from "react";
import { useController, useForm } from "react-hook-form";
import type { UpdateHargaAndDiskonAndQuantityForRequestType } from "../../../../models/transactionDetail.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionDetailValidations } from "../../../../validations/transactionDetail.validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TransactionDetailServices } from "../../../../services/transactionDetail.service";
import type {
  DetailsForCreate,
  ResponseStatistikKebutuhanBarang,
} from "../../../../models/transaction.model";
import type { ResponseStructure } from "../../../../types/response.type";
import { useNavigate } from "react-router-dom";
import { useTransactionComplate } from "../../../../stores/useTransactionComplate";
import useCreateTransactionOld from "../../../../hooks/useCreateTransactionOld";
import { useStepStore } from "../../../../stores/stepStore";
import { isMoreThanDays } from "../../../../helpers/helpers";
import useModal from "../../../../hooks/useModal";
import type { ResponseProdukForKasirType } from "../../../../models/produk.model";

const useDaftarDetailProduk = (params: {
  transactionId?: number | null;
  dataKebutuhanBarang?: ResponseStructure<
    ResponseStatistikKebutuhanBarang[] | null
  >;
  isLoadingKebutuhanBarang?: boolean;
  completedAt?: Date | null;
}) => {
  const {
    transactionId,
    dataKebutuhanBarang,
    isLoadingKebutuhanBarang,
    completedAt,
  } = params;
  // query client
  const queryClient = useQueryClient();

  // navigate
  const navigate = useNavigate();

  const {
    modalRef: modalUpdateProdukRef,
    handleShowModal: handleShowModalUpdateProduk,
    handleCloseModal: handleCloseModalUpdateProduk,
    dataModal: dataModalUpdateProduk,
    idModal: idModalUpdateProduk,
  } = useModal<
    Pick<DetailsForCreate, "produkId" | "hargaJual" | "quantity"> &
      Omit<ResponseProdukForKasirType, "id" | "kategori"> & {
        diskon?: number;
        detailId?: number;
        hargaModalRataRata: number;
        hargaJualOld?: number;
      } & {
        transactionId?: number;
      }
  >();

  // modal delete
  const {
    modalRef: modalDeleteRef,
    handleShowModal: handleShowModalDelete,
    handleCloseModal: handleCloseModalDelete,
    idModal: idModalDelete,
    dataModal: dataModalDelete,
  } = useModal<{ namaProduk: string }>();

  // store update transaksi
  const setUpdateTransaksi = useTransactionComplate((state) => state.setUpdate);

  // state is ubah data
  const [isUbahData, setIsUbahData] = useState<boolean>(false);

  // state is active
  const [isFromActive, setIsFromActive] = useState<{
    detailId: number;
    hargaJual: boolean;
    diskon: boolean;
    quantity: boolean;
  } | null>(null);

  // get use form
  const { control, handleSubmit, reset } =
    useForm<UpdateHargaAndDiskonAndQuantityForRequestType>({
      resolver: zodResolver(TransactionDetailValidations.UPDATE),
    });

  // harga jual controller
  const hargaJualController = useController({
    control,
    name: "hargaJual",
  });

  // diskon controller
  const diskonController = useController({
    control,
    name: "diskon",
  });

  // quantity controller
  const quantityController = useController({
    control,
    name: "quantity",
  });

  // mutate
  const { mutateAsync: mutateUpdate, isPending: isPendingUpdate } = useMutation(
    {
      mutationFn: (
        data: UpdateHargaAndDiskonAndQuantityForRequestType & {
          transactionDetailId: number;
        },
      ) =>
        TransactionDetailServices.updateTransaksiDetail({
          transactionDetailId: data.transactionDetailId,
          req: {
            diskon: data.diskon,
            hargaJual: data.hargaJual,
            quantity: data.quantity,
          },
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["transaction", transactionId],
        });

        // reset value
        reset();

        // reset is from active
        setIsFromActive(null);
      },
      onError: (err) => {
        console.log(err);
      },
    },
  );

  // on submit
  const onSubmit = async (
    data: UpdateHargaAndDiskonAndQuantityForRequestType,
  ) => {
    try {
      if (isFromActive === null) return;

      await mutateUpdate({
        transactionDetailId: isFromActive.detailId,
        ...data,
      });
    } catch (error) {
      console.log(error);
    }
  };
  // handle set is from active
  const handleSetIsFromActive = (params: {
    detailId?: number;
    hargaJual?: {
      data: number;
    };
    diskon?: {
      data: number;
    };
    quantity?: {
      data: number;
    };
    reset?: boolean;
  }) => {
    if (params.reset) {
      setIsFromActive(null);
      return;
    }

    const { detailId, diskon, hargaJual, quantity } = params;

    // reset value
    reset({
      hargaJual: hargaJual?.data ?? undefined,
      diskon: diskon?.data ?? undefined,
      quantity: quantity?.data ?? undefined,
    });

    setIsFromActive({
      detailId: detailId ?? 0,
      hargaJual: hargaJual ? true : false,
      diskon: diskon ? true : false,
      quantity: quantity ? true : false,
    });
  };

  const isExistDataKebutuhanBarang: boolean =
    !isLoadingKebutuhanBarang && !!dataKebutuhanBarang?.data?.length;

  const siapKirim = dataKebutuhanBarang?.data?.some(
    (item) => item.siapKirim === true,
  );

  // handle to retur
  const handleToRetur = () => {
    navigate(`/dashboard/riwayat-transaksi/${transactionId}/retur-barang`);
  };

  // handle daftar retur barang
  const handleDaftarReturBarang = (id?: number | null) => {
    navigate(`/dashboard/riwayat-transaksi/${id}/daftar-retur-barang`);
  };

  // get use create transaction old
  const { handleCreateTransactionOld, isPendingTransactionOld } =
    useCreateTransactionOld({});

  const setStep = useStepStore((state) => state.setStep);

  // handle ubah transaksi
  const handleUbahProduk = async (params: { id?: number }) => {
    if (!params.id) return;

    await handleCreateTransactionOld(params.id);

    setUpdateTransaksi({ update: true, transactionId: params.id });

    setStep(1);

    return navigate(`/dashboard/riwayat-transaksi/${params.id}/ubah-produk`);
  };

  // is expired
  const isExpired3Days = completedAt ? isMoreThanDays(completedAt, 3) : false;

  // mutation delete
  const { mutateAsync: mutateDeleteProduk, isPending: isPendingDeleteProduk } =
    useMutation({
      mutationFn: (transactionDetailId: number) =>
        TransactionDetailServices.delete({ transactionDetailId }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["transaction", transactionId],
        });

        handleCloseModalDelete();
      },
      onError: (err) => {
        console.log(err);
      },
    });

  const handleDeleteProduk = async () => {
    try {
      if (idModalDelete) {
        await mutateDeleteProduk(idModalDelete);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    isFromActive,
    handleSetIsFromActive,
    hargaJualController,
    diskonController,
    onSubmit,
    handleSubmit,
    isPendingUpdate,
    isExistDataKebutuhanBarang,
    siapKirim,
    handleToRetur,
    handleDaftarReturBarang,

    isUbahData,
    setIsUbahData,

    handleUbahProduk,

    isPendingTransactionOld,

    isExpired3Days,

    quantityController,

    modalUpdateProdukRef,
    handleShowModalUpdateProduk,
    handleCloseModalUpdateProduk,
    dataModalUpdateProduk,
    idModalUpdateProduk,

    modalDeleteRef,
    handleShowModalDelete,
    handleCloseModalDelete,
    isPendingDeleteProduk,
    handleDeleteProduk,

    dataModalDelete,
  };
};

export default useDaftarDetailProduk;
