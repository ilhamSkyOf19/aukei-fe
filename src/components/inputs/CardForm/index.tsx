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
}: CardFormProps<T>) => {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "hidden lg:flex justify-start gap-3",
        flexColoum ? "flex-col items-end" : "flex-row items-center",
        hAuto ? "h-auto" : "h-14",
      )}
    >
      {children}

      <div
        className={cn(
          "flex h-full justify-start gap-2",
          btnAksiPosition === "top" ? "items-start mt-2" : "items-end mb-2",
        )}
      >
        <button
          type="button"
          className={cn(
            "text-primary-white btn-sm btn btn-error",
            isPending && "disabled:bg-error disabled:opacity-50",
          )}
          onClick={handleResetForm}
          disabled={isPending}
        >
          <X className="size-3" />
        </button>

        <button
          type="submit"
          className={cn(
            "text-primary-white btn-sm btn btn-success",
            isPending && "disabled:bg-success",
          )}
          disabled={isPending || (isDirty ? !isDirty : false)}
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
