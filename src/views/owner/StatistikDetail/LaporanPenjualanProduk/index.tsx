import { Fragment, type FC } from "react";
import { cn } from "../../../../utils/cn";
import { formatNumber, formatRupiah } from "../../../../helpers/helpers";
import {
  ArrowRight,
  Banknote,
  Calculator,
  ChartLine,
  Package,
  Wallet,
} from "lucide-react";

import CardStatistik from "../../../../components/ui/cards/CardStatistik";
import ButtonDetailTable from "../../../../components/ui/button/ButtonDetailTable";
import DataEmpty from "../../../../components/messages/DataEmpty";
import ButtonRefresh from "../../../../components/ui/button/ButtonRefresh";
import ButtonBackText from "../../../../components/ui/button/ButtonBackText";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import useLaporanPenjualanProduk from "./laporanPenjualanProduk";
import FilterSort from "../../../../components/filters/Sort";
import RangeDate from "../../../../components/filters/RangeDate";
import ModalHitungPendapatanProduk from "../../../../components/modals/ModalHitungPendapatanProduk";

const LaporanPenjualanProduk: FC = () => {
  const {
    handleRefresh,
    statistik,

    handleBack,
    setKategori,
    kategori,

    dataPenjualanProduk,

    isLoadingLaporanProduk,
    isRefetchingLaporanPenjualanProduk,
    setStartDateEndDate,
    sortLaba,
    sortOmzet,
    sortQty,
    startDateEndDate,
    handleSortLaba,
    handleSortOmzet,
    handleSortQty,

    dataPenjualanProdukByKategori,
    isLoadingPenjualanProdukByKategori,
    isRefetchingPenjualanProdukByKategori,

    handlePilihProduk,
    handlePilihSemuaProduk,
    selectedProducts,

    handleCloseModalHitungPendapatanProduk,
    handleShowModalHitungPendapatanProduk,
    modalHitungPendapatanProdukRef,
  } = useLaporanPenjualanProduk();

  const isLoadingLaporanGlobal =
    isLoadingLaporanProduk || isRefetchingLaporanPenjualanProduk;

  const isLoadingLaporanByKategori =
    isLoadingPenjualanProdukByKategori || isRefetchingPenjualanProdukByKategori;

  return (
    <div className="w-full flex flex-col justify-start items-start">
      {/* back */}
      {kategori.id !== 0 && (
        <div className="flex flex-row justify-start items-start mb-2.5">
          <ButtonBackText label="Kembali" handleClick={() => handleBack()} />
        </div>
      )}

      {/* filter */}
      <div className="w-full flex flex-col md:flex-row justify-start items-start md:justify-between md:items-end bg-base-100 p-2.5 rounded-2xl md:rounded-xl shadow-sm border border-transparent dark:border-base-content/10 gap-2.5 mb-2.5">
        <div className="w-full md:flex-wrap md:flex-2 flex flex-col md:flex-row flex-start justify-start items-center md:justify-start gap-3 md:gap-2.5 mt-3 md:mt-0">
          {/* filter range date */}
          <RangeDate
            state={{
              value: startDateEndDate,
              onChange: setStartDateEndDate,
            }}
            customWidth="w-full md:w-80"
          />

          <div className="w-full md:w-auto flex flex-row justify-start items-start gap-2.5">
            {/* filter sort omzet */}
            <FilterSort
              setSort={handleSortQty}
              customWidth="w-full md:w-30"
              value={sortQty}
              customLabel={["Tersedikit", "Terbanyak"]}
              customTitle="Urutkan Qty"
            />

            {/* filter sort omzet */}
            <FilterSort
              setSort={handleSortOmzet}
              customWidth="w-full md:w-30"
              value={sortOmzet}
              customLabel={["Tersedikit", "Terbanyak"]}
              customTitle="Urutkan Omzet"
            />
          </div>

          <div className="w-full md:w-auto flex flex-row justify-start items-end gap-2.5">
            {/* filter sort laba */}
            <FilterSort
              setSort={handleSortLaba}
              customWidth="w-full md:w-30"
              value={sortLaba}
              customLabel={["Tersedikit", "Terbanyak"]}
              customTitle="Urutkan Laba"
            />

            {/* button refresh */}
            <ButtonRefresh
              handleRefresh={async () => {
                await handleRefresh();
              }}
              classHidden="flex md:hidden"
            />
          </div>
        </div>
        {/* button refresh */}
        <ButtonRefresh
          handleRefresh={async () => {
            await handleRefresh();
          }}
        />
      </div>

      {/* header */}
      <div className="w-full flex flex-col justify-start items-start bg-base-100 p-2.5 rounded-2xl md:rounded-xl shadow-sm border border-transparent dark:border-base-content/10 gap-2.5">
        {/* title */}
        <div className="w-full flex flex-row justify-between items-start">
          <div className="w-full gap-0.5 flex flex-col justify-start items-start">
            <span className="text-sm font-medium text-base-content">
              {kategori.id !== 0
                ? kategori.nama
                : "Laporan Sisa Stok dan Modal"}
            </span>

            <span className="text-[0.7rem] w-[70%] text-base-content/70">
              Informasi Laporan Sisa Stok dan Modal{" "}
              {kategori.id !== 0 && `Berdasarkan kategori ${kategori.nama}`}
            </span>
          </div>

          {/* button hitung */}
          {kategori.id !== 0 && (
            <ButtonWithIcon
              icon={Calculator}
              disabled={isLoadingLaporanProduk || selectedProducts.length === 0}
              label="Hitung Pendapatan Produk"
              handleBtn={handleShowModalHitungPendapatanProduk}
            />
          )}
        </div>

        {/* statistik */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <CardStatistik
            isLoading={isLoadingLaporanGlobal}
            icon={{
              icon: Package,
              bgColor: "bg-blue-100",
              iconColor: "text-blue-400",
            }}
            label="Total Produk Terjual"
            value={formatNumber(statistik.totalProdukTerjual) || "0"}
            caption="Jumlah produk terjual"
          />

          <CardStatistik
            isLoading={isLoadingLaporanGlobal}
            icon={{
              icon: Banknote,
              bgColor: "bg-emerald-100",
              iconColor: "text-emerald-400",
            }}
            label="Total Quantity Terjual"
            value={formatNumber(statistik.totalQtyTerjual)}
            caption="Jumlah quantity terjual"
          />

          <CardStatistik
            isLoading={isLoadingLaporanGlobal}
            icon={{
              icon: Wallet,
              bgColor: "bg-purple-100",
              iconColor: "text-purple-400",
            }}
            label="Total Omzet Terjual"
            value={formatRupiah(statistik.totalOmzet)}
            caption="Jumlah omzet terjual"
          />

          <CardStatistik
            isLoading={isLoadingLaporanGlobal}
            icon={{
              icon: ChartLine,
              bgColor: "bg-emerald-100",
              iconColor: "text-emerald-400",
            }}
            label="Total Laba Terjual"
            value={formatRupiah(statistik.totalLaba)}
            caption="Jumlah laba terjual"
          />
        </div>
      </div>

      {/* ============================================================
          DAFTAR KATEGORI - DESKTOP
      ============================================================ */}
      {kategori.id === 0 && (
        <div className="overflow-x-auto w-full bg-base-100 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm hidden lg:flex mt-2.5">
          <table className="table table-xs lg:table-sm table-zebra">
            <thead>
              <tr className="h-12 bg-base-200 text-[0.7rem]">
                <th>No</th>
                <th>Kategori</th>
                <th>Total Produk Terjual</th>
                <th>Total Quantity Terjual</th>
                <th>Total Omzet</th>
                <th>Total Laba</th>
                <th align="center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {isLoadingLaporanGlobal ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={8}>
                      <div className="skeleton h-12 w-full py-1" />
                    </td>
                  </tr>
                ))
              ) : dataPenjualanProduk?.data?.kategori &&
                dataPenjualanProduk.data.kategori.length > 0 ? (
                dataPenjualanProduk.data.kategori.map((item, index) => (
                  <tr
                    key={item.kategoriId}
                    className={cn(
                      "transition-all duration-75 ease-in-out h-18 text-[0.7rem] text-base-content",
                    )}
                  >
                    <td>{index + 1}</td>

                    <td className="font-semibold">{item.namaKategori}</td>

                    <td>{formatNumber(item.totalProdukTerjual)}</td>

                    <td>{formatNumber(item.totalQtyTerjual)}</td>

                    <td>{formatRupiah(item.totalOmzet)}</td>

                    <td>{formatRupiah(item.totalLaba)}</td>

                    <td align="center">
                      <ButtonDetailTable
                        handleRedirect={() =>
                          setKategori({
                            id: item.kategoriId,
                            nama: item.namaKategori,
                          })
                        }
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="w-full h-full flex flex-col justify-center items-center">
                      <DataEmpty
                        title="Data Kategori Tidak Tersedia"
                        description="Belum ada data kategori yang dapat ditampilkan saat ini."
                        xs
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================
          DAFTAR KATEGORI - MOBILE
      ============================================================ */}
      {kategori.id === 0 && (
        <div className="w-full lg:hidden flex flex-col gap-2.5 mt-2.5">
          {isLoadingLaporanGlobal ? (
            Array.from({ length: 4 }).map((_, index) => (
              <CardKategoriSkeleton key={index} />
            ))
          ) : dataPenjualanProduk?.data?.kategori &&
            dataPenjualanProduk.data.kategori.length > 0 ? (
            dataPenjualanProduk.data.kategori.map((item, index) => (
              <CardKategori
                key={item.kategoriId}
                nomor={index + 1}
                nama={item.namaKategori}
                totalProdukTerjual={item.totalProdukTerjual}
                totalQuantity={item.totalQtyTerjual}
                totalOmzet={item.totalOmzet}
                totalLaba={item.totalLaba}
                handleClick={() =>
                  setKategori({
                    id: item.kategoriId,
                    nama: item.namaKategori,
                  })
                }
              />
            ))
          ) : (
            <div className="w-full bg-base-100 rounded-2xl border border-transparent dark:border-base-content/10 shadow-sm py-10">
              <DataEmpty
                title="Data Kategori Tidak Tersedia"
                description="Belum ada data kategori yang dapat ditampilkan saat ini."
                xs
              />
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          DAFTAR PRODUK - DESKTOP
      ============================================================ */}
      {kategori.id !== 0 && (
        <div className="overflow-x-auto w-full bg-base-100 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm hidden lg:flex mt-2.5">
          <table className="table table-xs lg:table-sm table-zebra">
            <thead>
              <tr className="h-12 bg-base-200 text-[0.7rem]">
                <th>
                  {/* input checked */}
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={
                        (dataPenjualanProdukByKategori?.data?.produk?.length ??
                          0) > 0 &&
                        selectedProducts.length ===
                          (dataPenjualanProdukByKategori?.data?.produk
                            ?.length ?? 0)
                      }
                      onChange={handlePilihSemuaProduk}
                    />
                  </label>
                </th>
                <th>No</th>
                <th>Foto</th>
                <th>Nama</th>
                <th>Total Qty Terjual</th>
                <th>Total Omzet</th>
                <th>Total Laba</th>
              </tr>
            </thead>

            <tbody>
              {isLoadingLaporanByKategori ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={9}>
                      <div className="skeleton h-12 w-full py-1" />
                    </td>
                  </tr>
                ))
              ) : dataPenjualanProdukByKategori?.data?.produk &&
                dataPenjualanProdukByKategori.data.produk.length > 0 ? (
                dataPenjualanProdukByKategori.data.produk.map((item, index) => (
                  <Fragment key={item.id}>
                    {index > 0 && index % 25 === 0 && (
                      <tr className="h-12 bg-base-200 text-[0.7rem] text-base-content/60">
                        <th>...</th>
                        <th>No</th>
                        <th>Foto</th>
                        <th>Nama</th>
                        <th>Total Qty Terjual</th>
                        <th>Total Omzet</th>
                        <th>Total Laba</th>
                      </tr>
                    )}

                    <tr className="transition-all duration-75 ease-in-out h-18 text-[0.7rem] text-base-content">
                      <td>
                        <label>
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={selectedProducts.some(
                              (selected) => selected.id === item.id,
                            )}
                            onChange={() => handlePilihProduk(item)}
                          />
                        </label>
                      </td>

                      <td>{index + 1}</td>

                      <td>
                        <div className="avatar">
                          <div className="mask mask-squircle w-10 h-10 lg:h-12 lg:w-12">
                            <img
                              src={item.img}
                              alt={item.nama}
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="flex flex-col justify-start items-start">
                          <p className="font-medium">{item.nama}</p>

                          <p className="text-base-content/60">
                            {item.kode ?? "-"}
                          </p>
                        </div>
                      </td>

                      <td>{formatNumber(item.totalQtyTerjual)}</td>

                      <td>{formatRupiah(item.totalOmzet)}</td>

                      <td>{formatRupiah(item.totalLaba)}</td>
                    </tr>
                  </Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
                    <div className="w-full h-full flex flex-col justify-center items-center">
                      <DataEmpty
                        title="Data Produk Tidak Tersedia"
                        description="Belum ada data produk yang dapat ditampilkan saat ini."
                        xs
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================
          DAFTAR PRODUK - MOBILE
      ============================================================ */}
      {kategori.id !== 0 && (
        <div className="w-full lg:hidden flex flex-col gap-2.5 mt-2.5">
          {isLoadingLaporanByKategori ? (
            Array.from({ length: 4 }).map((_, index) => (
              <CardProdukSkeleton key={index} />
            ))
          ) : dataPenjualanProdukByKategori?.data?.produk &&
            dataPenjualanProdukByKategori.data.produk.length > 0 ? (
            dataPenjualanProdukByKategori.data.produk.map((item) => (
              <CardProduk key={item.id} produk={item} />
            ))
          ) : (
            <div className="w-full bg-base-100 rounded-2xl border border-transparent dark:border-base-content/10 shadow-sm py-10">
              <DataEmpty
                title="Data Produk Tidak Tersedia"
                description="Belum ada data produk yang dapat ditampilkan saat ini."
                xs
              />
            </div>
          )}
        </div>
      )}

      {/* modal hitung  */}
      <ModalHitungPendapatanProduk
        dataChooses={selectedProducts}
        handleCloseModal={handleCloseModalHitungPendapatanProduk}
        kategori={kategori.nama}
        modalRef={modalHitungPendapatanProdukRef}
      />
    </div>
  );
};

/* ============================================================
    TYPE CARD PRODUK
============================================================ */

type CardProdukProps = {
  produk: {
    id: number;
    img: string;
    nama: string;
    kode: string | null;
    totalQtyTerjual: number;
    totalOmzet: number;
    totalLaba: number;
  };
};

/* ============================================================
    CARD PRODUK MOBILE
============================================================ */

const CardProduk: FC<CardProdukProps> = ({ produk }) => {
  return (
    <div className="w-full bg-base-100 rounded-2xl flex flex-col justify-start items-start p-4 border border-transparent dark:border-base-content/10 shadow-sm gap-3">
      {/* ========================================================
          HEADER PRODUK
      ======================================================== */}
      <div className="w-full flex justify-between items-start gap-3 pb-3 border-b border-base-content/10">
        <div className="flex items-start gap-3 min-w-0">
          {/* foto */}
          <div className="w-14 h-14 shrink-0 overflow-hidden rounded-xl bg-base-200">
            <img
              src={produk.img}
              alt={produk.nama}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>

          {/* informasi produk */}
          <div className="flex flex-col justify-start items-start gap-0.5 min-w-0">
            <span className="text-sm font-semibold text-base-content line-clamp-2">
              {produk.nama}
            </span>

            <span className="text-[0.65rem] text-base-content/60">
              {produk.kode ?? "-"}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[0.6rem] text-base-content/60">
            Total Qty Terjual
          </span>

          <span className="text-xs font-semibold text-primary">
            {formatNumber(produk.totalQtyTerjual)}
          </span>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-2">
        <div className="bg-base-200/60 rounded-xl p-2.5 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex justify-center items-center">
              <Banknote className="size-3 text-emerald-600" />
            </div>

            <span className="text-[0.6rem] text-base-content/60">
              Total Omzet
            </span>
          </div>

          <span className="text-[0.7rem] font-medium text-base-content">
            {formatRupiah(produk.totalOmzet)}
          </span>
        </div>

        <div className="bg-base-200/60 rounded-xl p-2.5 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex justify-center items-center">
              <Banknote className="size-3 text-blue-600" />
            </div>

            <span className="text-[0.6rem] text-base-content/60">
              Total Laba
            </span>
          </div>

          <span className="text-[0.7rem] font-medium text-base-content">
            {formatRupiah(produk.totalLaba)}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
    TYPE CARD KATEGORI
============================================================ */

type CardKategoriProps = {
  nomor: number;
  nama: string;
  totalProdukTerjual: number;
  totalQuantity: number;
  totalOmzet: number;
  totalLaba: number;
  handleClick: () => void;
};

/* ============================================================
    CARD KATEGORI MOBILE
============================================================ */

const CardKategori: FC<CardKategoriProps> = ({
  nomor,
  nama,
  totalProdukTerjual,
  totalQuantity,
  totalOmzet,
  totalLaba,
  handleClick,
}) => {
  return (
    <div className="w-full bg-base-100 rounded-2xl p-4 border border-transparent dark:border-base-content/10 shadow-sm flex flex-col gap-3">
      {/* header */}
      <div className="w-full flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-[0.6rem] text-base-content/60">
            Kategori #{nomor}
          </span>

          <span className="text-sm font-semibold text-base-content">
            {nama}
          </span>
        </div>

        <div className="flex flex-col items-center px-2 gap-1">
          <span className="text-[0.58rem] text-center text-base-content/60">
            Produk Terjual
          </span>

          <span className="text-xs font-semibold">
            {formatNumber(totalProdukTerjual)}
          </span>
        </div>

        <ButtonWithIcon
          icon={ArrowRight}
          reverse
          label="Detail"
          handleBtn={() => handleClick()}
          customHeight="h-8.5"
        />
      </div>

      {/* statistik */}
      <div className="w-full grid grid-cols-3 divide-x divide-base-content/10 border-y border-base-content/10 py-3">
        <div className="flex flex-col items-center px-2 gap-1">
          <span className="text-[0.58rem] text-center text-base-content/60">
            Total Quantity
          </span>

          <span className="text-xs font-semibold">
            {formatNumber(totalQuantity)}
          </span>
        </div>

        <div className="flex flex-col items-center px-2 gap-1">
          <span className="text-[0.58rem] text-center text-base-content/60">
            Ttl. Omzet
          </span>

          <span className="text-xs text-center font-semibold text-primary">
            {formatRupiah(totalOmzet)}
          </span>
        </div>
        <div className="flex flex-col items-center px-2 gap-1">
          <span className="text-[0.58rem] text-center text-base-content/60">
            Ttl. Laba
          </span>

          <span className="text-xs text-center font-semibold text-primary">
            {formatRupiah(totalLaba)}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
    SKELETON CARD PRODUK
============================================================ */

const CardProdukSkeleton: FC = () => {
  return (
    <div className="w-full bg-base-100 rounded-2xl p-4 border border-transparent dark:border-base-content/10 shadow-sm flex flex-col gap-3">
      <div className="w-full flex gap-3">
        <div className="skeleton w-14 h-14 rounded-xl shrink-0" />

        <div className="flex flex-col gap-2 flex-1">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="skeleton h-16 w-full rounded-xl" />
        <div className="skeleton h-16 w-full rounded-xl" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="skeleton h-12 w-full" />
        <div className="skeleton h-12 w-full" />
        <div className="skeleton h-12 w-full" />
      </div>
    </div>
  );
};

/* ============================================================
    SKELETON CARD KATEGORI
============================================================ */

const CardKategoriSkeleton: FC = () => {
  return (
    <div className="w-full bg-base-100 rounded-2xl p-4 border border-transparent dark:border-base-content/10 shadow-sm flex flex-col gap-3">
      <div className="w-full flex justify-between">
        <div className="flex flex-col gap-2">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-4 w-32" />
        </div>

        <div className="skeleton h-8 w-8 rounded-lg" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="skeleton h-12 w-full" />
        <div className="skeleton h-12 w-full" />
        <div className="skeleton h-12 w-full" />
      </div>
    </div>
  );
};

export default LaporanPenjualanProduk;
