import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useModal from "../../../../hooks/useModal";
import { BarangMasukDetailServices } from "../../../../services/barangMasukDetail.service";
import { useLocation, useNavigate } from "react-router-dom";
import {
  STATUS_INVENTORI_TYPE,
  type StatusInventoriType,
} from "../../../../types/constant.type";
import type { UpdateBarangMasukDetailType } from "../../../../models/barangMasukDetail.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useController, useForm } from "react-hook-form";
import { BarangMasukDetailValidation } from "../../../../validations/barangMasukDetail.validation";
import { useImperativeHandle, useState, type ForwardedRef } from "react";
import axios from "axios";
import type { ErrorResponse } from "../../../../types/response.type";
import type { ChildRef } from "../../../../types/ref.type";
import { useFilter } from "../../../../hooks/useFilter";
import { useFilterSearch } from "../../../../hooks/useFilterSearch";

const useShowBarangMasuk = (params: {
  status?: StatusInventoriType;
  barangMasukId?: number | null;
  ref: ForwardedRef<ChildRef>;
}) => {
  const { status, barangMasukId, ref } = params;

  // query client
  const queryClient = useQueryClient();

  // navigate
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  const { filter: sort, setFilter: handleSort } = useFilter({
    paramName: "sort",
    allowQuery: ["asc", "desc"],
    defaultValueCustom: "asc",
  });

  const { filter: page, setFilter: handlePage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // Filter jumlah data per halaman (query param "limit")
  const { filter: limit, setFilter: handleLimit } = useFilter({
    paramName: "limit",
    isNumber: true,
  });

  const { search, setSearch: handleSearch } = useFilterSearch("search");

  // use modal
  const {
    modalRef: modalDeleteRef,
    handleCloseModal: handleCloseModalDelete,
    handleShowModal: handleShowModalDelete,
    idModal: idDelete,
    dataModal: dataDelete,
  } = useModal<{ nama: string }>();

  // use modal Ubah produk
  const {
    modalRef: modalUbahProdukRef,
    handleCloseModal: handleCloseModalUbahProduk,
    handleShowModal: handleShowModalUbahProduk,
    idModal: idBarangMasuk,
    dataModal: dataUpdateBarangMasuk,
  } = useModal<{
    produk: {
      id: number;
      nama: string;
      img: string;
      stok: number;
      hargaModalRataRata: number;
    };
    jumlahBox: number;
    jumlahStok: number;
    hargaBeli: number;
  }>();

  const invalidatedQueries = () => {
    Promise.allSettled([
      queryClient.invalidateQueries({ queryKey: ["barang-masuk-detail"] }),
      queryClient.invalidateQueries({ queryKey: ["daftar-barang-masuk"] }),
    ]);
  };

  const {
    data: daftarBarangMasukDetail,
    refetch: refetchBarangMasukDetail,
    isFetching: isFetchingBarangMasukDetail,
  } = useQuery({
    queryKey: [
      "daftar-barang-masuk",
      barangMasukId,
      { sort, page, limit, search },
    ],
    queryFn: () =>
      BarangMasukDetailServices.findByBarangMasukId({
        barangMasukId: barangMasukId!,
        query: {
          ...(sort && { sort }),
          ...(page && { page }),
          ...(limit && { limit }),
          ...(search && { search }),
        },
      }),
    enabled: !!barangMasukId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const handleRefresh = async () => {
    await refetchBarangMasukDetail({
      throwOnError: true,
    });
  };

  useImperativeHandle(ref, () => ({
    refetchActive: handleRefresh,
  }));

  //   use mutation
  const { mutateAsync: mutateDelete, isPending: isPendingDelete } = useMutation(
    {
      mutationFn: (data: { id: number; status: StatusInventoriType }) =>
        BarangMasukDetailServices.delete(data),
      onSuccess: () => {
        // invalidate
        invalidatedQueries();

        // set toast
        navigate(currentPathname, {
          state: {
            toast: "deleted_barang_masuk_detail",
          },
        });

        // handle close
        handleCloseModalDelete();
      },
      onError: (err) => {
        console.log(err);
        handleCloseModalDelete();
      },
    },
  );

  //   handle delete
  const handleDelete = async () => {
    try {
      if (!idDelete || !status) return;

      await mutateDelete({
        id: idDelete,
        status,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // state data update
  const [dataUpdate, setDataUpdate] = useState<
    | (UpdateBarangMasukDetailType & {
        id: number;
        isActive: "hargaBeli" | "jumlahBox" | "jumlahStok";
      })
    | null
  >(null);

  // update data
  const {
    control,
    setValue,
    formState: { isDirty },
    reset,
    handleSubmit,
    setError,
  } = useForm<UpdateBarangMasukDetailType>({
    resolver: zodResolver(BarangMasukDetailValidation.UPDATE),
  });

  // jumlah box controller
  const jumlahBoxController = useController({
    control,
    name: "jumlahBox",
  });

  // jumlah stok controller
  const jumlahStokController = useController({
    control,
    name: "jumlahStok",
  });

  // harga beli controller
  const hargaBeliController = useController({
    control,
    name: "hargaBeli",
  });

  // handle set is data update
  const handleSetDataUpdate = (params: {
    data: (UpdateBarangMasukDetailType & { id: number }) | null;
  }) => {
    const { data } = params;

    // set state
    if (data) {
      if (data.hargaBeli) {
        // Update harga beli saja
        setDataUpdate({
          id: data.id,
          produkId: data.produkId,
          hargaBeli: data.hargaBeli,
          jumlahBox: undefined,
          jumlahStok: undefined,
          isActive: "hargaBeli",
        });

        setValue("hargaBeli", data.hargaBeli);
        setValue("jumlahBox", undefined);
        setValue("jumlahStok", undefined);
      } else if (data.jumlahStok !== undefined) {
        // Update jumlah stok saja
        setDataUpdate({
          id: data.id,
          produkId: data.produkId,
          hargaBeli: undefined,
          jumlahBox: undefined,
          jumlahStok: data.jumlahStok,
          isActive: "jumlahStok",
        });

        setValue("hargaBeli", undefined);
        setValue("jumlahBox", undefined);
        setValue("jumlahStok", data.jumlahStok);
      } else {
        // Update jumlah box saja
        setDataUpdate({
          id: data.id,
          produkId: data.produkId,
          jumlahBox: data.jumlahBox,
          jumlahStok: undefined,
          hargaBeli: undefined,
          isActive: "jumlahBox",
        });

        setValue("jumlahBox", data.jumlahBox);
        setValue("jumlahStok", undefined);
        setValue("hargaBeli", undefined);
      }

      // set value
      setValue("produkId", data.produkId);
    }
  };

  // handle clear form
  const handleClearDataUpdate = () => {
    reset();
    setDataUpdate(null);
  };

  // mutation
  const { mutateAsync: mutateUpdate, isPending: isPendingUpdate } = useMutation(
    {
      mutationFn: (
        data: UpdateBarangMasukDetailType & {
          id: number;
          status: StatusInventoriType;
        },
      ) =>
        BarangMasukDetailServices.update({
          id: data.id,
          req: {
            produkId: data.produkId,
            jumlahBox: data.jumlahBox,
            hargaBeli: data.hargaBeli,
            jumlahStok: data.jumlahStok,
          },
          status: data.status,
        }),
      onSuccess: () => {
        // invalidate
        invalidatedQueries();

        // set toast
        navigate(currentPathname, {
          state: {
            toast: "updated_barang_masuk_detail",
          },
        });

        // set data update
        setDataUpdate(null);

        // reset
        reset();
      },
      onError: (err) => {
        if (axios.isAxiosError<ErrorResponse>(err)) {
          if (
            err?.response?.data?.meta?.customField?.includes("same_jumlah_box")
          ) {
            setError("jumlahBox", {
              message: "Jumlah Box tidak boleh sama dengan sebelumnya",
            });
          }
        }
      },
    },
  );

  // handle update
  const onSubmit = async (data: UpdateBarangMasukDetailType) => {
    try {
      if (!dataUpdate || !data || !status) return;

      await mutateUpdate({
        jumlahBox: data.jumlahBox,
        hargaBeli: data.hargaBeli,
        jumlahStok: data.jumlahStok,
        id: dataUpdate.id,
        status,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // status
  const isStatusPosted = status === STATUS_INVENTORI_TYPE.POSTED;

  const isExistData =
    daftarBarangMasukDetail?.data &&
    daftarBarangMasukDetail?.data?.detailBarangMasuks?.length > 0
      ? true
      : false;

  return {
    handleShowModalDelete,
    handleCloseModalDelete,
    modalDeleteRef,
    isPendingDelete,
    handleDelete,
    dataDelete,
    handleSetDataUpdate,
    dataUpdate,
    handleClearDataUpdate,
    handleSubmit,
    onSubmit,
    isPendingUpdate,
    isStatusPosted,
    isDirty,
    jumlahBoxController,
    modalUbahProdukRef,
    handleCloseModalUbahProduk,
    handleShowModalUbahProduk,
    idBarangMasuk,
    dataUpdateBarangMasuk,
    hargaBeliController,
    jumlahStokController,

    daftarBarangMasukDetail,
    isLoadingBarangMasukDetail: isFetchingBarangMasukDetail,

    handleSearch,
    handleLimit,
    handlePage,
    handleSort,
    sort,
    isExistData,
  };
};

export default useShowBarangMasuk;
