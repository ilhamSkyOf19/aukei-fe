import { useEffect, useState, type FC } from "react";

type Props = {
  expiredAt: Date;
};
const CountDown: FC<Props> = ({ expiredAt }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(
        0,
        Math.floor((expiredAt.getTime() - Date.now()) / 1000),
      );

      setTimeLeft(diff);

      if (diff <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiredAt]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <span className="countdown font-mono text-sm">
      <span
        style={{ "--value": minutes } as React.CSSProperties}
        aria-label={`${minutes} minutes`}
      >
        {minutes}
      </span>
      :
      <span
        style={
          {
            "--value": seconds,
            "--digits": 2,
          } as React.CSSProperties
        }
        aria-label={`${seconds} seconds`}
      >
        {seconds}
      </span>
    </span>
  );
};

export default CountDown;
