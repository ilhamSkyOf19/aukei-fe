import { ImageIcon } from "lucide-react";
import type { FieldValues, UseControllerReturn } from "react-hook-form";
import { useEffect, useState } from "react";
import ErrorMessage from "../../messages/ErrorMessage";
import { cn } from "../../../utils/cn";

type Props<T extends FieldValues = any> = {
  label?: string;
  required?: boolean;
  controller: UseControllerReturn<T>;
  name: string;
  resetKey?: number;
  disabled?: boolean;
};

export default function InputImg<T extends FieldValues = any>({
  controller,
  label,
  required = false,
  resetKey,
  disabled = false,
}: Props<T>) {
  const { field, fieldState } = controller;

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!((field.value as unknown) instanceof File)) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(field.value);

    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [field.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      field.onChange(null);
      return;
    }

    field.onChange(file);
  };

  return (
    <div className={"space-y-2 w-full h-full"}>
      {/* Label */}
      {label && (
        <div className="relative">
          <label className="capitalize text-xs lg:text-sm text-base-content">
            {label}
          </label>

          <span className="absolute -top-1 ml-1 text-error">
            {required && "*"}
          </span>
        </div>
      )}

      {/* Upload Area */}
      <label
        htmlFor={`file-input-${resetKey}`}
        className={cn(
          `
          relative flex w-full cursor-pointer
          flex-col items-center justify-center
          overflow-hidden rounded-xl border
          border-dashed transition-all h-full
        `,
          label && "mt-2",
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100"
            : "border-slate-300 bg-base-100 hover:border-custom-primary hover:bg-base-200",
          fieldState.error ? "border-error" : "",
        )}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />

            {!disabled && (
              <div
                className="
                  absolute right-4 top-4
                  rounded-lg bg-primary-white/95
                  px-3 py-2 text-xs font-medium
                  text-slate-700 shadow
                  backdrop-blur
                "
              >
                Ganti Foto
              </div>
            )}
          </>
        ) : (
          <>
            <div
              className="
                mb-4 flex h-16 w-16
                items-center justify-center
                rounded-full bg-custom-secondary
              "
            >
              <ImageIcon className="size-6 text-custom-primary" />
            </div>

            <p className="font-semibold text-sm text-base-content">
              Klik untuk upload gambar
            </p>

            <p className="mt-2 text-xs text-slate-500">
              PNG, JPG, JPEG, WEBP maksimal 3MB
            </p>
          </>
        )}
      </label>

      <input
        key={resetKey}
        id={`file-input-${resetKey}`}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        disabled={disabled}
        className="hidden"
        onChange={handleChange}
      />

      {/* Error */}
      <ErrorMessage errorMessage={fieldState.error?.message} />
    </div>
  );
}
