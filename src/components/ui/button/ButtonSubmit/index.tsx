import type { FC } from "react";

type Props = {
  label?: string;
  disable?: boolean;
  isLoading?: boolean;
};

const ButtonSubmit: FC<Props> = ({ disable, label, isLoading }) => {
  return (
    <button
      type="submit"
      className="h-9 px-4 text-sm bg-custom-primary font-semibold text-custom-secondary rounded-md disabled:opacity-50"
      disabled={disable || isLoading}
    >
      {isLoading ? (
        <div className="loading loading-xs" />
      ) : (
        <span>{label || "Simpan"}</span>
      )}
    </button>
  );
};

export default ButtonSubmit;
