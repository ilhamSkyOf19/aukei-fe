import { useState } from "react";
import { getDateTicks } from "../../../helpers/helpers";

const dates = getDateTicks("2021-06-01", "2023-06-04");
// transaksi
const dataTransaksi = dates.map((date) => ({
  date: date,
  value: Math.floor(Math.random() * 10000),
}));

const useGrafikBatang = () => {
  // state isChoose grafik
  const [isChoose, setIsChoose] = useState<string>("produk");

  // state data
  const [data, setData] = useState(dataTransaksi);

  // handle set is choose
  const handleSetIsChoose = (value: string) => {
    setIsChoose(value);

    const dataTransaksi = dates.map((date) => ({
      date: date,
      value: Math.floor(Math.random() * 10000),
    }));

    // set data
    setData(dataTransaksi);
  };

  return {
    isChoose,
    handleSetIsChoose,
    data,
  };
};

export default useGrafikBatang;
