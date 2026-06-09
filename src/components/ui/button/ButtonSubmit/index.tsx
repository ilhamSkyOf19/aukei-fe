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
      className="btn text-xs lg:text-sm btn-sm lg:btn-md px-4 bg-custom-primary font-semibold text-custom-secondary hover-overlay disabled:opacity-50"
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
