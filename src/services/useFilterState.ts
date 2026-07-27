import { useState } from "react";

const useFilterState = () => {
  // filter sort
  const [sort, setSort] = useState<string>("desc");

  // filter limit
  const [limit, setLimit] = useState<string>("8");

  // filter page
  const [page, setPage] = useState<string>("1");

  // search
  const [search, setSearch] = useState("");

  // kategori
  const [kategori, setKategori] = useState<string | undefined>(undefined);

  const handleKategori = (value: string) => {
    setKategori(value === "semua" ? undefined : value);
  };

  return {
    sort,
    setSort,
    limit,
    setLimit,
    page,
    setPage,
    search,
    setSearch,
    kategori,
    handleKategori,
  };
};

export default useFilterState;
