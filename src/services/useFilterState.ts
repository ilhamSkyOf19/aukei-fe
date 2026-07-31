import { useState } from "react";
import type { RangeDateState } from "../hooks/useRangeDate";

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
  const [sortQty, setSortQty] = useState<string | undefined>(undefined);

  // sort omzet
  const [sortOmzet, setSortOmzet] = useState<string | undefined>(undefined);

  // sort total transaksi
  const [sortTotalTransaksi, setSortTotalTransaksi] = useState<
    string | undefined
  >(undefined);

  // total nilai transaksi
  const [sortTotalNilaiTransaksi, setSortTotalNilaiTransaksi] = useState<
    string | undefined
  >(undefined);

  // start date end date
  const [startDateEndDate, setStartDateEndDate] = useState<
    RangeDateState | undefined
  >(undefined);

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

  // handle sort total transaksi
  const handleSortTotalTransaksi = (value: string) => {
    setSortTotalTransaksi(value);
    setSortTotalNilaiTransaksi(undefined);
  };

  // handle total nilai transaksi
  const handleTotalNilaiTransaksi = (value: string) => {
    setSortTotalNilaiTransaksi(value);
    setSortTotalTransaksi(undefined);
  };

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
    sortQty,
    sortOmzet,
    handleSortQty,
    handleSortOmzet,
    startDateEndDate,
    setStartDateEndDate,
    handleSortTotalTransaksi,
    handleTotalNilaiTransaksi,
    sortTotalTransaksi,
    sortTotalNilaiTransaksi,
  };
};

export default useFilterState;
