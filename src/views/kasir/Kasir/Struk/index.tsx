import type { FC } from "react";
import useStruk from "./useStruk";
import TransactionDetail from "../../../all/TransactionDetail";

type Props = {
  handleSteps: (value: number) => void;
};
const Struk: FC<Props> = ({ handleSteps }) => {
  // call use
  const { transactionId } = useStruk();

  return (
    <TransactionDetail
      handleSteps={handleSteps}
      transactionId={transactionId ?? undefined}
    />
  );
};

export default Struk;
