import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FC } from "react";
import { TransactionServices } from "../../../../../services/transaction.service";
import {
  formatRupiah,
  unformatNumber,
  unformatRupiah,
} from "../../../../../helpers/helpers";
import { CircleCheckIcon } from "lucide-react";
import ButtonWithIcon from "../../../../../components/ui/button/ButtonWithIcon";

type Props = {
  transactionId: number;
};
const FormOngkir: FC<Props> = ({ transactionId }) => {
  const [displayValue, setDisplayValue] = useState<string>("");

  //   query client
  const queryClient = useQueryClient();

  //   use mutation ongkir
  const { mutateAsync: mutateOngkir, isPending: isPendingOngkir } = useMutation(
    {
      mutationFn: (data: { ongkir: number }) =>
        TransactionServices.updateOngkir({ transactionId, data }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["transaksi-draft"] });

        // reset
        setDisplayValue("");
      },

      onError: (err) => {
        console.log(err);
      },
    },
  );

  const handleSimpanOngkir = async () => {
    try {
      await mutateOngkir({ ongkir: Number(unformatNumber(displayValue)) });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-2.5 flex-row justify-between items-center w-full">
      <div className="flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-xl w-full focus-within:ring-1 focus-within:ring-base-content focus-within:border-base-content transition-all duration-300 ease-in-out bg-base-100 h-12 px-3">
        <input
          type="text"
          inputMode="numeric"
          className="w-full font-semibold text-base-content h-full border-none outline-none placeholder:text-base-content/50 placeholder:font-light text-sm"
          placeholder="Contoh: Rp 10.0000"
          value={displayValue}
          onChange={(e) => {
            const raw = unformatRupiah(e.target.value);

            setDisplayValue(formatRupiah(raw));
          }}
        />
      </div>

      {/* button check list */}
      <ButtonWithIcon
        bgColor="bg-success"
        icon={CircleCheckIcon}
        noLabel
        textColor="text-primary-white"
        customHeight="h-full"
        customWidth="w-14"
        customIconSize="size-5.5"
        isLoading={isPendingOngkir}
        handleBtn={() => handleSimpanOngkir()}
      />
    </div>
  );
};

export default FormOngkir;
