import type { FC } from "react";
import { cn } from "../../../utils/cn";

type Props = {
  customHeight?: string;
};
const LoadingFetch: FC<Props> = ({ customHeight }) => {
  return (
    <div
      className={cn(
        "col-span-4 w-full flex flex-col gap-2.5 justify-center items-center",
        customHeight ?? "h-60",
      )}
    >
      <div className="loading loading-md" />
      <span className="text-xs skeleton skeleton-text">Sedang memuat data</span>
    </div>
  );
};

export default LoadingFetch;
