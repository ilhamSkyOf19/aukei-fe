import { type FC } from "react";
import PaginationAndLimit from "../../../../../components/filters/PaginationAndLimit";
import useShowData from "./useShowData";
import InputSearch from "../../../../../components/inputs/InputSearch";
import FilterSort from "../../../../../components/filters/Sort";
import { Tag } from "lucide-react";
import type { ResponseKategoriProdukType } from "../../../../../models/kategoriProduk.model";
import DataEmpty from "../../../../../components/messages/DataEmpty";

const ShowData = () => {
  // call use
  const {
    dataKategoriProduk,
    handleLimit,
    handlePage,
    handleSearch,
    handleSort,
    isExistDataKategoriProduk,
    isLoadingKategoriProduk,
  } = useShowData();

  return (
    <div className="card flex-2 bg-base-100 flex flex-col justify-start items-start p-4">
      {/* filter */}
      <div className="w-full flex flex-col lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0">
        <div className="w-full  lg:flex-3 flex flex-row justify-start items-center">
          {/* input search */}
          <InputSearch
            handleSearch={handleSearch}
            placeholder="Cari kategori berdasarkan nama"
          />
        </div>

        <div className="w-full flex-wrap lg:flex-2 flex flex-row justify-start lg:justify-end items-center gap-4">
          {/* filter sort */}
          <FilterSort setSort={handleSort} />
        </div>
      </div>

      {/* content */}
      <div className="w-full flex flex-col justify-start items-center gap-4 mt-4">
        {isLoadingKategoriProduk ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-full h-18 skeleton" />
          ))
        ) : isExistDataKategoriProduk ? (
          dataKategoriProduk?.data?.data.map((item) => (
            <CardKategoriProduk key={item.id} data={item} />
          ))
        ) : (
          <DataEmpty
            iconData={Tag}
            title="Data Kategori Produk Tidak Tersedia"
          />
        )}
      </div>

      {/* pagination and limits */}
      <PaginationAndLimit
        currentPage={dataKategoriProduk?.data?.meta.currentPage || null}
        totalPage={dataKategoriProduk?.data?.meta.totalPage || null}
        setPage={handlePage}
        setLimit={handleLimit}
        customPositionPagination="end"
        customWindowSize={3}
        emptyData={!isExistDataKategoriProduk}
      />
    </div>
  );
};

type KategoriProdukProps = {
  data: ResponseKategoriProdukType;
  handleDelete?: (id: number) => Promise<void>;
  handleUpdate?: (id: number) => void;
};

// card kategori produk
const CardKategoriProduk: FC<KategoriProdukProps> = ({
  data,
  handleDelete,
  handleUpdate,
}) => {
  return (
    <div className="w-full flex flex-row justify-start items-center h-18 rounded-md border border-base-content/20 px-4">
      <div className="flex-2 flex flex-row justify-start items-center h-full gap-3">
        <Tag className="size-5 text-base-content" />
        <span className="text-base-content font-semibold text-sm">
          {data.nama}
        </span>
      </div>

      <div className="flex-2 flex flex-col justify-center items-start">
        <span className="text-[0.625rem] font-semibold">Keterangan:</span>
        <span className="text-[0.7rem]">{data.keterangan || "-"}</span>
      </div>

      {/* aksi */}
      <div className="flex-1 flex flex-row justify-end items-center gap-2.5">
        <button
          type="button"
          className="btn btn-xs btn-info text-primary-white"
          onClick={() => handleUpdate?.(data.id)}
        >
          Ubah
        </button>
        <button
          type="button"
          className="btn btn-xs btn-error text-primary-white"
          onClick={() => handleDelete?.(data.id)}
        >
          Hapus
        </button>
      </div>
    </div>
  );
};

export default ShowData;
