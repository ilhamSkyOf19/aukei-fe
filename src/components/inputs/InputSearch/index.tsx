import { Search, X } from "lucide-react";
import { useEffect, useState, type FC } from "react";
import { useSearchParams } from "react-router-dom";

type Props = {
  handleSearch: (value: string) => void;
  placeholder?: string;
};

const InputSearch: FC<Props> = ({ handleSearch, placeholder }) => {
  const [searchParams] = useSearchParams();
  const defaultValueSearch = searchParams.get("search") ?? "";

  const [inputValue, setInputValue] = useState<string>(defaultValueSearch);

  useEffect(() => {
    if (defaultValueSearch) {
      setInputValue(defaultValueSearch);
    }
  }, [defaultValueSearch]);

  //   use debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(inputValue);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  return (
    <div className="w-full h-10 lg:h-10 flex flex-row justify-start items-center bg-base-100">
      <div className="h-full px-3 flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-tl-md rounded-md w-full focus-within:ring-1 transition-all duration-300 ease-in-out">
        <label htmlFor={"name"}>
          <Search className="w-4 h-4 text-base-content" />
        </label>

        <input
          type="text"
          id={"name"}
          placeholder={placeholder || "Search"}
          className="w-full h-full text-base-content bg-transparent outline-none text-xs placeholder:text-xs placeholder:text-base-content/80 placeholder:font-light lg:text-sm"
          autoComplete="off"
          minLength={1}
          maxLength={100}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        {inputValue !== "" && (
          <button
            type="button"
            className="h-full bg-base-100 rounded-tr-md rounded-br-md flex justify-center items-center"
            onClick={() => {
              setInputValue("");
            }}
          >
            <span className="text-xs lg:text-sm text-base-content">
              <X className="size-4" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default InputSearch;
