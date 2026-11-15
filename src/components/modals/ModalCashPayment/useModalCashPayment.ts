import { useCallback, useState } from "react";

const useModalCashPayment = () => {
  const [payment, setPayment] = useState<{ amount: number; change: number }>({
    amount: 0,
    change: 0,
  });

  const handleSetPayment = useCallback(
    ({ amount, change }: { amount: number; change: number }) => {
      setPayment({ amount, change });
    },
    [],
  );

  return {
    payment,
    handleSetPayment,
  };
};

export default useModalCashPayment;
