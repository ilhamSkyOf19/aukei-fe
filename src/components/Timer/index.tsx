import { useEffect, useState, type FC } from "react";
import { formatTime } from "../../helpers/formatDate";

type Props = {
  expiredAt?: string;
  onFinished: () => void;
  isDisabled?: boolean;
};

const TimeComponent: FC<Props> = ({ onFinished, expiredAt }) => {
  const calculateRemaining = () => {
    const target = new Date(expiredAt ?? new Date()).getTime();

    return Math.max(target - Date.now(), 0);
  };

  const [remaining, setRemaining] = useState<number>(calculateRemaining);

  useEffect(() => {
    setRemaining(calculateRemaining()); // reset saat trigger berubah

    const interval = setInterval(() => {
      setRemaining(calculateRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [expiredAt]);

  useEffect(() => {
    if (remaining <= 0) {
      onFinished();
    }
  }, [remaining, onFinished]);

  return (
    <p className="text-base-content font-semibold">
      {expiredAt ? formatTime(remaining) : "-"}
    </p>
  );
};

export default TimeComponent;
