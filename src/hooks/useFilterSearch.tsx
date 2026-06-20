import { useState } from "react";
import { useSearchParams } from "react-router-dom";

type FilterSearchReturn = {
  search: string;
  setSearch: (val: string) => void;
};

export const useFilterSearch = (
  searchParamName: string,
  pageParamName: string = "page",
  useUrlState: boolean = true,
): FilterSearchReturn => {
  const [searchParams, setSearchParams] = useSearchParams();

  // state lokal jika useUrlState = false
  const [localSearch, setLocalSearch] = useState("");

  // ambil search sesuai mode
  const search = useUrlState
    ? (searchParams.get(searchParamName) ?? "").toLowerCase()
    : localSearch;

  const setSearch = (val: string) => {
    const valLower = val.toLowerCase();

    if (!useUrlState) {
      // gunakan state lokal, tidak sentuh URL
      setLocalSearch(valLower === "semua" ? "" : valLower);
      return;
    }

    const currentSearch = (
      searchParams.get(searchParamName) ?? ""
    ).toLowerCase();

    // tidak perlu update URL jika nilai sama
    if (currentSearch === valLower) {
      return;
    }

    // mode URL (behavior lama)
    const params = new URLSearchParams(searchParams);
    params.set(pageParamName, "1");

    if (valLower === "semua" || valLower === "") {
      params.delete(searchParamName);
    } else {
      params.set(searchParamName, valLower);
    }

    setSearchParams(params.toString());
  };

  return { search, setSearch };
};
