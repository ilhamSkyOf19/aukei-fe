import type { FC } from "react";
import useStruk from "./useStruk";
import TransactionDetail from "../../../all/TransactionDetail";

const Struk = () => {
  // call use
  const { transactionId } = useStruk();

  return <TransactionDetail transactionId={transactionId ?? undefined} />;
};

export default Struk;
