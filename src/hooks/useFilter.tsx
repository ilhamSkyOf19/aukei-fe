import { useSearchParams } from "react-router-dom";

type FilterTypeReturn = {
  filter: string;
  setFilter: (val: string) => void;
};

export const useFilter = (params: {
  paramName: string;
  allowQuery?: string[];
  isNumber?: boolean;
  resetPage?: boolean;
  defaultValueCustom?: string;
}): FilterTypeReturn => {
  const { paramName, allowQuery, isNumber, resetPage, defaultValueCustom } =
    params;

  const [searchParams, setSearchParams] = useSearchParams();

  const rawFilter = (searchParams.get(paramName) ?? "").toLowerCase();

  const isWhitelistActive = !!allowQuery?.length;

  let defaultValue = "";

  switch (paramName) {
    case "sort":
      defaultValue = defaultValueCustom ?? "desc";
      break;
    case "limit":
      defaultValue = "8";
      break;
    case "page":
      defaultValue = "1";
      break;
  }

  const isInvalidNumber =
    isNumber && rawFilter !== "" && isNaN(Number(rawFilter));

  const filter = isInvalidNumber
    ? defaultValue
    : isWhitelistActive
      ? allowQuery.includes(rawFilter)
        ? rawFilter
        : defaultValue
      : rawFilter || defaultValue;

  const setFilter = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    const valLower = val.toLowerCase();

    if (isWhitelistActive && !allowQuery.includes(valLower)) return;

    if (resetPage) {
      newParams.set("page", "1");
    }

    if (paramName === "limit") {
      newParams.set("page", "1");
    }

    if (valLower === "semua" || valLower === "") {
      newParams.delete(paramName);
    } else {
      newParams.set(paramName, valLower);
    }

    setSearchParams(newParams);
  };

  return { filter, setFilter };
};
