import { useNavigate } from "react-router-dom";
import useSizeWindows from "../../../hooks/useSizeWindows";

const useStatistikTransaksi = () => {
  // window size
  const windowSize = useSizeWindows();

  // naviagte
  const navigate = useNavigate();
  return {
    windowSize,
    navigate,
  };
};

export default useStatistikTransaksi;
