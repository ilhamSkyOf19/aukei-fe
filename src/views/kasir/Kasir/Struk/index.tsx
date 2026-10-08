import useStruk from "./useStruk";
import TransactionDetail from "../../../all/TransactionDetail";
import type { FC } from "react";

type Props = {
  handleSetToast?: (value: string) => void;
};
const Struk: FC<Props> = ({ handleSetToast }) => {
  // call use
  const { transactionId } = useStruk();

  return (
    <TransactionDetail
      transactionId={transactionId ?? undefined}
      handleSetToast={handleSetToast}
    />
  );
};

export default Struk;
