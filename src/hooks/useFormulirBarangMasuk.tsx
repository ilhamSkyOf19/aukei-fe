import { zodResolver } from "@hookform/resolvers/zod";
import { useController, useForm } from "react-hook-form";
import type {
  CreateBarangMasukForRequestType,
  UpdateBarangMasukForRequestType,
} from "../models/barangMasuk.model";
import { useLocation, useNavigate } from "react-router-dom";
import { BarangMasukValidation } from "../validations/barangMasuk.validation";
import { useMutation } from "@tanstack/react-query";
import { BarangMasukServices } from "../services/barangMasuk.service";
import { useEffect } from "react";
import { getCurrentDateTimeLocal } from "../helpers/helpers";

const useFormulirBarangMasuk = (params: {
  handleCloseModal?: () => void;
  dataUpdate?: {
    id: number;
    tanggalMasuk: string;
    keterangan?: string;
  };
}) => {
  // destructure props
  const { handleCloseModal, dataUpdate } = params;

  // navigate
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  // use form
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
  } = useForm<
    CreateBarangMasukForRequestType | UpdateBarangMasukForRequestType
  >({
    resolver: zodResolver(
      dataUpdate ? BarangMasukValidation.UPDATE : BarangMasukValidation.CREATE,
    ),
  });

  // use controller tanggal masuk
  const useTanggalMasukController = useController({
    name: "tanggalMasuk",
    control,
  });

  // set data update
  useEffect(() => {
    if (dataUpdate) {
      reset(dataUpdate);
    } else {
      reset({
        tanggalMasuk: getCurrentDateTimeLocal(),
      });
    }
  }, [dataUpdate]);

  // use mutiation
  const { mutateAsync: mutateBarangMasuk, isPending: isPendingBarangMasuk } =
    useMutation({
      mutationFn: (
        data: CreateBarangMasukForRequestType | UpdateBarangMasukForRequestType,
      ) => {
        if (dataUpdate) {
          return BarangMasukServices.update({
            id: dataUpdate.id,
            req: data as UpdateBarangMasukForRequestType,
          });
        } else {
          return BarangMasukServices.create(
            data as CreateBarangMasukForRequestType,
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
              toast: "updated_barang_masuk",
            },
          });
        } else {
          navigate(`${currentPathname}/barang-masuk/${data?.data?.id}`, {
            state: {
              toast: "created_barang_masuk",
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
    data: CreateBarangMasukForRequestType | UpdateBarangMasukForRequestType,
  ) => {
    try {
      // call mutation
      await mutateBarangMasuk(data);
    } catch (error) {
      console.log(error);
    }
  };

  // handle close modal with reset
  const handleCloseModalWithReset = () => {
    // reset form
    reset({
      tanggalMasuk: getCurrentDateTimeLocal(),
    });

    // handle close modal
    handleCloseModal?.();
  };

  return {
    register,
    errors,
    handleSubmit,
    onSubmit,
    isPendingBarangMasuk,
    useTanggalMasukController,
    handleCloseModalWithReset,
  };
};

export default useFormulirBarangMasuk;
