import { Search, X } from "lucide-react";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useSearchParams } from "react-router-dom";

import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";
import type { InputSearchRef } from "../../../types/ref.type";

type Props = {
  handleSearch: (value: string) => void;
  handleOnFocus?: () => void;
  handleClear?: () => void;
  placeholder?: string;
  errorMessage?: string;
  withLabel?: boolean;
  customHeight?: string;
};

const InputSearch = forwardRef<InputSearchRef, Props>(
  (
    {
      handleSearch,
      handleOnFocus,
      handleClear,
      placeholder,
      errorMessage,
      withLabel,
      customHeight,
    },
    ref,
  ) => {
    const [searchParams] = useSearchParams();

    const defaultValueSearch = searchParams.get("search") ?? "";

    const [inputValue, setInputValue] = useState<string>(defaultValueSearch);

    useEffect(() => {
      setInputValue(defaultValueSearch);
    }, [defaultValueSearch]);

    useEffect(() => {
      const timer = setTimeout(() => {
        handleSearch(inputValue);
      }, 500);

      return () => clearTimeout(timer);
    }, [inputValue, handleSearch]);

    const handleReset = () => {
      setInputValue("");
      handleClear?.();
    };

    useImperativeHandle(
      ref,
      () => ({
        handleReset,
      }),
      [],
    );

    return (
      <div
        className={cn(
          "w-full flex flex-col justify-start items-start gap-1.5",
          errorMessage && "mb-3",
        )}
      >
        {withLabel && (
          <span className="text-xs text-base-content/80 font-medium hidden md:block">
            Cari
          </span>
        )}
        <div
          className={cn(
            "w-full flex flex-row justify-start items-center",
            customHeight ? customHeight : "h-10.5 md:h-9",
          )}
        >
          <div
            className={cn(
              "h-full px-2.5 flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-xl w-full focus-within:ring-1 focus-within:ring-custom-secondary focus-within:border-custom-secondary transition-all duration-300 ease-in-out",
              errorMessage && "border-error",
            )}
          >
            <label htmlFor="search">
              <Search className="size-4 md:size-3.5 text-base-content" />
            </label>

            <input
              type="text"
              id="search"
              placeholder={placeholder ?? "Search"}
              className="w-full h-full text-base-content bg-transparent outline-none text-xs placeholder:text-[0.7rem] placeholder:text-base-content/50 placeholder:font-normal lg:text-sm"
              autoComplete="off"
              minLength={1}
              maxLength={100}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={handleOnFocus}
            />

            {inputValue !== "" && (
              <button
                type="button"
                className="h-full rounded-tr-md rounded-br-md flex justify-center items-center"
                onClick={handleReset}
              >
                <X className="size-4 text-base-content" />
              </button>
            )}
          </div>
        </div>
        {/* error message */}
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
      </div>
    );
  },
);

InputSearch.displayName = "InputSearch";

export default InputSearch;
