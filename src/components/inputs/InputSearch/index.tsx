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
};

const InputSearch = forwardRef<InputSearchRef, Props>(
  (
    { handleSearch, handleOnFocus, handleClear, placeholder, errorMessage },
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
          "w-full flex flex-col justify-start items-start",
          errorMessage && "mb-3",
        )}
      >
        <div className="w-full h-10 lg:h-10 flex flex-row justify-start items-center bg-base-100">
          <div
            className={cn(
              "h-full px-3 flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-md w-full focus-within:ring-1 transition-all duration-300 ease-in-out",
              errorMessage && "border-error",
            )}
          >
            <label htmlFor="search">
              <Search className="w-4 h-4 text-base-content" />
            </label>

            <input
              type="text"
              id="search"
              placeholder={placeholder ?? "Search"}
              className="w-full h-full text-base-content bg-transparent outline-none text-xs placeholder:text-xs placeholder:text-base-content/80 placeholder:font-light lg:text-sm"
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
                className="h-full bg-base-100 rounded-tr-md rounded-br-md flex justify-center items-center"
                onClick={handleReset}
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        <ErrorMessage errorMessage={errorMessage} />
      </div>
    );
  },
);

InputSearch.displayName = "InputSearch";

export default InputSearch;
