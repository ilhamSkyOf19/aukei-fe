import { zodResolver } from "@hookform/resolvers/zod";
import { useController, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getCurrentDateTimeLocal } from "../helpers/helpers";
import type {
  CreateBarangKeluarForRequestType,
  UpdateBarangKeluarForRequestType,
} from "../models/barangKeluar.model";
import { BarangKeluarValidation } from "../validations/barangKeluar.validation";
import { BarangKeluarServices } from "../services/barangKeluar.service";
import { useLocation, useNavigate } from "react-router-dom";
import { JenisKeluarServices } from "../services/jenisKeluar.service";

const useFormulirBarangKeluar = (params: {
  handleCloseModal?: () => void;
  dataUpdate?: {
    id: number;
    tanggalKeluar: string;
    jenisKeluarId: number;
    keterangan?: string;
  };
}) => {
  // destructure props
  const { handleCloseModal, dataUpdate } = params;

  // navigate
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  // use query
  const { data: dataJenisKeluarForChoose, isLoading: isLoadingJenisKeluar } =
    useQuery({
      queryKey: ["jenis-keluar"],
      queryFn: () => JenisKeluarServices.findAll(),
      retry: false,
      refetchOnWindowFocus: false,
    });

  // use form
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
    setError,
  } = useForm<
    CreateBarangKeluarForRequestType | UpdateBarangKeluarForRequestType
  >({
    resolver: zodResolver(
      dataUpdate
        ? BarangKeluarValidation.UPDATE
        : BarangKeluarValidation.CREATE,
    ),
  });

  // use controller tanggal keluar
  const useTanggalKeluarController = useController({
    name: "tanggalKeluar",
    control,
  });

  // use controller jenis keluar
  const useJenisKeluarController = useController({
    name: "jenisKeluarId",
    control,
  });

  // set data update
  useEffect(() => {
    if (dataUpdate) {
      reset(dataUpdate);
    } else {
      reset({
        tanggalKeluar: getCurrentDateTimeLocal(),
      });
    }
  }, [dataUpdate]);

  // use mutiation
  const { mutateAsync: mutateBarangKeluar, isPending: isPendingBarangKeluar } =
    useMutation({
      mutationFn: (
        data:
          | CreateBarangKeluarForRequestType
          | UpdateBarangKeluarForRequestType,
      ) => {
        if (dataUpdate) {
          return BarangKeluarServices.update({
            id: dataUpdate.id,
            req: data as UpdateBarangKeluarForRequestType,
          });
        } else {
          return BarangKeluarServices.create(
            data as CreateBarangKeluarForRequestType,
          );
        }
      },
      onSuccess: (data) => {
        // reset form
        reset();

        // handle close modal
        handleCloseModal?.();

        // set toast
        if (dataUpdate) {
          navigate(currentPathname, {
            state: {
              toast: "updated_barang_keluar",
            },
          });
        } else {
          navigate(`${currentPathname}/barang-keluar/${data?.data?.id}`, {
            state: {
              toast: "created_barang_keluar",
            },
          });
        }
      },
      onError: (err) => {
        console.log(err);
      },
    });

  // on submit
  const onSubmit = async (
    data: CreateBarangKeluarForRequestType | UpdateBarangKeluarForRequestType,
  ) => {
    try {
      // check jenis keluar
      if (data.jenisKeluarId) {
        // check jenis keluar
        const jenisKeluar = dataJenisKeluarForChoose?.data?.find(
          (item) => item.id === data.jenisKeluarId,
        );

        if (!jenisKeluar) {
          return setError("jenisKeluarId", {
            message: "Jenis keluar tidak ditemukan",
          });
        }
      }

      // call mutation
      await mutateBarangKeluar(data);
    } catch (error) {
      console.log(error);
    }
  };

  // handle close modal with reset
  const handleCloseModalWithReset = () => {
    // reset form
    reset({
      tanggalKeluar: getCurrentDateTimeLocal(),
    });

    // handle close modal
    handleCloseModal?.();
  };

  return {
    register,
    errors,
    handleSubmit,
    onSubmit,
    isPendingBarangKeluar,
    useTanggalKeluarController,
    handleCloseModalWithReset,
    useJenisKeluarController,
    isLoadingJenisKeluar,
    dataJenisKeluarForChoose,
  };
};

export default useFormulirBarangKeluar;
