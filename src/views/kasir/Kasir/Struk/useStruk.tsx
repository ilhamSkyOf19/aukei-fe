const useStruk = () => {
  // get local storage
  const transaction = localStorage.getItem("transaction");
  const transactionId: number | null = transaction
    ? JSON.parse(transaction).transactionId
    : null;

  return {
    transactionId,
  };
};

export default useStruk;
