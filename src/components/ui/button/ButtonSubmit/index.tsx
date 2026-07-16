import type { FC } from "react";

type Props = {
  label?: string;
  disable?: boolean;
  isLoading?: boolean;
  typeButton?: boolean;
  handleClick?: () => void;
};

const ButtonSubmit: FC<Props> = ({
  disable,
  typeButton,
  label,
  isLoading,
  handleClick,
}) => {
  return (
    <button
      type={typeButton ? "button" : "submit"}
      className="h-9.5 md:h-10 text-xs px-4 bg-custom-primary font-semibold text-custom-secondary hover-overlay disabled:opacity-50 rounded-xl shadow-sm"
      disabled={disable || isLoading}
      onClick={() => handleClick?.()}
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
