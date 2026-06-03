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
      className="btn btn-sm px-4 text-sm bg-custom-primary font-semibold text-custom-secondary hover-overlay disabled:opacity-50"
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
