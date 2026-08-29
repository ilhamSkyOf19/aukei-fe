import { zodResolver } from "@hookform/resolvers/zod";
import { useController, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import type { CreateStockOpnameForRequestType } from "../../../models/stockOpname.model";
import { StockOpnameValidation } from "../../../validations/stockOpname.validation";
import { getCurrentDateTimeLocal } from "../../../helpers/helpers";
import { StockOpnameServices } from "../../../services/stockOpname.service";

const useFormulirStockOpname = (params: { handleCloseModal?: () => void }) => {
  // destructure props
  const { handleCloseModal } = params;

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
  } = useForm<CreateStockOpnameForRequestType>({
    resolver: zodResolver(StockOpnameValidation.CREATE),
  });

  // controller tanggal opname
  const useTanggalOpnameController = useController({
    name: "tanggalOpname",
    control,
  });

  // set default value
  useEffect(() => {
    reset({
      tanggalOpname: getCurrentDateTimeLocal(),
    });
  }, []);

  // mutation
  const { mutateAsync: mutateStockOpname, isPending: isPendingStockOpname } =
    useMutation({
      mutationFn: (data: CreateStockOpnameForRequestType) =>
        StockOpnameServices.create(data),

      onSuccess: (data) => {
        // reset form
        reset();

        // close modal
        handleCloseModal?.();

        // redirect detail
        navigate(`${currentPathname}/${data?.data?.id}`, {
          state: {
            toast: "created_stock_opname",
          },
        });
      },

      onError: (err) => {
        console.log(err);
      },
    });

  // on submit
  const onSubmit = async (data: CreateStockOpnameForRequestType) => {
    try {
      await mutateStockOpname(data);
    } catch (error) {
      console.log(error);
    }
  };

  // handle close modal with reset
  const handleCloseModalWithReset = () => {
    // reset form
    reset({
      tanggalOpname: getCurrentDateTimeLocal(),
    });

    // handle close modal
    handleCloseModal?.();
  };

  return {
    register,
    errors,
    handleSubmit,
    onSubmit,

    isPendingStockOpname,

    useTanggalOpnameController,

    handleCloseModalWithReset,
  };
};

export default useFormulirStockOpname;
