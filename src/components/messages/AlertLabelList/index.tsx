import { AlertCircle } from "lucide-react";
import type { FC } from "react";

type Props = {
  message: string[];
};
const AlertLabelList: FC<Props> = ({ message }) => {
  return (
    <div className="w-full gap-2.5 flex flex-col justify-start items-start px-4 py-3 rounded-2xl md:rounded-xl bg-blue-600/5 border border-blue-600">
      <div className="flex flex-row justify-start items-center gap-2">
        <AlertCircle className="md:size-6 lg:size-4 shrink-0 text-blue-600" />
        <span className="text-base font-medium text-base-content">Panduan</span>
      </div>
      <ul className="list-disc ml-4 space-y-1.5">
        {message.map((item, index) => (
          <li key={index} className="text-xs text-base-content">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertLabelList;
