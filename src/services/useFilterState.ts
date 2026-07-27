import { useState } from "react";

const useFilterState = () => {
  // filter sort
  const [sort, setSort] = useState<string>("desc");

  // filter limit
  const [limit, setLimit] = useState<string>("8");

  // filter page
  const [page, setPage] = useState<string>("1");

  // search
  const [search, setSearch] = useState<string>("");

  // sort qty
  const [sortQty, setSortQty] = useState<string | undefined>("desc");

  // sort omzet
  const [sortOmzet, setSortOmzet] = useState<string | undefined>("desc");

  // handle sort qty
  const handleSortQty = (value: string) => {
    setSortQty(value);
    setSortOmzet(undefined);
  };

  // handle sort omzet
  const handleSortOmzet = (value: string) => {
    setSortOmzet(value);
    setSortQty(undefined);
  };

  // date
  const [startDate, setStartDate] = useState<Date | null>(null);

  const [endDate, setEndDate] = useState<Date | null>(null);

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
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sortQty,
    sortOmzet,
    handleSortQty,
    handleSortOmzet,
  };
};

export default useFilterState;
