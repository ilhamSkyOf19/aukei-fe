import { useState } from "react";
import { getDateTicks } from "../../../helpers/helpers";

// get ticks
const dates = getDateTicks("2021-06-01", "2023-06-04");
const dataRaw = dates.map((date) => ({
  date: date,
  value: Math.floor(Math.random() * 10000000),
}));

const useGrafikLine = () => {
  // state isChoose grafik
  const [isChoose, setIsChoose] = useState<string>("omzet");

  //   state data
  const [data, setData] = useState(dataRaw);

  //   handle set is choose
  const handleSetIsChoose = (value: string) => {
    setIsChoose(value);

    const dataRaw = dates.map((date) => ({
      date: date,
      value: Math.floor(Math.random() * 10000000),
    }));

    setData(dataRaw);
  };

  return {
    isChoose,
    handleSetIsChoose,
    data,
  };
};

export default useGrafikLine;
