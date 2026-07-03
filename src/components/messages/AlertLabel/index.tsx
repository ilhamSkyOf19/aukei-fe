import { AlertCircle } from "lucide-react";
import type { FC } from "react";

type Props = {
  message: string;
};
const AlertLabel: FC<Props> = ({ message }) => {
  return (
    <div className="w-full gap-2.5 flex flex-row justify-start items-center px-4 py-3 rounded-lg bg-blue-600/5 border border-blue-600">
      <AlertCircle className="size-4 text-blue-600" />
      <span className="text-xs">{message}</span>
    </div>
  );
};

export default AlertLabel;
