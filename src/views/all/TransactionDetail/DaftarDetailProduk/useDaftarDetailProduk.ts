import { useState } from "react";
import { useController, useForm } from "react-hook-form";
import type { UpdateHargaAndDiskonForRequestType } from "../../../../models/transactionDetail.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionDetailValidations } from "../../../../validations/transactionDetail.validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TransactionDetailServices } from "../../../../services/transactionDetail.service";
import type { ResponseStatistikKebutuhanBarang } from "../../../../models/transaction.model";
import type { ResponseStructure } from "../../../../types/response.type";
import { useLocation, useNavigate } from "react-router-dom";

const useDaftarDetailProduk = (params: {
  transactionId?: number | null;
  dataKebutuhanBarang?: ResponseStructure<
    ResponseStatistikKebutuhanBarang[] | null
  >;
  isLoadingKebutuhanBarang?: boolean;
}) => {
  const { transactionId, dataKebutuhanBarang, isLoadingKebutuhanBarang } =
    params;
  // query client
  const queryClient = useQueryClient();

  // navigate
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  // state is ubah data
  const [isUbahData, setIsUbahData] = useState<boolean>(false);

  // state is active
  const [isFromActive, setIsFromActive] = useState<{
    detailId: number;
    hargaJual: boolean;
    diskon: boolean;
  } | null>(null);

  // get use form
  const { control, handleSubmit, reset } =
    useForm<UpdateHargaAndDiskonForRequestType>({
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

  // mutate
  const { mutateAsync: mutateUpdate, isPending: isPendingUpdate } = useMutation(
    {
      mutationFn: (
        data: UpdateHargaAndDiskonForRequestType & {
          transactionDetailId: number;
        },
      ) =>
        TransactionDetailServices.updateHargaOrDiskon({
          transactionDetailId: data.transactionDetailId,
          req: {
            diskon: data.diskon,
            hargaJual: data.hargaJual,
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
  const onSubmit = async (data: UpdateHargaAndDiskonForRequestType) => {
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
    reset?: boolean;
  }) => {
    if (params.reset) {
      setIsFromActive(null);
      return;
    }

    const { detailId, diskon, hargaJual } = params;

    // reset value
    reset({
      hargaJual: hargaJual?.data ?? undefined,
      diskon: diskon?.data ?? undefined,
    });

    setIsFromActive({
      detailId: detailId ?? 0,
      hargaJual: hargaJual ? true : false,
      diskon: diskon ? true : false,
    });
  };

  const isExistDataKebutuhanBarang: boolean =
    !isLoadingKebutuhanBarang && !!dataKebutuhanBarang?.data?.length;

  const siapKirim = dataKebutuhanBarang?.data?.some(
    (item) => item.siapKirim === true,
  );

  // handle to retur
  const handleToRetur = () => {
    navigate(`${currentPathname}/retur-barang`);
  };

  // handle daftar retur barang
  const handleDaftarReturBarang = () => {
    navigate(`${currentPathname}/daftar-retur-barang`);
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
  };
};

export default useDaftarDetailProduk;
