import type {
  FieldValues,
  SubmitHandler,
  UseFormHandleSubmit,
} from "react-hook-form";
import type { ReactNode } from "react";
import { SendHorizonal, X } from "lucide-react";
import { cn } from "../../../utils/cn";

type CardFormProps<T extends FieldValues> = {
  handleSubmit: UseFormHandleSubmit<T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  handleResetForm: () => void;
  isPending?: boolean;
  btnAksiPosition?: "top";
  flexColoum?: boolean;
  hAuto?: boolean;
  isDirty?: boolean;
  disabled?: boolean;
  showForSm?: boolean;
  customFlex?: string;
};

const CardForm = <T extends FieldValues>({
  children,
  handleResetForm,
  handleSubmit,
  onSubmit,
  isPending,
  btnAksiPosition,
  flexColoum,
  hAuto,
  isDirty,
  disabled,
  showForSm,
  customFlex,
}: CardFormProps<T>) => {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "justify-start",
        customFlex
          ? customFlex
          : flexColoum
            ? "flex-col items-end"
            : "flex-row items-center gap-3",
        showForSm ? "flex" : "hidden sm:flex",
        hAuto ? "h-auto" : "h-14",
      )}
    >
      {children}

      <div
        className={cn(
          "flex h-full justify-start gap-2.5 lg:gap-2",
          btnAksiPosition === "top"
            ? "items-start mb-2 lg:mt-2"
            : "items-end mb-2",
        )}
      >
        <button
          type="button"
          className={cn(
            "text-primary-white btn-sm btn btn-error",
            isPending && "disabled:bg-error disabled:opacity-50",
          )}
          onClick={handleResetForm}
          disabled={isPending || disabled}
        >
          <X className="size-3" />
        </button>

        <button
          type="submit"
          className={cn(
            "text-primary-white btn-sm btn btn-success",
            isPending && "disabled:bg-success",
          )}
          disabled={isPending || disabled || (isDirty ? !isDirty : false)}
        >
          {isPending ? (
            <div className="loading loading-xs" />
          ) : (
            <SendHorizonal className="size-3" />
          )}
        </button>
      </div>
    </form>
  );
};

export default CardForm;
