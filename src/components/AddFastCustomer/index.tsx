import { type FC } from "react";
import { useForm, useWatch } from "react-hook-form";
import { TransactionValidation } from "../../validations/transaction.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TransactionServices } from "../../services/transaction.service";
import InputTextFloating from "../inputs/InputTextFloating";
import ButtonWithIcon from "../ui/button/ButtonWithIcon";
import { Check } from "lucide-react";

type Props = {
  pelangganId?: number;
  transactionId: number;
  handleSetFormActive: () => void;
};

const AddFastCustomer: FC<Props> = ({
  pelangganId,
  transactionId,
  handleSetFormActive,
}) => {
  const { register, handleSubmit, control } = useForm<{ nama: string }>({
    resolver: zodResolver(TransactionValidation.NAMA),
  });

  const queryClient = useQueryClient();

  //   mutate
  const {
    mutateAsync: mutateFastCreateCustomer,
    isPending: isPendingFastCreateCustomer,
  } = useMutation({
    mutationFn: (data: {
      pelangganId?: number;
      nama: string;
      transactionId: number;
    }) => TransactionServices.fastCreateCustomer(data),
    onSuccess: async () => {
      handleSetFormActive();

      await queryClient.invalidateQueries({ queryKey: ["transaksi-draft"] });

      await queryClient.invalidateQueries({ queryKey: ["pelanggan"] });
    },
    onError: (err) => console.log(err),
  });

  // watch
  const namaWatch = useWatch({
    control,
    name: "nama",
  });

  //   on submit
  const handleOnSubmit = async (data: { nama: string }) => {
    try {
      await mutateFastCreateCustomer({
        nama: data.nama,
        pelangganId,
        transactionId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="flex flex-row justify-center items-center gap-2.5"
      >
        <div className="w-28">
          <InputTextFloating
            register={register("nama")}
            label="Pelanggan"
            name="nama"
          />
        </div>

        <ButtonWithIcon
          typeButton="submit"
          noLabel
          icon={Check}
          disabled={namaWatch === "" || namaWatch === undefined}
          bgColor="bg-emerald-500"
          textColor="text-primary-white"
          isLoading={isPendingFastCreateCustomer}
        />
      </form>
    </>
  );
};

export default AddFastCustomer;
